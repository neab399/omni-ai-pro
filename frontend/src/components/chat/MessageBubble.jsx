import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTime, estimateTokens, parseMarkdown, IC } from '../../lib/models';
import { UserAvatar, ModelAvatar, TypingIndicator, ActionBtn } from './ChatUIKit';

/* ══════════════════════════════════════════════════════════
   MESSAGE BUBBLE
══════════════════════════════════════════════════════════ */
export default function MessageBubble({ msg, model, userProfile, onCopy, onDelete, onRegenerate, isCompact }) {
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onTouchStart={() => setShowActions(true)}
      style={{ display: 'flex', gap: 10, flexDirection: isUser ? 'row-reverse' : 'row', position: 'relative', padding: '4px 0' }}
    >
      {isUser
        ? <UserAvatar profile={userProfile} size={32} />
        : <ModelAvatar model={model} size={32} />}

      <div style={{ maxWidth: isCompact ? '88%' : '78%', display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexDirection: isUser ? 'row-reverse' : 'row' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: isUser ? 'var(--text-sec)' : (model?.color || 'var(--text-main)'), letterSpacing: '0.01em' }}>
            {isUser ? 'You' : (model?.name || 'AI')}
          </span>
          <span style={{ fontSize: 10, color: 'var(--text-faint)', fontFamily: "'JetBrains Mono',monospace" }}>
            {formatTime(msg.timestamp)}
          </span>
        </div>

        <div style={{
          background: isUser ? 'rgba(255,255,255,0.07)' : 'transparent',
          border: 'none',
          padding: isUser ? '12px 16px' : '4px 0 4px 2px',
          borderRadius: isUser ? '20px 4px 20px 20px' : 0,
          wordBreak: 'break-word',
          overflow: 'hidden',
        }}>
          {msg.isStreaming
            ? <TypingIndicator />
            : <div dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }} />}
        </div>

        {!isUser && !msg.isStreaming && msg.content && (
          <span style={{ fontSize: 10.5, color: 'var(--text-faint)', paddingLeft: 2 }}>
            ~{estimateTokens(msg.content).toLocaleString()} tokens
          </span>
        )}
      </div>

      <AnimatePresence>
        {showActions && !msg.isStreaming && (
          <motion.div
            initial={{ opacity: 0, scale: .9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: .9 }}
            style={{ position: 'absolute', top: -10, [isUser ? 'left' : 'right']: 0, display: 'flex', gap: 2, background: 'var(--bg-panel)', border: '1px solid var(--border-med)', borderRadius: 9, padding: '4px 5px', zIndex: 10, boxShadow: 'var(--shadow-sm)' }}
          >
            <ActionBtn
              onClick={() => { onCopy(msg.content); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
              title="Copy"
            >
              {copied ? <IC.Check /> : <IC.Copy />}
            </ActionBtn>
            {!isUser && onRegenerate && (
              <ActionBtn onClick={onRegenerate} title="Regenerate"><IC.Bolt /></ActionBtn>
            )}
            <ActionBtn onClick={() => onDelete(msg.id)} title="Delete" danger>
              <IC.Trash />
            </ActionBtn>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
