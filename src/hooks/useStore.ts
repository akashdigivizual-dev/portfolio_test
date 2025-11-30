import { create } from 'zustand';

interface State {
  currentSection: string;
  scrollProgress: number;
  setSection: (section: string) => void;
  setScrollProgress: (progress: number) => void;
}

export const useStore = create<State>((set) => ({
  currentSection: 'hero',
  scrollProgress: 0,
  setSection: (section) => set({ currentSection: section }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
}));