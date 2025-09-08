'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from './language-provider';

export function BackNavigation() {
  const router = useRouter();
  const { language } = useLanguage();
  const locale = language === 'af' ? 'om' : language;

  const handleBack = () => {
    router.back();
  };

  return (
    <Button
      variant="ghost"
      onClick={handleBack}
      className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
    >
      <ChevronLeft className="h-4 w-4" />
      <span>{locale === 'am' ? 'ተመለስ' : locale === 'om' ? "Deebi'i" : 'Back'}</span>
    </Button>
  );
}
