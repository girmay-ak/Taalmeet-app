/**
 * Supabase Storage Provider
 * 
 * Implements IStorageProvider interface using Supabase Storage.
 * 
 * @implements {IStorageProvider}
 * 
 * @module infrastructure/database/supabase/SupabaseStorageProvider
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { IStorageProvider, DatabaseResult } from '@/core/interfaces/IDatabase';
import { Logger } from '@/shared/utils/logger';

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
   * Upload file to storage
   * 
   * @param bucket - Storage bucket name
   * @param path - File path in bucket
   * @param file - File to upload
   * @returns Upload result
   */
  async upload(
    bucket: string,
    path: string,
    file: File | Blob
  ): Promise<DatabaseResult<any>> {
    try {
      this.logger.debug('Uploading file', { bucket, path });

      const { data, error } = await this.client.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        this.logger.error('Upload failed', { error: error.message });
        return {
          data: null,
          error: {
            message: error.message,
            code: error.statusCode?.toString() || 'STORAGE_ERROR',
          },
        };
      }

      this.logger.info('File uploaded successfully', { bucket, path });
      return { data, error: null };
    } catch (error) {
      this.logger.error('Upload exception', error);
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Upload failed',
          code: 'UNKNOWN',
        },
      };
    }
  }

  /**
   * Download file from storage
   * 
   * @param bucket - Storage bucket name
   * @param path - File path in bucket
   * @returns Download result
   */
  async download(bucket: string, path: string): Promise<DatabaseResult<Blob>> {
    try {
      this.logger.debug('Downloading file', { bucket, path });

      const { data, error } = await this.client.storage
        .from(bucket)
        .download(path);

      if (error) {
        this.logger.error('Download failed', { error: error.message });
        return {
          data: null,
          error: {
            message: error.message,
            code: error.statusCode?.toString() || 'STORAGE_ERROR',
          },
        };
      }

      this.logger.info('File downloaded successfully', { bucket, path });
      return { data: data as Blob, error: null };
    } catch (error) {
      this.logger.error('Download exception', error);
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Download failed',
          code: 'UNKNOWN',
        },
      };
    }
  }

  /**
   * Get public URL for file
   * 
   * @param bucket - Storage bucket name
   * @param path - File path in bucket
   * @returns Public URL
   */
  getPublicUrl(bucket: string, path: string): string {
    const { data } = this.client.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  /**
   * Delete file from storage
   * 
   * @param bucket - Storage bucket name
   * @param path - File path in bucket
   * @returns Delete result
   */
  async remove(bucket: string, path: string): Promise<DatabaseResult<void>> {
    try {
      this.logger.debug('Deleting file', { bucket, path });

      const { error } = await this.client.storage.from(bucket).remove([path]);

      if (error) {
        this.logger.error('Delete failed', { error: error.message });
        return {
          data: null,
          error: {
            message: error.message,
            code: error.statusCode?.toString() || 'STORAGE_ERROR',
          },
        };
      }

      this.logger.info('File deleted successfully', { bucket, path });
      return { data: undefined, error: null };
    } catch (error) {
      this.logger.error('Delete exception', error);
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Delete failed',
          code: 'UNKNOWN',
        },
      };
    }
  }
}

