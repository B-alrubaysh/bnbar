// Max file size: 5MB in bytes
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Accepted file types
export const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png'];

// File extensions for display
export const ACCEPTED_FILE_EXTENSIONS = ['.jpeg', '.jpg', '.png'];

// Validate file type
export const isValidFileType = (file: File): boolean => {
  return ACCEPTED_FILE_TYPES.includes(file.type);
};

// Validate file size
export const isValidFileSize = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE;
};

// Format bytes to human-readable form
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Create object URL for preview
export const createPreviewUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

// Clean up object URL to prevent memory leaks
export const revokePreviewUrl = (url: string): void => {
  URL.revokeObjectURL(url);
}; 