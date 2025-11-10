import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
interface PdfViewerProps {
  fileUrl: string;
}
export function PdfViewer({ fileUrl }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }
  const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages || 1));
  return (
    <div className="w-full h-full flex flex-col bg-secondary rounded-lg overflow-hidden">
      <div className="flex-grow overflow-auto flex justify-center items-start p-4">
        <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} scale={scale} renderTextLayer={true} />
        </Document>
      </div>
      <div className="flex items-center justify-center p-2 bg-background border-t">
        <Button variant="ghost" size="icon" onClick={goToPrevPage} disabled={pageNumber <= 1}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium mx-4">
          Page {pageNumber} of {numPages || '--'}
        </span>
        <Button variant="ghost" size="icon" onClick={goToNextPage} disabled={pageNumber >= (numPages || 1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-4" />
        <Button variant="ghost" size="icon" onClick={() => setScale(s => s - 0.1)} disabled={scale <= 0.5}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium mx-4">{(scale * 100).toFixed(0)}%</span>
        <Button variant="ghost" size="icon" onClick={() => setScale(s => s + 0.1)} disabled={scale >= 2}>
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}