import { useState, useCallback } from 'react';
import { TEXT_PROVIDERS } from '../lib/models';

/**
 * Custom hook for managing AI model selection and modes.
 * Extracts model-specific logic from ChatPage.
 */
export default function useModelManagement(addToast) {
  const [isMultiMode, setIsMultiMode] = useState(false);
  const [showModelSel, setShowModelSel] = useState(false);
  const [activeModels, setActiveModels] = useState([{
    ...TEXT_PROVIDERS.find(p => p.id === 'meta').models[0],
    providerId: 'meta', slug: 'meta', color: '#0081fb',
  }]);

  const handleModelSelect = useCallback((model, provider) => {
    const m = { ...model, providerId: provider.id, slug: provider.slug, color: provider.color };
    if (isMultiMode) {
      if (activeModels.find(x => x.id === model.id && x.providerId === provider.id)) {
        if (activeModels.length === 1) {
          if (addToast) addToast('Need at least 1 model', 'error');
          return;
        }
        setActiveModels(p => p.filter(x => !(x.id === model.id && x.providerId === provider.id)));
        if (addToast) addToast(`Removed ${model.name}`);
      } else {
        setActiveModels(p => [...p, m]);
        if (addToast) addToast(`Added ${model.name}`, 'success');
      }
    } else {
      setActiveModels([m]);
      setShowModelSel(false);
      if (addToast) addToast(`Switched to ${model.name}`, 'success');
    }
  }, [isMultiMode, activeModels, addToast]);

  const removeModelFromChat = useCallback((modelId, providerId) => {
    if (activeModels.length === 1) {
      if (addToast) addToast('Need at least 1 model', 'error');
      return;
    }
    setActiveModels(p => p.filter(m => !(m.id === modelId && m.providerId === providerId)));
  }, [activeModels, addToast]);

  const continueWithModel = useCallback(model => {
    setActiveModels([model]);
    setIsMultiMode(false);
    if (addToast) addToast(`Continued with ${model.name}`, 'success');
  }, [addToast]);

  return {
    isMultiMode,
    setIsMultiMode,
    showModelSel,
    setShowModelSel,
    activeModels,
    setActiveModels,
    handleModelSelect,
    removeModelFromChat,
    continueWithModel
  };
}
