import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Member';
  avatar: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

// Ensure safe access to localStorage during SSR
const getLocalStorageItem = (key: string) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

const setLocalStorageItem = (key: string, value: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

const removeLocalStorageItem = (key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

const initialUser = getLocalStorageItem('user') ? JSON.parse(getLocalStorageItem('user')!) : null;
const initialToken = getLocalStorageItem('token') ? getLocalStorageItem('token') : null;

export const useAuth = create<AuthState>((set) => ({
  user: initialUser,
  token: initialToken,
  login: (user, token) => {
    setLocalStorageItem('user', JSON.stringify(user));
    setLocalStorageItem('token', token);
    set({ user, token });
  },
  logout: () => {
    removeLocalStorageItem('user');
    removeLocalStorageItem('token');
    set({ user: null, token: null });
  },
}));
