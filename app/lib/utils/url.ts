export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side
    return window.location.origin;
  }
  // Server-side
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
}; 