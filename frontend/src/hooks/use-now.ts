'use client';

import { useState } from 'react';

/** Horodatage figé au montage du composant (rendu pur). */
export function useNow() {
  const [now] = useState(() => Date.now());
  return now;
}
