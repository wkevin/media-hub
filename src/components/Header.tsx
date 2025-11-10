import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
interface HeaderProps {
  onUploadClick: () => void;
}
export function Header({ onUploadClick }: HeaderProps) {
  return (
    <header className="py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">
            CogniCanvas
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle className="relative top-0 right-0" />
          <Button
            onClick={onUploadClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-0.5"
          >
            <UploadCloud className="mr-2 h-4 w-4" />
            Upload File
          </Button>
        </div>
      </div>
    </header>
  );
}