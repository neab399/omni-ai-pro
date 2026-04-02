import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { genId } from '../lib/models';

/**
 * Custom hook for managing conversations and chat histories.
 * Extracts conversation-specific logic from ChatPage.
 */
export default function useConversations(currentUser, addToast) {
  const [conversations, setConversations] = useState([{ id: 'default', title: 'New Conversation', createdAt: Date.now(), pinned: false }]);
  const [activeConvId, setActiveConvId] = useState('default');
  const [chatHistories, setChatHistories] = useState({ default: {} });
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  /* ── Load chats from DB ───────────────────────────────── */
  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const { data, error } = await supabase.from('chats').select('*').eq('user_id', currentUser.id).order('updated_at', { ascending: false });
        if (!error && data?.length > 0) {
          setConversations(data.map(c => ({ id: c.id, title: c.title, pinned: c.pinned, createdAt: c.created_at })));
          const h = {}; 
          data.forEach(c => { h[c.id] = c.history || {}; });
          setChatHistories(h); 
          setActiveConvId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load chats:', err);
        if (addToast) addToast('Failed to load chat history', 'error');
      }
    })();
  }, [currentUser, addToast]);

  const saveChatToDB = useCallback(async (convId, title, history, pinned) => {
    if (!currentUser) return;
    try {
      await supabase.from('chats').upsert({ 
        id: convId, 
        user_id: currentUser.id, 
        title, 
        history, 
        pinned, 
        updated_at: Date.now() 
      });
    } catch (err) {
      console.error('Failed to save chat:', err);
    }
  }, [currentUser]);

  const activeConv = conversations.find(c => c.id === activeConvId);

  const getCurrentHistory = useCallback(key => chatHistories[activeConvId]?.[key] || [], [chatHistories, activeConvId]);

  const sortedConvs = useMemo(() => {
    const pin   = conversations.filter(c =>  c.pinned).sort((a, b) => b.createdAt - a.createdAt);
    const unpin = conversations.filter(c => !c.pinned).sort((a, b) => b.createdAt - a.createdAt);
    return [...pin, ...unpin];
  }, [conversations]);

  const handleNewConv = useCallback((inputRef) => {
    const id = genId();
    setConversations(p => [{ id, title: 'New Conversation', createdAt: Date.now(), pinned: false }, ...p]);
    setChatHistories(p => ({ ...p, [id]: {} }));
    setActiveConvId(id);
    if (inputRef?.current) setTimeout(() => inputRef.current.focus(), 100);
    return id;
  }, []);

  const handleDeleteConv = useCallback(async (id) => {
    setConversations(p => p.filter(c => c.id !== id));
    setChatHistories(p => { 
      const n = { ...p }; 
      delete n[id]; 
      return n; 
    });
    
    if (currentUser) {
      await supabase.from('chats').delete().eq('id', id);
    }
    
    if (activeConvId === id) {
      handleNewConv();
    }
    if (addToast) addToast('Chat deleted');
  }, [currentUser, activeConvId, handleNewConv, addToast]);

  const handlePinConv = useCallback(id => {
    setConversations(p => p.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c));
  }, []);

  const handleRenameConv = useCallback((id, value) => {
    if (!value.trim()) return;
    setConversations(p => p.map(c => c.id === id ? { ...c, title: value.trim() } : c));
    setRenamingId(null);
  }, []);

  const handleStartRename = useCallback((id, currentTitle) => {
    setRenamingId(id);
    setRenameValue(currentTitle);
  }, []);

  return {
    conversations,
    setConversations,
    activeConvId,
    setActiveConvId,
    chatHistories,
    setChatHistories,
    renamingId,
    setRenamingId,
    renameValue,
    setRenameValue,
    activeConv,
    getCurrentHistory,
    sortedConvs,
    handleNewConv,
    handleDeleteConv,
    handlePinConv,
    handleRenameConv,
    handleStartRename,
    saveChatToDB
  };
}
