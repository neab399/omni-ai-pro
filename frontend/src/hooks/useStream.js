/**
 * useStream.js
 * ════════════════════════════════════════════════════════
 * React hook that connects to your /api/chat/stream endpoint
 * and streams tokens into state in real time.
 *
 * Usage in ChatPage:
 *   const { send, streaming, abort } = useStream();
 *
 *   send({
 *     messages:    [...conversationHistory],
 *     modelId:     'gpt-4o',
 *     providerId:  'openai',
 *     onChunk:     (text) => appendToLastMessage(text),
 *     onDone:      (usage) => saveUsage(usage),
 *     onError:     (msg)  => showError(msg),
 *   });
 * ════════════════════════════════════════════════════════
 */

import { useState, useRef, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function useStream() {
  const [streaming, setStreaming] = useState(false);
  const abortRef  = useRef(null);

  const abort = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
      setStreaming(false);
    }
  }, []);

  const send = useCallback(async ({
    messages,
    modelId,
    providerId,
    systemPrompt,
    onChunk,
    onDone,
    onError,
  }) => {
    // Cancel any ongoing stream first
    abort();

    const controller  = new AbortController();
    abortRef.current  = controller;
    setStreaming(true);

    try {
      const res = await fetch(API_BASE + '/api/chat/stream', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages, modelId, providerId, systemPrompt }),
        signal:  controller.signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Server error ' + res.status }));
        onError?.(err.error || 'Server error');
        setStreaming(false);
        return;
      }

      // Read the SSE stream line by line
      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let   buffer  = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // keep incomplete line in buffer

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;

          try {
            const event = JSON.parse(jsonStr);
            if (event.type === 'chunk') {
              onChunk?.(event.text);
            } else if (event.type === 'done') {
              onDone?.(event.usage);
            } else if (event.type === 'error') {
              onError?.(event.message);
            }
          } catch {
            // malformed JSON — skip
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        onError?.(err.message || 'Stream connection failed');
      }
    } finally {
      abortRef.current = null;
      setStreaming(false);
    }
  }, [abort]);

  return { send, streaming, abort };
}

/* ════════════════════════════════════════════════════════
   TOKEN TRACKER HOOK
   Keeps a running total of tokens used this session.
   In production: persist to backend / localStorage.
════════════════════════════════════════════════════════ */
export function useTokenTracker(monthlyLimit = 4_000_000) {
  const [used, setUsed] = useState(0);

  const addUsage = useCallback((usage) => {
    if (!usage) return;
    const total = (usage.promptTokens || 0) + (usage.completionTokens || 0);
    setUsed(prev => prev + total);
  }, []);

  const remaining   = Math.max(0, monthlyLimit - used);
  const percentUsed = Math.min(100, (used / monthlyLimit) * 100);

  return { used, remaining, percentUsed, addUsage };
}