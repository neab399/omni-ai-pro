import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useArtifacts } from '../../context/ArtifactContext';
import { IC } from '../../lib/models';

const ArtifactPanel = () => {
  const { activeArtifact, isOpen, closePanel } = useArtifacts();
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'code'
  const iframeRef = useRef(null);

  useEffect(() => {
    if (activeArtifact && activeTab === 'preview' && iframeRef.current) {
      const { code, type } = activeArtifact;
      
      let htmlContent = '';
      if (type === 'html' || type === 'javascript' || type === 'css') {
        const css = type === 'css' ? `<style>${code}</style>` : '';
        const js = type === 'javascript' ? `<script>${code}</script>` : '';
        const html = type === 'html' ? code : '';
        
        htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                body { margin: 0; font-family: -apple-system, system-ui, sans-serif; background: #fff; color: #333; }
                * { box-sizing: border-box; }
              </style>
              ${css}
            </head>
            <body>
              ${html}
              ${js}
            </body>
          </html>
        `;
      } else if (type === 'mermaid') {
        htmlContent = `
          <html>
            <head>
              <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
              <script>mermaid.initialize({ startOnLoad: true, theme: 'default' });</script>
            </head>
            <body>
              <pre class="mermaid">${code}</pre>
            </body>
          </html>
        `;
      }

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      iframeRef.current.src = url;
      
      return () => URL.revokeObjectURL(url);
    }
  }, [activeArtifact, activeTab]);

  if (!activeArtifact) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{
            position: 'fixed',
            right: 0,
            top: 0,
            bottom: 0,
            width: 'min(90vw, 800px)',
            background: 'var(--bg-modal)',
            borderLeft: '1px solid var(--border-med)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-med)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-panel)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={closePanel} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                <IC.ChevronD style={{ transform: 'rotate(90deg)' }} />
              </button>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>
                  {activeArtifact.title || 'Artifact Preview'}
                </span>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {activeArtifact.type} artifact
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 8 }}>
               <button 
                onClick={() => setActiveTab('preview')}
                style={{ 
                  padding: '6px 12px', 
                  borderRadius: 6, 
                  fontSize: 12, 
                  background: activeTab === 'preview' ? 'var(--accent)' : 'transparent',
                  color: activeTab === 'preview' ? '#000' : 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >Preview</button>
              <button 
                onClick={() => setActiveTab('code')}
                style={{ 
                  padding: '6px 12px', 
                  borderRadius: 6, 
                  fontSize: 12, 
                  background: activeTab === 'code' ? 'var(--accent)' : 'transparent',
                  color: activeTab === 'code' ? '#000' : 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >Code</button>
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative', background: '#fff' }}>
            {activeTab === 'preview' ? (
              <iframe
                ref={iframeRef}
                style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
                title="Artifact Preview"
              />
            ) : (
              <div className="omni-scroll" style={{ width: '100%', height: '100%', padding: 20, overflow: 'auto', background: '#1e1e1e', color: '#d4d4d4', fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeigh: 1.6 }}>
                <pre style={{ margin: 0 }}>{activeArtifact.code}</pre>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-med)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(activeArtifact.code);
                // toast should be triggered here if global toast exists
              }}
              style={{ padding: '8px 16px', borderRadius: 8, background: 'var(--bg-hover)', border: '1px solid var(--border-med)', color: 'var(--text-main)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
            >
              <IC.Copy /> Copy Source
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ArtifactPanel;
