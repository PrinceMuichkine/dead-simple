/**
 * Type definitions for storage operations
 */

export interface StorageOptions {
  bucket: 'avatars' | 'logos' | 'products' | 'banners';
  path: string;
  fileType?: string;
  contentType?: string;
} 