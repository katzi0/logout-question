import type { DetailsProps } from './types';

/**
 * Used for any type without its own component: a type the API added that this
 * version of the app doesn't know, or a known type that isn't built yet.
 * The card still shows all the shared info; this just adds nothing.
 */
export function FallbackDetails(_props: DetailsProps) {
  return null;
}
