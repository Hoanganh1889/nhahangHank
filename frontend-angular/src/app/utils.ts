export const API_BASE_URL = 'http://localhost:5000/api';
export const UPLOADS_BASE_URL = 'http://localhost:5000';
export const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800';

export function resolveImageUrl(image?: string): string {
  if (!image) {
    return FALLBACK_IMAGE;
  }

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  if (image.startsWith('/uploads')) {
    return `${UPLOADS_BASE_URL}${image}`;
  }

  return image;
}
