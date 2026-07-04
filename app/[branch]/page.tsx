import { HeroSection } from '@/components/hero-section';
import { SubcityNavigationCards } from '@/components/subcity/navigation-cards';
import { notFound } from 'next/navigation';

interface SubcityPageProps {
  params: Promise<{ branch: string }>;
}

export default async function SubcityPage({ params }: SubcityPageProps) {
  const { branch } = await params;
  console.log('Branch:', branch);
  const validBranches = [
    'addis-ketema',
    'akaki-kaliti',
    'arada',
    'bole',
    'kirkos',
    'lideta',
    'nifas-silk-lafto',
    'yeka',
    'lemi-kura',
    'gulele',
    'kolfe-keranio',
  ];

  const isValid = validBranches.some((valid) => valid.toLowerCase() === branch.toLowerCase());
  if (!isValid) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 ">
      <HeroSection />
      <SubcityNavigationCards />
    </div>
  );
}
