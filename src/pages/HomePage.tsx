import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaStore } from '@/lib/store';
import { Header } from '@/components/Header';
import { MediaCard } from '@/components/MediaCard';
import { UploadDialog } from '@/components/UploadDialog';
import { Input } from '@/components/ui/input';
import { Search, FileUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
export function HomePage() {
  const [isUploadOpen, setUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const files = useMediaStore((state) => state.files);
  const isLoading = useMediaStore((state) => state.isLoading);
  const error = useMediaStore((state) => state.error);
  const fetchFiles = useMediaStore((state) => state.fetchFiles);
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);
  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
  };
  const filteredData = files.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        </div>
      );
    }
    if (error) {
      return (
        <Alert variant="destructive" className="my-8">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }
    if (files.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24"
        >
          <h2 className="text-2xl font-semibold mb-2">Your Canvas is Empty</h2>
          <p className="text-muted-foreground mb-6">
            Upload your first media or document to begin.
          </p>
          <Button onClick={() => setUploadOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
            <FileUp className="mr-2 h-4 w-4" />
            Upload Your First File
          </Button>
        </motion.div>
      );
    }
    if (filteredData.length === 0) {
        return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <h2 className="text-2xl font-semibold mb-2">No Results Found</h2>
              <p className="text-muted-foreground">
                Your search for "{searchQuery}" did not match any files.
              </p>
            </motion.div>
        );
    }
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        {filteredData.map((item) => (
          <motion.div key={item.id} variants={itemVariants}>
            <MediaCard media={item} onTagClick={handleTagClick} />
          </motion.div>
        ))}
      </motion.div>
    );
  };
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header onUploadClick={() => setUploadOpen(true)} />
        <main className="py-8 md:py-10 lg:py-12">
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by title or tag..."
                className="pl-10 text-lg h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={files.length === 0 && !searchQuery}
              />
            </div>
          </div>
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </main>
        <footer className="text-center py-8 text-muted-foreground text-sm space-y-2">
          <p>Built with ❤️ at Cloudflare.</p>
          <p>
            Please note: AI capabilities are subject to usage limits across all applications.
          </p>
        </footer>
      </div>
      <UploadDialog isOpen={isUploadOpen} onOpenChange={setUploadOpen} />
    </>
  );
}