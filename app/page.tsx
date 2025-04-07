'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Dropzone from '@/components/Dropzone';

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileAccepted = (file: File) => {
    setSelectedFile(file);
    setProcessedImage(null);
    setError(null);
  };

  const handleRemoveBackground = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Create FormData with the image
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Send request to our API
      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process image');
      }

      // Get the processed image as a blob
      const imageBlob = await response.blob();
      
      // Create an object URL for the processed image
      const imageUrl = URL.createObjectURL(imageBlob);
      setProcessedImage(imageUrl);
    } catch (err: any) {
      console.error('Error removing background:', err);
      setError(err.message || 'Failed to remove background');
    } finally {
      setIsProcessing(false);
    }
  };

  // Clean up object URL when component unmounts or when a new image is processed
  React.useEffect(() => {
    return () => {
      if (processedImage) {
        URL.revokeObjectURL(processedImage);
      }
    };
  }, [processedImage]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            Instant Background Remover
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
            Upload an image and we'll instantly remove the background using AI
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8">
            {/* Step 1: Upload */}
            <div className={`transition-opacity duration-300 ${processedImage ? 'opacity-50' : 'opacity-100'}`}>
              <h2 className="text-lg font-medium text-gray-800 mb-3">Upload Image</h2>
              <Dropzone onFileAccepted={handleFileAccepted} />
            </div>

            {/* Processing button */}
            {selectedFile && !processedImage && (
              <div className="mt-6 flex justify-center">
                <button 
                  className="px-5 py-3 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  disabled={!selectedFile || isProcessing}
                  onClick={handleRemoveBackground}
                >
                  {isProcessing ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Removing Background...
                    </span>
                  ) : "Remove Background"}
                </button>
              </div>
            )}

            {/* Error message with better styling */}
            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Processing Failed</h3>
                    <div className="mt-1 text-sm text-red-700">
                      {error}
                    </div>
                    <button 
                      className="mt-2 text-sm text-red-600 hover:text-red-500 font-medium underline"
                      onClick={() => setError(null)}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Loading overlay for better visual feedback */}
            {isProcessing && (
              <div className="mt-6 rounded-lg bg-gray-50 p-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-pulse inline-block h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 opacity-75"></div>
                  <p className="mt-4 text-gray-600">Processing your image with AI...</p>
                  <p className="mt-1 text-xs text-gray-500">This typically takes 5-10 seconds</p>
                </div>
              </div>
            )}

            {/* Processed image result */}
            {processedImage && (
              <div className="mt-8 border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-800">Background Removed</h2>
                </div>
                <div className="p-4">
                  <div className="relative h-80 w-full bg-checkered rounded-md overflow-hidden">
                    <Image
                      src={processedImage}
                      alt="Processed image with background removed"
                      className="object-contain"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />
                  </div>
                  <div className="mt-6 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <a
                      href={processedImage}
                      download="background-removed.png"
                      className="px-6 py-3 bg-green-600 text-white text-center font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors shadow-sm"
                    >
                      Download Image
                    </a>
                    <button
                      onClick={() => {
                        setProcessedImage(null);
                        setSelectedFile(null);
                      }}
                      className="px-6 py-3 bg-gray-100 text-gray-800 text-center font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                      Try Another Image
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-4">
          <p className="text-xs text-gray-500">
            Powered by U²-Net + Next.js | Background removal in seconds
          </p>
        </div>
      </div>
    </main>
  );
} 