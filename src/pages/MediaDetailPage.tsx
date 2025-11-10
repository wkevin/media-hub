import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMediaStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Tag, Loader2 } from 'lucide-react';
import { PdfViewer } from '@/components/PdfViewer';
export function MediaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const files = useMediaStore((state) => state.files);
  const fetchFiles = useMediaStore((state) => state.fetchFiles);
  const isLoading = useMediaStore((state) => state.isLoading);
  const media = files.find((m) => m.id === id);
  useEffect(() => {
    if (files.length === 0) {
      fetchFiles();
    }
  }, [files.length, fetchFiles]);
  if (isLoading && !media) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }
  if (!media) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-2xl font-bold mb-4">Media not found</h2>
        <p className="text-muted-foreground mb-6">The requested file could not be found.</p>
        <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
          <Link to="/">Go back to Dashboard</Link>
        </Button>
      </div>
    );
  }
  const renderMedia = () => {
    // NOTE: Since we are using placeholder URLs from the backend simulation,
    // we will use fallback demo videos/audio for now. In a real R2 integration,
    // media.fileUrl would point to the actual R2 object.
    const videoUrl = media.fileUrl.includes('placeholder') ? "https://www.w3schools.com/html/mov_bbb.mp4" : media.fileUrl;
    const audioUrl = media.fileUrl.includes('placeholder') ? "https://www.w3schools.com/html/horse.mp3" : media.fileUrl;
    switch (media.type) {
      case 'pdf':
        // For PDFs, we can use a placeholder document if the URL is a placeholder
        const pdfUrl = media.fileUrl.includes('placeholder') ? "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" : media.fileUrl;
        return <PdfViewer fileUrl={pdfUrl} />;
      case 'video':
        return (
          <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
            <video controls className="w-full h-full" key={media.fileUrl}>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case 'audio':
        return (
          <div className="w-full bg-secondary p-8 rounded-lg">
            <audio controls className="w-full" key={media.fileUrl}>
              <source src={audioUrl} type="audio/mpeg" />
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
                {media.status === 'processing' ? (
                   <div className="flex items-center text-muted-foreground">
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     <span>Analysis in progress...</span>
                   </div>
                ) : (
                  <p className="text-muted-foreground">{media.summary}</p>
                )}
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
                {media.status === 'processing' ? (
                   <div className="flex items-center text-muted-foreground">
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     <span>Generating tags...</span>
                   </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {media.tags.length > 0 ? media.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-sm">
                        {tag}
                      </Badge>
                    )) : <p className="text-sm text-muted-foreground">No tags available.</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}