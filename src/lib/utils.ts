import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge tailwind classes
 */
export function cn(...args: (string | undefined | null | false)[]) {
  return twMerge(clsx(args));
}
