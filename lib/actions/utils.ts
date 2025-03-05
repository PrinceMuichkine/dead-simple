/**
 * Utility function to concatenate class names
 * A simpler implementation that doesn't depend on external libraries
 */
export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return inputs
    .filter(Boolean)
    .join(' ')
    .trim();
}