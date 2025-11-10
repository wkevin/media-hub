import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { FileText, Video, Mic, Loader2 } from 'lucide-react';
import type { MediaFile } from '@/lib/mock-data';
interface MediaCardProps {
  media: MediaFile;
}
const iconMap = {
  pdf: <FileText className="h-5 w-5 text-pink-500" />,
  video: <Video className="h-5 w-5 text-green-500" />,
  audio: <Mic className="h-5 w-5 text-indigo-500" />,
};
export function MediaCard({ media }: MediaCardProps) {
  const isProcessing = media.status === 'processing';
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Link to={`/media/${media.id}`} className="block">
        <Card className="overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out h-full flex flex-col">
          <CardHeader className="p-0 relative">
            <div className="aspect-video overflow-hidden">
              <img
                src={media.thumbnailUrl}
                alt={media.title}
                className={cn(
                  'w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105',
                  isProcessing && 'filter grayscale blur-sm'
                )}
              />
            </div>
            {isProcessing && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p className="font-semibold">Processing...</p>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-4 flex-grow">
            <div className="flex items-center gap-2 mb-2">
              {iconMap[media.type]}
              <h3 className="font-bold text-lg leading-tight truncate text-foreground">
                {media.title}
              </h3>
            </div>
            <p className="text-muted-foreground text-sm line-clamp-2">
              {media.summary}
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <div className="flex flex-wrap gap-2">
              {media.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}