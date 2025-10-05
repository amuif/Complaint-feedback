import { HeroSection } from '@/components/hero-section';
import { SubcityNavigationCards } from '@/components/subcity/navigation-cards';
import { notFound } from 'next/navigation';

interface SubcityPageProps {
  params: Promise<{ branch: string }>;
}

export default async function SubcityPage({ params }: SubcityPageProps) {
  const { branch } = await params; // ✅ now correct!

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

  const isValid = validBranches.some(
    (valid) => valid.toLowerCase() === branch.toLowerCase()
  );

  if (!isValid) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <SubcityNavigationCards />
    </div>
  );
}

