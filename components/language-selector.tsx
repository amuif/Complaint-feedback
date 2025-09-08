'use client';

import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, ChevronDown } from 'lucide-react';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  // Map language codes to their full names
  const languageNames = {
    en: 'English',
    am: 'አማርኛ',
    af: 'Afaan Oromo',
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full border-gray-300 bg-white text-gray-700 px-3 py-1 h-auto flex items-center gap-1.5"
        >
          <Globe className="h-5 w-5 text-gray-600" />
          <span className="text-sm font-medium">
            {languageNames[language as keyof typeof languageNames]}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => setLanguage('en')}
          className={`${language === 'en' ? 'bg-muted' : ''} cursor-pointer`}
        >
          <div className="flex items-center gap-2">
            <span>English</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage('am')}
          className={`${language === 'am' ? 'bg-muted' : ''} cursor-pointer`}
        >
          <div className="flex items-center gap-2">
            <span>አማርኛ</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage('af')}
          className={`${language === 'af' ? 'bg-muted' : ''} cursor-pointer`}
        >
          <div className="flex items-center gap-2">
            <span>Afaan Oromo</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
