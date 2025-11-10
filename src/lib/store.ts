import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { MediaFile } from '../../worker/types';
const pollingIntervals = new Map<string, number>();
interface MediaState {
  files: MediaFile[];
  isLoading: boolean;
  error: string | null;
}
interface MediaActions {
  fetchFiles: () => Promise<void>;
  addFile: (file: MediaFile) => void;
  updateFile: (file: MediaFile) => void;
  pollFileStatus: (fileId: string) => void;
}
export const useMediaStore = create<MediaState & MediaActions>()(
  immer((set, get) => ({
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
          // Start polling for any files that are still processing
          data.data.forEach((file: MediaFile) => {
            if (file.status === 'processing') {
              get().pollFileStatus(file.id);
            }
          });
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
    updateFile: (updatedFile) => {
      set((state) => {
        const index = state.files.findIndex((f) => f.id === updatedFile.id);
        if (index !== -1) {
          state.files[index] = updatedFile;
        }
      });
    },
    pollFileStatus: (fileId: string) => {
      if (pollingIntervals.has(fileId)) {
        return; // Already polling this file
      }
      const intervalId = window.setInterval(async () => {
        try {
          const response = await fetch(`/api/media/${fileId}/status`);
          if (!response.ok) {
            // Stop polling on 404 or other fatal errors
            clearInterval(intervalId);
            pollingIntervals.delete(fileId);
            return;
          }
          const result = await response.json();
          if (result.success && result.data.status !== 'processing') {
            get().updateFile(result.data);
            clearInterval(intervalId);
            pollingIntervals.delete(fileId);
          }
        } catch (error) {
          console.error(`Polling failed for ${fileId}:`, error);
          // Optionally stop polling on network errors
          clearInterval(intervalId);
          pollingIntervals.delete(fileId);
        }
      }, 5000); // Poll every 5 seconds
      pollingIntervals.set(fileId, intervalId);
    },
  }))
);