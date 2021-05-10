import { useRoute } from 'router';

export const isPathContained = (path: string): boolean =>
  useRoute().name === path;