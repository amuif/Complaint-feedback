'use client';

import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Clock, FileText, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function HeroSection() {
  const { t } = useLanguage();
  const [forceUpdate, setForceUpdate] = useState(0);

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      setForceUpdate((prev) => prev + 1);
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  return (
    <section className="py-2 md:py-4 hero-pattern min-h-[20vh] flex items-center">
      <div className="container px-4 md:px-6">
        <div className="items-center flex justify-center">
          <div className="flex flex-col justify-center items-center text-center space-y-4 w-full max-w-3xl">
            <p className=" text-lg md:text-xl">{t('hero.subtitle')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
