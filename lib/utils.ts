import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLevelColor(level: number): string {
  switch (level) {
    case 1: return 'bg-purple-100 border-purple-300'
    case 2: return 'bg-blue-100 border-blue-300'
    case 3: return 'bg-green-100 border-green-300'
    default: return 'bg-gray-100 border-gray-300'
  }
}
