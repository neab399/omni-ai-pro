import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ArtifactContext = createContext();

export const useArtifacts = () => useContext(ArtifactContext);

export const ArtifactProvider = ({ children }) => {
  const [artifacts, setArtifacts] = useState([]);
  const [activeArtifactId, setActiveArtifactId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const addArtifact = useCallback((artifact) => {
    setArtifacts((prev) => {
      // If an artifact with the same title/type already exists in this conversation context, update it?
      // For now, just add new ones.
      const exists = prev.find(a => a.id === artifact.id);
      if (exists) return prev.map(a => a.id === artifact.id ? { ...a, ...artifact } : a);
      return [...prev, artifact];
    });
    setActiveArtifactId(artifact.id);
    setIsOpen(true);
  }, []);

  const closePanel = () => setIsOpen(false);
  const openPanel = () => setIsOpen(true);

  // ── Event Listener for Markdown Parser ──
  useEffect(() => {
    const handleView = (e) => {
      const { code, lang } = e.detail;
      const artifact = { 
        id: `artifact-${Math.random().toString(36).slice(2, 9)}`, 
        title: `Snippet in ${lang}`, 
        code, 
        type: lang === 'js' ? 'javascript' : lang 
      };
      addArtifact(artifact);
    };
    window.addEventListener('omni-view-artifact', handleView);
    return () => window.removeEventListener('omni-view-artifact', handleView);
  }, [addArtifact]);

  const activeArtifact = artifacts.find(a => a.id === activeArtifactId);

  return (
    <ArtifactContext.Provider value={{ 
      artifacts, 
      activeArtifact, 
      addArtifact, 
      activeArtifactId, 
      setActiveArtifactId, 
      isOpen, 
      setIsOpen,
      closePanel,
      openPanel
    }}>
      {children}
    </ArtifactContext.Provider>
  );
};
