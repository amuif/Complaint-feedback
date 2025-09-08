import { HeroSection } from '@/components/hero-section';
// import { ServiceCards } from "@/components/service-cards";
// import { AboutSection } from "@/components/about-section";
// import { FeedbackCTA } from "@/components/feedback-cta";
import { NavigationCards } from '@/components/navigation-cards';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <NavigationCards />
      {/* <AboutSection /> */}
    </div>
  );
}
