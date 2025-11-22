/**
 * Supabase Storage Provider
 * 
 * Handles file uploads and downloads.
 * Implements IStorageProvider interface.
 * 
 * Supported buckets:
 * - avatars: User profile pictures
 * - chat-images: Images sent in chat
 * - report-evidence: Evidence for user reports
 * 
 * @implements {IStorageProvider}
 * 
 * @module infrastructure/database/supabase/SupabaseStorageProvider
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { IStorageProvider } from '@/core/interfaces/IDatabase';
import { Logger } from '@/shared/utils/logger';
import { compressImage } from '@/shared/utils/imageCompression';

/**
 * Supabase storage provider
 */
export class SupabaseStorageProvider implements IStorageProvider {
  private logger = new Logger('SupabaseStorageProvider');

  /**
   * Creates a new SupabaseStorageProvider
   * 
   * @param client - Supabase client instance
   */
  constructor(private client: SupabaseClient) {}

  /**
   * Upload file to storage bucket
   * 
   * Automatically compresses images before upload.
   * 
   * @param bucket - Bucket name (avatars, chat-images, etc.)
   * @param path - File path in bucket
   * @param file - File to upload (URI or File object)
   * @returns Public URL of uploaded file
   * 
   * @throws {Error} If upload fails
   * 
   * @example
   * ```typescript
   * const url = await storage.upload(
   *   'avatars',
   *   'user-123/profile.jpg',
   *   { uri: 'file:///path/to/image.jpg' }
   * );
   * ```
   */
  async upload(
    bucket: string,
    path: string,
    file: any
  ): Promise<string> {
    this.logger.info('Uploading file', { bucket, path });

    try {
      // Compress image if it's an image file
      let fileToUpload = file;
      if (this.isImageFile(path)) {
        this.logger.debug('Compressing image before upload');
        fileToUpload = await compressImage(file, {
          maxWidth: 1000,
          maxHeight: 1000,
          quality: 0.8,
        });
      }

      // Upload file
      const { data, error } = await this.client.storage
        .from(bucket)
        .upload(path, fileToUpload, {
          cacheControl: '3600',
          upsert: true, // Replace if exists
        });

      if (error) {
        this.logger.error('File upload failed', {
          bucket,
          path,
          error: error.message,
        });
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const publicUrl = this.getPublicUrl(bucket, path);

      this.logger.info('File uploaded successfully', {
        bucket,
        path,
        url: publicUrl,
      });

      return publicUrl;
    } catch (error) {
      this.logger.error('Upload exception', {
        bucket,
        path,
        error,
      });
      throw error;
    }
  }

  /**
   * Download file from storage
   * 
   * @param bucket - Bucket name
   * @param path - File path
   * @returns File blob
   */
  async download(bucket: string, path: string): Promise<Blob> {
    this.logger.info('Downloading file', { bucket, path });

    try {
      const { data, error } = await this.client.storage
        .from(bucket)
        .download(path);

      if (error) {
        this.logger.error('File download failed', {
          bucket,
          path,
          error: error.message,
        });
        throw new Error(`Download failed: ${error.message}`);
      }

      this.logger.info('File downloaded successfully', { bucket, path });
      return data;
    } catch (error) {
      this.logger.error('Download exception', { bucket, path, error });
      throw error;
    }
  }

  /**
   * Delete file from storage
   * 
   * @param bucket - Bucket name
   * @param path - File path
   */
  async delete(bucket: string, path: string): Promise<void> {
    this.logger.info('Deleting file', { bucket, path });

    try {
      const { error } = await this.client.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        this.logger.error('File delete failed', {
          bucket,
          path,
          error: error.message,
        });
        throw new Error(`Delete failed: ${error.message}`);
      }

      this.logger.info('File deleted successfully', { bucket, path });
    } catch (error) {
      this.logger.error('Delete exception', { bucket, path, error });
      throw error;
    }
  }

  /**
   * Get public URL for file
   * 
   * @param bucket - Bucket name
   * @param path - File path
   * @returns Public URL
   */
  getPublicUrl(bucket: string, path: string): string {
    const { data } = this.client.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  /**
   * Create signed URL for private file
   * 
   * @param bucket - Bucket name
   * @param path - File path
   * @param expiresIn - Expiration time in seconds (default: 3600)
   * @returns Signed URL
   */
  async createSignedUrl(
    bucket: string,
    path: string,
    expiresIn: number = 3600
  ): Promise<string> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      throw new Error(`Failed to create signed URL: ${error.message}`);
    }

    return data.signedUrl;
  }

  /**
   * Check if file is an image
   */
  private isImageFile(path: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => path.toLowerCase().endsWith(ext));
  }
}
