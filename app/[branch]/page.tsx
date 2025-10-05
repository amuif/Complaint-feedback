import { HeroSection } from '@/components/hero-section';
import { SubcityNavigationCards } from '@/components/subcity/navigation-cards';
import { notFound } from 'next/navigation';
import { useEffect } from 'react';
// import { ServiceCards } from "@/components/service-cards";
// import { AboutSection } from "@/components/about-section";
// import { FeedbackCTA } from "@/components/feedback-cta";

interface SubcityPageProps {
  params: { branch: string };
}

export default async function SubcityPage({ params }: SubcityPageProps) {
  const { branch } = await params;
  const validBranches = [
    'addis-ketema',
    'akaki-kaliti',
    'arada',
    'bole',
    'gulele',
    'kirkos',
    'kolfe-keranio',
    'lideta',
    'lemi-kura',
    'nifas-silk-lafto',
    'yeka',
  ];
  const valid = validBranches.filter((valid) => valid.toLowerCase() === branch.toLowerCase());
  if (valid.length === 0) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <SubcityNavigationCards />
      {/* <AboutSection /> */}
    </div>
  );
}
