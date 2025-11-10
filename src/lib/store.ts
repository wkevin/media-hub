import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { MediaFile } from '../../worker/types';
interface MediaState {
  files: MediaFile[];
  isLoading: boolean;
  error: string | null;
}
interface MediaActions {
  fetchFiles: () => Promise<void>;
  addFile: (file: MediaFile) => void;
  updateFileStatus: (id: string, status: 'processed' | 'processing' | 'failed', summary?: string, tags?: string[]) => void;
}
export const useMediaStore = create<MediaState & MediaActions>()(
  immer((set) => ({
    files: [],
    isLoading: false,
    error: null,
    fetchFiles: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch('/api/media');
        if (!response.ok) throw new Error('Failed to fetch files');
        const data = await response.json();
        if (data.success) {
          set({ files: data.data, isLoading: false });
        } else {
          throw new Error(data.error || 'Failed to fetch files');
        }
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
      }
    },
    addFile: (file) => {
      set((state) => {
        state.files.unshift(file);
      });
    },
    updateFileStatus: (id, status, summary, tags) => {
      set((state) => {
        const file = state.files.find((f) => f.id === id);
        if (file) {
          file.status = status;
          if (summary) file.summary = summary;
          if (tags) file.tags = tags;
        }
      });
    },
  }))
);