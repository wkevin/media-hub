import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UploadCloud, File, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { AnimatePresence, motion } from 'framer-motion';
import { useMediaStore } from '@/lib/store';
import type { MediaFile, SignedUrlResponse } from '../../worker/types';
type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';
interface UploadDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}
export function UploadDialog({ isOpen, onOpenChange }: UploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const addFile = useMediaStore((state) => state.addFile);
  const pollFileStatus = useMediaStore((state) => state.pollFileStatus);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setStatus('idle');
      setProgress(0);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi'],
      'application/pdf': ['.pdf'],
      'audio/*': ['.mp3', '.wav', '.m4a'],
    },
  });
  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    setProgress(0);
    try {
      // 1. Get signed URL from our backend
      const signedUrlResponse = await fetch('/api/media/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, contentType: file.type }),
      });
      if (!signedUrlResponse.ok) throw new Error('Could not get signed URL');
      const { data: signedUrlData }: { data: SignedUrlResponse } = await signedUrlResponse.json();
      // 2. Upload file to the signed URL (simulated for now)
      await new Promise(resolve => {
        const interval = setInterval(() => {
          setProgress(p => {
            const newProgress = p + 20;
            if (newProgress >= 100) {
              clearInterval(interval);
              resolve(true);
              return 100;
            }
            return newProgress;
          });
        }, 200);
      });
      // 3. Notify backend that upload is complete
      const fileType = file.type.startsWith('video') ? 'video' : file.type.startsWith('audio') ? 'audio' : 'pdf';
      const newMediaFile: Omit<MediaFile, 'createdAt'> = {
        id: signedUrlData.fileId,
        title: file.name,
        type: fileType,
        summary: 'AI analysis is in progress...',
        tags: [],
        thumbnailUrl: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=2070&auto=format&fit=crop', // Placeholder
        fileUrl: signedUrlData.readUrl,
        status: 'processing',
      };
      const createMediaResponse = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMediaFile),
      });
      if (!createMediaResponse.ok) throw new Error('Failed to create media entry');
      const { data: createdMedia }: { data: MediaFile } = await createMediaResponse.json();
      // 4. Update frontend state and start polling
      addFile(createdMedia);
      pollFileStatus(createdMedia.id);
      setStatus('success');
    } catch (error) {
      console.error('Upload failed:', error);
      setStatus('error');
    }
  };
  const handleReset = () => {
    setFile(null);
    setStatus('idle');
    setProgress(0);
  };
  const handleClose = () => {
    if (status !== 'uploading') {
      handleReset();
      onOpenChange(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">Upload a File</DialogTitle>
          <DialogDescription>
            Upload a video, audio, or PDF file for AI analysis.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {!file ? (
            <div
              {...getRootProps()}
              className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-border hover:border-indigo-400'
              }`}
            >
              <input {...getInputProps()} />
              <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              {isDragActive ? (
                <p className="font-semibold text-indigo-600">Drop the file here...</p>
              ) : (
                <p>Drag & drop a file here, or click to select</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">Supports: Video, Audio, PDF</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={status}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {status === 'idle' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <File className="h-8 w-8 text-indigo-600" />
                      <div className="flex-1 overflow-hidden">
                        <p className="font-semibold truncate">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={handleReset}>Cancel</Button>
                      <Button onClick={handleUpload} className="bg-indigo-600 hover:bg-indigo-700">Upload & Analyze</Button>
                    </div>
                  </div>
                )}
                {status === 'uploading' && (
                  <div className="text-center space-y-4">
                    <Loader2 className="mx-auto h-12 w-12 text-indigo-600 animate-spin" />
                    <p className="font-semibold">Uploading and analyzing...</p>
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-muted-foreground">{progress}%</p>
                  </div>
                )}
                {status === 'success' && (
                  <div className="text-center space-y-4">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                    <p className="font-semibold">Upload Complete!</p>
                    <p className="text-muted-foreground">Your file is now being processed.</p>
                    <Button onClick={handleClose}>Done</Button>
                  </div>
                )}
                {status === 'error' && (
                  <div className="text-center space-y-4">
                    <XCircle className="mx-auto h-12 w-12 text-destructive" />
                    <p className="font-semibold">Upload Failed</p>
                    <p className="text-muted-foreground">Something went wrong. Please try again.</p>
                    <Button variant="outline" onClick={handleReset}>Try Again</Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}