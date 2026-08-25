import { supabase } from './supabase';

export const handleLogout = (role: 'admin' | 'socio') => {
  const sessionKey = role === 'admin' ? 'miph_municipal_session' : 'miph_comercio_session';
  localStorage.removeItem(sessionKey);
  window.location.href = '/login';
};

export const getSession = (role: 'admin' | 'socio') => {
  const sessionKey = role === 'admin' ? 'miph_municipal_session' : 'miph_comercio_session';
  const session = localStorage.getItem(sessionKey);
  return session ? JSON.parse(session) : null;
};
