import { useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { genId } from '../lib/models';
import { playSendSound, playReceiveSound, playErrorSound, initAudioContext } from '../lib/audio';

const API_BASE = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? `http://localhost:5000` : '');

/**
 * Custom hook for chat actions (send, regenerate, delete).
 * Extracts API interaction and streaming logic from ChatPage.
 */
export default function useChatActions({
  currentUser,
  activeConvId,
  activeConv,
  activeModels,
  chatHistories,
  setChatHistories,
  setConversations,
  addToast,
  soundEnabled,
  saveChatToDB,
  setInput
}) {

  const handleSend = useCallback(async (input) => {
    initAudioContext();
    const text = input.trim(); 
    if (!text) return;
    
    if (soundEnabled) playSendSound();
    
    // Gamification: Update Knowledge Points
    const currentKp = parseInt(localStorage.getItem('omni-kp') || '120');
    localStorage.setItem('omni-kp', (currentKp + 5).toString());
    window.dispatchEvent(new Event('storage')); 

    setInput('');
    const userMsg = { id: genId(), role: 'user', content: text, timestamp: Date.now() };
    
    setChatHistories(prev => {
      const updated = { ...prev };
      activeModels.forEach(model => {
        const key = `${model.providerId}-${model.id}`;
        updated[activeConvId] = { 
          ...(updated[activeConvId] || {}), 
          [key]: [...(updated[activeConvId]?.[key] || []), userMsg] 
        };
      });
      return updated;
    });

    if (activeConv?.title === 'New Conversation') {
      setConversations(p => p.map(c => c.id === activeConvId ? { ...c, title: text.slice(0, 36) + (text.length > 36 ? '…' : '') } : c));
    }

    activeModels.forEach(async model => {
      const key = `${model.providerId}-${model.id}`;
      const streamId = genId();
      
      setChatHistories(prev => ({
        ...prev,
        [activeConvId]: { 
          ...prev[activeConvId], 
          [key]: [...(prev[activeConvId]?.[key] || []), { id: streamId, role: 'assistant', content: '', isStreaming: true, model, timestamp: Date.now() }] 
        },
      }));

      try {
        const priorMsgs = (chatHistories[activeConvId]?.[key] || []).filter(m => !m.isStreaming).map(m => ({ role: m.role, content: m.content }));
        priorMsgs.push({ role: 'user', content: text });
        
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token || '';

        const response = await fetch(`${API_BASE}/api/chat`, {
          method: 'POST', 
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ messages: priorMsgs, providerId: model.providerId, modelId: model.id }),
        });
        
        if (!response.ok) throw new Error(`API Error ${response.status}`);
        
        const reader = response.body.getReader(); 
        const decoder = new TextDecoder(); 
        let reply = '';
        
        while (true) {
          const { done, value } = await reader.read(); 
          if (done) break;
          for (const chunk of decoder.decode(value).split('\n\n')) {
            if (chunk.startsWith('data: ')) {
              try {
                const d = JSON.parse(chunk.slice(6));
                if (d.type === 'chunk') {
                  reply += d.text;
                  setChatHistories(prev => {
                    const msgs = [...(prev[activeConvId]?.[key] || [])];
                    const i = msgs.findIndex(m => m.id === streamId);
                    if (i > -1) msgs[i] = { ...msgs[i], content: reply };
                    return { ...prev, [activeConvId]: { ...prev[activeConvId], [key]: msgs } };
                  });
                }
              } catch (_) {}
            }
          }
        }
        
        setChatHistories(prev => {
          const msgs = [...(prev[activeConvId]?.[key] || [])];
          const i = msgs.findIndex(m => m.id === streamId);
          if (i > -1) msgs[i] = { ...msgs[i], isStreaming: false };
          const updated = { ...prev, [activeConvId]: { ...prev[activeConvId], [key]: msgs } };
          saveChatToDB(activeConvId, activeConv?.title || 'Chat', updated[activeConvId], activeConv?.pinned || false);
          return updated;
        });
        
        if (soundEnabled) playReceiveSound();
      } catch (err) {
        let msg = err.message;
        if (msg === 'Failed to fetch') {
          msg = `Backend unreachable. If using Render Free Tier, the first request may take 60s.`;
        }
        setChatHistories(prev => {
          const msgs = [...(prev[activeConvId]?.[key] || [])];
          const i = msgs.findIndex(m => m.id === streamId);
          if (i > -1) msgs[i] = { ...msgs[i], content: `❌ **Connectivity Error:** ${msg}`, isStreaming: false };
          return { ...prev, [activeConvId]: { ...prev[activeConvId], [key]: msgs } };
        });
        addToast(`${model.name}: ${msg}`, 'error');
        if (soundEnabled) playErrorSound();
      }
    });
  }, [currentUser, activeConvId, activeConv, activeModels, chatHistories, setChatHistories, setConversations, addToast, soundEnabled, saveChatToDB, setInput]);

  const handleRegenerate = useCallback(async (model) => {
    const key = `${model.providerId}-${model.id}`;
    const history = chatHistories[activeConvId]?.[key] || [];
    const lastUser = [...history].reverse().find(m => m.role === 'user');
    if (!lastUser) return;

    setChatHistories(prev => {
      const msgs = [...(prev[activeConvId]?.[key] || [])];
      const lastAI = [...msgs].reverse().findIndex(m => m.role === 'assistant' && !m.isStreaming);
      if (lastAI !== -1) msgs.splice(msgs.length - 1 - lastAI, 1);
      return { ...prev, [activeConvId]: { ...prev[activeConvId], [key]: msgs } };
    });

    const streamId = genId();
    setChatHistories(prev => ({
      ...prev,
      [activeConvId]: { ...prev[activeConvId], [key]: [...(prev[activeConvId]?.[key] || []), { id: streamId, role: 'assistant', content: '', isStreaming: true, model, timestamp: Date.now() }] },
    }));

    try {
      const msgs = (chatHistories[activeConvId]?.[key] || []).filter(m => !m.isStreaming).map(m => ({ role: m.role, content: m.content }));
      
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || '';

      const response = await fetch(`${API_BASE}/api/chat`, { 
        method: 'POST', 
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }, 
        body: JSON.stringify({ messages: msgs, providerId: model.providerId, modelId: model.id }) 
      });
      
      if (!response.ok) throw new Error(`API Error ${response.status}`);
      
      const reader = response.body.getReader(); 
      const decoder = new TextDecoder(); 
      let reply = '';
      
      while (true) {
        const { done, value } = await reader.read(); 
        if (done) break;
        for (const chunk of decoder.decode(value).split('\n\n')) {
          if (chunk.startsWith('data: ')) {
            try {
              const d = JSON.parse(chunk.slice(6));
              if (d.type === 'chunk') {
                reply += d.text;
                setChatHistories(prev => { 
                  const m = [...(prev[activeConvId]?.[key] || [])]; 
                  const i = m.findIndex(x => x.id === streamId); 
                  if (i > -1) m[i] = { ...m[i], content: reply }; 
                  return { ...prev, [activeConvId]: { ...prev[activeConvId], [key]: m } }; 
                });
              }
            } catch (_) {}
          }
        }
      }
      
      setChatHistories(prev => { 
        const m = [...(prev[activeConvId]?.[key] || [])]; 
        const i = m.findIndex(x => x.id === streamId); 
        if (i > -1) m[i] = { ...m[i], isStreaming: false }; 
        return { ...prev, [activeConvId]: { ...prev[activeConvId], [key]: m } }; 
      });
      addToast('Regenerated', 'success');
    } catch (err) { 
      addToast('Regeneration failed', 'error'); 
    }
  }, [activeConvId, chatHistories, setChatHistories, addToast]);

  const handleDeleteMsg = useCallback((msgId) => {
    setChatHistories(prev => {
      const conv = { ...prev[activeConvId] };
      Object.keys(conv).forEach(k => { 
        conv[k] = (conv[k] || []).filter(m => m.id !== msgId); 
      });
      return { ...prev, [activeConvId]: conv };
    });
  }, [activeConvId, setChatHistories]);

  return { handleSend, handleRegenerate, handleDeleteMsg };
}
