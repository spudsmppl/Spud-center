import { create } from 'zustand';
import { authAPI } from '../api/client';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login(email, password);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
      throw error;
    }
  },

  register: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.register(email, password);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Registration failed', isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  clearError: () => set({ error: null }),

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      try {
        set({ token, user: JSON.parse(user) });
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  },
}));

interface Node {
  _id: string;
  name: string;
  url: string;
  status: 'live' | 'stopped' | 'unstable';
  statusCode: number;
  responseTime: number;
  description?: string;
  isMonitoring: boolean;
  lastChecked?: string;
}

interface NodeStore {
  nodes: Node[];
  isLoading: boolean;
  error: string | null;
  selectedNode: Node | null;
  fetchNodes: () => Promise<void>;
  selectNode: (node: Node | null) => void;
  addNode: (node: Node) => void;
  updateNode: (node: Node) => void;
  removeNode: (id: string) => void;
  clearError: () => void;
}

export const useNodeStore = create<NodeStore>((set) => ({
  nodes: [],
  isLoading: false,
  error: null,
  selectedNode: null,

  fetchNodes: async () => {
    set({ isLoading: true, error: null });
    try {
      // This will be called from API
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  selectNode: (node) => set({ selectedNode: node }),

  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),

  updateNode: (updatedNode) =>
    set((state) => ({
      nodes: state.nodes.map((node) => (node._id === updatedNode._id ? updatedNode : node)),
      selectedNode: state.selectedNode?._id === updatedNode._id ? updatedNode : state.selectedNode,
    })),

  removeNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node._id !== id),
      selectedNode: state.selectedNode?._id === id ? null : state.selectedNode,
    })),

  clearError: () => set({ error: null }),
}));
