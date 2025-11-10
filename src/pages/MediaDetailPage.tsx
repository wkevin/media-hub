import { useParams, Link } from 'react-router-dom';
import { mockData } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Tag } from 'lucide-react';
import { PdfViewer } from '@/components/PdfViewer';
export function MediaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const media = mockData.find((m) => m.id === id);
  if (!media) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-2xl font-bold mb-4">Media not found</h2>
        <Button asChild>
          <Link to="/">Go back to Dashboard</Link>
        </Button>
      </div>
    );
  }
  const renderMedia = () => {
    switch (media.type) {
      case 'pdf':
        return <PdfViewer fileUrl={media.fileUrl} />;
      case 'video':
        return (
          <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
            <video controls className="w-full h-full">
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case 'audio':
        return (
          <div className="w-full bg-secondary p-8 rounded-lg">
            <audio controls className="w-full">
              <source src="https://www.w3schools.com/html/horse.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      default:
        return <p>Unsupported media type</p>;
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold font-display mb-6">{media.title}</h1>
            <div className="h-[60vh]">{renderMedia()}</div>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{media.summary}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {media.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}