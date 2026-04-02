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
      initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onTouchStart={() => setShowActions(true)}
      style={{ 
        display: 'grid', 
        gridTemplateColumns: isCompact ? 'minmax(0, 1fr)' : (isUser ? 'minmax(0, 1fr) 34px' : '34px minmax(0, 1fr)'), 
        gap: isCompact ? 6 : 14, 
        position: 'relative', 
        padding: '8px 0', 
        width: '100%',
        willChange: 'transform, opacity'
      }}
    >
      {!isCompact && !isUser && (
        <div style={{ width: 34, height: 34, marginTop: 4 }}>
          <ModelAvatar model={model} size={34} />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, width: '100%', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isCompact ? 6 : 8, flexDirection: isUser ? 'row-reverse' : 'row', opacity: 0.8 }}>
          
          {isCompact && (
            <div style={{ width: 22, height: 22 }}>
              {isUser ? <UserAvatar profile={userProfile} size={22} /> : <ModelAvatar model={model} size={22} />}
            </div>
          )}

          <span style={{ fontSize: isCompact ? 11.5 : 12, fontWeight: 700, color: isUser ? 'var(--text-sec)' : (model?.color || 'var(--text-main)'), letterSpacing: '0.02em', fontFamily: "'Outfit', sans-serif" }}>
            {isUser ? 'You' : (model?.name || 'Assistant')}
          </span>
          <span style={{ fontSize: 10, color: 'var(--text-faint)', fontWeight: 500 }}>
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <motion.div 
          style={{
            background: isUser ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.015)',
            backdropFilter: isUser ? 'blur(8px)' : 'none',
            border: 'none',
            borderLeft: !isUser ? `2px solid ${model?.color || 'var(--accent)'}` : 'none',
            padding: isUser ? '14px 18px' : '6px 0 6px 16px',
            borderRadius: isUser ? '20px 4px 20px 20px' : 0,
            wordBreak: 'break-word',
            width: isUser ? 'fit-content' : '100%',
            alignSelf: isUser ? 'flex-end' : 'stretch',
            boxSizing: 'border-box',
            boxShadow: isUser ? '0 4px 20px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.05)' : 'none',
            position: 'relative'
          }}>
          {/* Subtle Liquid Glow for AI messages */}
          {!isUser && (
            <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, background: `linear-gradient(to bottom, transparent, ${model?.color || 'var(--accent)'}, transparent)`, filter: 'blur(4px)', opacity: 0.6 }} />
          )}

          {msg.isStreaming && !msg.content
            ? <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' }}><TypingIndicator /><span style={{fontSize: 10.5, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.05em'}}>SYNCHRONIZING...</span></div>
            : <div className={msg.isStreaming ? 'streaming-text-glow' : ''} style={{ fontSize: isCompact ? 14 : 15, lineHeight: 1.6, color: 'var(--text-main)', opacity: 0.95 }} dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) + (msg.isStreaming ? '<span class="cursor-blink text-omin-gold">▎</span>' : '') }} />}
        </motion.div>

        {!isUser && !msg.isStreaming && msg.content && (
          <div style={{ fontSize: 10, color: 'var(--text-faint)', paddingLeft: isUser ? 0 : 16, textAlign: isUser ? 'right' : 'left', display: 'flex', gap: 10, opacity: 0.6 }}>
            <span>~{estimateTokens(msg.content).toLocaleString()} tokens</span>
            <span>•</span>
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verified Intelligence</span>
          </div>
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
