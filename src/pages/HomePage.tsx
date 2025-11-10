import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockData } from '@/lib/mock-data';
import { Header } from '@/components/Header';
import { MediaCard } from '@/components/MediaCard';
import { UploadDialog } from '@/components/UploadDialog';
import { Input } from '@/components/ui/input';
import { Search, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function HomePage() {
  const [isUploadOpen, setUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const filteredData = mockData.filter((item) =>
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
                className="pl-10 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <AnimatePresence>
            {filteredData.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                {filteredData.map((item) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <MediaCard media={item} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-24"
              >
                <h2 className="text-2xl font-semibold mb-2">No Results Found</h2>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or upload a new file.
                </p>
                <Button onClick={() => setUploadOpen(true)}>
                  <FileUp className="mr-2 h-4 w-4" />
                  Upload Your First File
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        <footer className="text-center py-8 text-muted-foreground">
          <p>Built with ❤️ at Cloudflare</p>
        </footer>
      </div>
      <UploadDialog isOpen={isUploadOpen} onOpenChange={setUploadOpen} />
    </>
  );
}