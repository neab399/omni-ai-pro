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
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onTouchStart={() => setShowActions(true)}
      style={{ 
        display: 'grid', 
        gridTemplateColumns: isCompact ? 'minmax(0, 1fr)' : (isUser ? 'minmax(0, 1fr) 32px' : '32px minmax(0, 1fr)'), 
        gap: isCompact ? 4 : 10, 
        position: 'relative', 
        padding: '4px 0', 
        width: '100%' 
      }}
    >
      {!isCompact && !isUser && (
        <div style={{ width: 32, height: 32 }}>
          <ModelAvatar model={model} size={32} />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, width: '100%', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isCompact ? 6 : 8, flexDirection: isUser ? 'row-reverse' : 'row' }}>
          
          {isCompact && (
            <div style={{ width: 22, height: 22 }}>
              {isUser ? <UserAvatar profile={userProfile} size={22} /> : <ModelAvatar model={model} size={22} />}
            </div>
          )}

          <span style={{ fontSize: isCompact ? 11.5 : 12, fontWeight: 700, color: isUser ? 'var(--text-sec)' : (model?.color || 'var(--text-main)'), letterSpacing: '0.01em' }}>
            {isUser ? 'You' : (model?.name || 'AI')}
          </span>
          <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <motion.div 
          animate={msg.isStreaming && msg.content ? { textShadow: ['0 0 8px rgba(255,217,61,0.8)', '0 0 0px rgba(255,217,61,0)'] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
          background: isUser ? 'rgba(255,255,255,0.07)' : 'transparent',
          border: 'none',
          padding: isUser ? '12px 16px' : '4px 0 4px 2px',
          borderRadius: isUser ? '20px 4px 20px 20px' : 0,
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          width: isUser ? 'fit-content' : '100%',
          alignSelf: isUser ? 'flex-end' : 'stretch',
          boxSizing: 'border-box'
        }}>
          {msg.isStreaming && !msg.content
            ? <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><TypingIndicator /><span style={{fontSize: 10, color: 'var(--accent)', animation: 'pulse-glow 2s infinite'}}>Generating...</span></div>
            : <div className={msg.isStreaming ? 'streaming-text-glow' : ''} style={{ width: '100%', minWidth: 0, overflowX: 'auto', overflowY: 'visible', boxSizing: 'border-box' }} dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) + (msg.isStreaming ? '<span class="cursor-blink text-omin-gold">▎</span>' : '') }} />}
        </motion.div>

        {!isUser && !msg.isStreaming && msg.content && (
          <span style={{ fontSize: 10.5, color: 'var(--text-faint)', paddingLeft: 2 }}>
            ~{estimateTokens(msg.content).toLocaleString()} tokens
          </span>
        )}
      </div>

      {!isCompact && isUser && (
        <div style={{ width: 32, height: 32 }}>
          <UserAvatar profile={userProfile} size={32} />
        </div>
      )}

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
