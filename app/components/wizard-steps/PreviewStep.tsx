import Image from "next/image";
import { Button } from "../ui/button";
import { DownloadIcon, RefreshCwIcon } from "lucide-react";
import Spinner from "../Spinner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

interface PreviewStepProps {
  generatedImage: string;
  companyName: string;
  isLoading: boolean;
  onGenerateLogo: () => Promise<void>;
  onDownloadLogo: (format: 'png' | 'svg' | 'jpg') => void;
}

export default function PreviewStep({ 
  generatedImage, 
  companyName,
  isLoading, 
  onGenerateLogo,
  onDownloadLogo
}: PreviewStepProps) {
  const [showExportOptions, setShowExportOptions] = useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Your logo preview</h1>
        <p className="text-gray-600">
          Generate your logo and download when ready
        </p>
      </div>

      <div className="mx-auto max-w-md overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        {generatedImage ? (
          <div className="relative aspect-square w-full">
            <Image
              src={generatedImage}
              alt={`${companyName} logo`}
              width={512}
              height={512}
              className="h-full w-full"
              priority
              unoptimized
            />

            <div className="absolute right-2 top-2 flex gap-2">
              <Popover open={showExportOptions} onOpenChange={setShowExportOptions}>
                <PopoverTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="rounded-full bg-white/90 text-gray-800 backdrop-blur-sm hover:bg-white"
                  >
                    <DownloadIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="bottom" className="w-auto p-2">
                  <div className="flex flex-col gap-1">
                    <Button 
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        onDownloadLogo('png');
                        setShowExportOptions(false);
                      }}
                      className="justify-start"
                    >
                      Download as PNG
                    </Button>
                    <Button 
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        onDownloadLogo('svg');
                        setShowExportOptions(false);
                      }}
                      className="justify-start"
                    >
                      Download as SVG
                    </Button>
                    <Button 
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        onDownloadLogo('jpg');
                        setShowExportOptions(false);
                      }}
                      className="justify-start"
                    >
                      Download as JPG
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                size="sm"
                onClick={() => onGenerateLogo()}
                variant="outline"
                disabled={isLoading}
                className="rounded-full bg-white/90 text-gray-800 backdrop-blur-sm hover:bg-white"
              >
                <Spinner loading={isLoading}>
                  <RefreshCwIcon className="h-4 w-4" />
                </Spinner>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex aspect-square w-full flex-col items-center justify-center rounded-lg bg-gray-50 p-6">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <Spinner loading={true} className="mb-4 h-10 w-10 text-blue-500" />
                <p className="text-gray-500">Generating your logo...</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="mb-2 text-gray-500">Click the button below to generate your logo</p>
                <svg className="mx-auto h-24 w-24 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        )}
      </div>

      {!generatedImage && !isLoading && (
        <div className="text-center">
          <Button
            size="lg"
            onClick={() => onGenerateLogo()}
            className="bg-blue-600 px-8 text-white hover:bg-blue-700"
          >
            Generate Logo
          </Button>
        </div>
      )}

      {generatedImage && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-3 text-sm font-medium text-gray-700">Next steps</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <svg className="mr-2 h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Download your logo in different formats</span>
            </li>
            <li className="flex items-center">
              <svg className="mr-2 h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Try generating a different version with the refresh button</span>
            </li>
            <li className="flex items-center">
              <svg className="mr-2 h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Go back to previous steps to make adjustments if needed</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
} 