'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import {
  ACCEPTED_FILE_EXTENSIONS,
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE,
  createPreviewUrl,
  formatBytes,
  isValidFileSize,
  isValidFileType,
  revokePreviewUrl
} from '@/lib/file-validation';

export interface DropzoneProps {
  onFileAccepted: (file: File) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileAccepted }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Clean up the preview URL when the component unmounts
  useEffect(() => {
    return () => {
      if (preview) {
        revokePreviewUrl(preview);
      }
    };
  }, [preview]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Reset error state
    setError(null);
    
    if (acceptedFiles.length === 0) {
      return;
    }

    const selectedFile = acceptedFiles[0];

    // Validate file type
    if (!isValidFileType(selectedFile)) {
      setError(`Invalid file type. Please upload ${ACCEPTED_FILE_EXTENSIONS.join(' or ')} files only.`);
      return;
    }

    // Validate file size
    if (!isValidFileSize(selectedFile)) {
      setError(`File size exceeds the maximum limit of ${formatBytes(MAX_FILE_SIZE)}.`);
      return;
    }

    // Clean up previous preview if exists
    if (preview) {
      revokePreviewUrl(preview);
    }

    // Create preview URL
    const previewUrl = createPreviewUrl(selectedFile);
    setPreview(previewUrl);
    setFile(selectedFile);
    
    // Notify parent component
    onFileAccepted(selectedFile);
  }, [preview, onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
          ${isDragReject ? 'border-red-500 bg-red-50' : ''}
          ${error ? 'border-red-500' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-3">
          <svg
            className={`w-12 h-12 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`}
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="text-center">
            {file ? (
              <p className="text-sm text-gray-600">{file.name} ({formatBytes(file.size)})</p>
            ) : (
              <>
                <p className="text-base font-medium text-gray-700">
                  {isDragActive ? 'Drop the image here' : 'Drag and drop an image, or click to browse'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Only {ACCEPTED_FILE_EXTENSIONS.join(', ')} files up to {formatBytes(MAX_FILE_SIZE)}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-2 text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Preview */}
      {preview && !error && (
        <div className="mt-4 border rounded-lg p-2">
          <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
          <div className="relative h-48 w-full overflow-hidden rounded">
            <Image
              src={preview}
              alt="Image preview"
              className="object-contain"
              fill
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropzone; 