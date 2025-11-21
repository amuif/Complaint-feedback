'use client';

import { HeroSection } from '@/components/hero-section';
import { NavigationCards } from '@/components/navigation-cards';
import { useSubcityName } from '@/hooks/use-subcity-name';
import { useEffect } from 'react';

export default function Home() {
  const subcity = useSubcityName();
  useEffect(() => {
    console.log(subcity);
  }, [subcity]);
  return (
    <div className="container mx-auto px-4">
      <HeroSection />
      <NavigationCards />
      {/* <AboutSection /> */}
    </div>
  );
}
