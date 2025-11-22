/**
 * Image Compression Utility
 * 
 * Compresses images before upload to reduce file size and improve performance.
 * 
 * @module shared/utils/imageCompression
 */

// Note: Install expo-image-manipulator: npx expo install expo-image-manipulator
// @ts-ignore - expo-image-manipulator may not be installed yet
import * as ImageManipulator from 'expo-image-manipulator';

/**
 * Image compression options
 */
export interface CompressionOptions {
  /**
   * Maximum width in pixels
   */
  maxWidth?: number;

  /**
   * Maximum height in pixels
   */
  maxHeight?: number;

  /**
   * Compression quality (0-1)
   */
  quality?: number;

  /**
   * Output format
   */
  format?: 'jpeg' | 'png' | 'webp';
}

/**
 * Compress image file
 * 
 * @param imageUri - Image file URI or object with uri property
 * @param options - Compression options
 * @returns Compressed image file
 * 
 * @example
 * ```typescript
 * const compressed = await compressImage(
 *   { uri: 'file:///path/to/image.jpg' },
 *   { maxWidth: 1000, quality: 0.8 }
 * );
 * ```
 */
export async function compressImage(
  imageUri: string | { uri: string } | File | Blob,
  options: CompressionOptions = {}
): Promise<Blob> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8,
    format: 'jpeg' | 'png' | 'webp' = 'jpeg',
  } = options;

  try {
    // Extract URI from different input types
    let uri: string;
    if (typeof imageUri === 'string') {
      uri = imageUri;
    } else if (imageUri instanceof File || imageUri instanceof Blob) {
      // For File/Blob, create object URL
      uri = URL.createObjectURL(imageUri);
    } else if (imageUri && typeof imageUri === 'object' && 'uri' in imageUri) {
      uri = imageUri.uri;
    } else {
      throw new Error('Invalid image input');
    }

    // Manipulate image (resize and compress)
    // @ts-ignore - expo-image-manipulator types
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [
        {
          resize: {
            width: maxWidth,
            height: maxHeight,
          },
        },
      ],
      {
        compress: quality,
        format: format as any, // Type assertion for format
      }
    );

    // Convert to Blob
    const response = await fetch(manipulatedImage.uri);
    const blob = await response.blob();

    // Clean up object URL if we created one
    if (imageUri instanceof File || imageUri instanceof Blob) {
      URL.revokeObjectURL(uri);
    }

    return blob;
  } catch (error) {
    // If compression fails, return original as Blob
    console.warn('Image compression failed, using original:', error);

    if (imageUri instanceof Blob) {
      return imageUri;
    }

    if (imageUri instanceof File) {
      return new Blob([imageUri], { type: imageUri.type });
    }

    // For URI, try to fetch and convert to Blob
    const uri = typeof imageUri === 'string' ? imageUri : imageUri.uri;
    const response = await fetch(uri);
    return response.blob();
  }
}

