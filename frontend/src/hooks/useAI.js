import { supabase } from '../lib/supabase';

const API_BASE = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:5000` : 'http://localhost:5000');

/**
 * Shared logic for calling OmniAI backend APIs with authentication.
 */
export const useAI = () => {
  const callAI = async (endpoint, body) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || '';

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API Error ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error(`AI Call Failed [${endpoint}]:`, err);
      throw err;
    }
  };

  return { callAI, API_BASE };
};
