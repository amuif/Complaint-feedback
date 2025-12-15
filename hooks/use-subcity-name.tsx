'use client';

import { usePathname } from 'next/navigation';

export function useSubcityName(): string | null {
  const pathname = usePathname();
  const match = pathname.match(
    /^\/(addis-ketema|akaki-kaliti|arada|bole|gulele|kirkos|kolfe-keranio|lideta|lemi-kura|nifas-silk-lafto|yeka)(\/|$)/
  );
  return match ? match[1] : '';
}
