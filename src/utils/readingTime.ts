export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
}

export function formatReadingTime(minutes: number): string {
  if (minutes < 1) {
    return 'Less than a minute';
  } else if (minutes === 1) {
    return '1 minute';
  } else {
    return `${minutes} minutes`;
  }
} 