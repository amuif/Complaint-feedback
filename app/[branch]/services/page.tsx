'use client';
import type React from 'react';
import { useLanguage } from '@/components/language-provider';
import { Card } from '@/components/ui/card';
import { BackNavigation } from '@/components/back-navigation';
import { ArrowRight, FileText, DollarSign, Shield, Users, Truck, Building } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import servicesJson from '@/components/services-branch.json';

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary';
}

export default function BranchServicesPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const locale = language === 'af' ? 'om' : language;
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    const handleLanguageChange = () => {
      setForceUpdate((prev) => prev + 1);
    };
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  const getServiceIcon = (id: string): React.ReactNode => {
    if (id === '1') return <FileText className="h-8 w-8" />;
    if (id === '2') return <DollarSign className="h-8 w-8" />;
    if (id === '3') return <Shield className="h-8 w-8" />;
    if (id === '4') return <Truck className="h-8 w-8" />;
    if (id === '5') return <Shield className="h-8 w-8" />;
    if (id === '6') return <Building className="h-8 w-8" />;
    if (id === '7') return <Building className="h-8 w-8" />;
    if (id === '8') return <Building className="h-8 w-8" />;
    if (id === '9') return <Building className="h-8 w-8" />;
    return <Users className="h-8 w-8" />;
  };

  const services: ServiceCard[] = Object.entries(servicesJson.services)
    .filter(([id]) => !id.includes('.')) // Only main services, no sub-services
    .map(([id, service]: [string, any], index) => ({
      id,
      title: service.title?.[locale] || service.title?.en || '',
      description: service.description?.[locale] || service.description?.en || '',
      icon: getServiceIcon(id),
      color: (index % 2 === 0 ? 'primary' : 'secondary') as 'primary' | 'secondary',
    }));

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <BackNavigation />
      </div>
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">
        {locale === 'am'
          ? 'የቅርንጫፍ አገልግሎቶች'
          : locale === 'om'
            ? 'Tajaajiloota Damee'
            : 'Branch Services'}
      </h1>
      <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
        {locale === 'am'
          ? 'በቅርንጫፍ ጽ/ቤቶቻችን የሚገኙ አገልግሎቶች'
          : locale === 'om'
            ? 'Tajaajiloota waajjira damee keenyatti argaman'
            : 'Services available at our branch offices'}
      </p>
      <section className="py-6">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card
                key={service.id}
                className={cn(
                  'group p-8 flex flex-col items-center text-center border border-border/40 bg-background/60 backdrop-blur-sm shadow-md hover:shadow-xl transition-shadow cursor-pointer',
                  service.color === 'primary'
                    ? 'hover:border-primary/40 hover:bg-primary/5'
                    : 'hover:border-secondary/40 hover:bg-secondary/5'
                )}
                onClick={() => router.push(`/branch/services/${service.id}`)}
              >
                <div
                  className={cn(
                    'mb-4 flex items-center justify-center rounded-full h-16 w-16 transition-colors',
                    service.color === 'primary'
                      ? 'bg-primary/10 group-hover:bg-primary/20'
                      : 'bg-secondary/10 group-hover:bg-secondary/20'
                  )}
                >
                  {service.icon}
                </div>
                <h3
                  className={cn(
                    'font-bold text-xl mb-2 transition-colors',
                    service.color === 'primary'
                      ? 'group-hover:text-primary'
                      : 'group-hover:text-secondary'
                  )}
                >
                  {service.title}
                </h3>
                <p className="text-base text-muted-foreground mb-2">{service.description}</p>
                <ArrowRight
                  className={cn(
                    'h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity mt-2',
                    service.color === 'primary' ? 'text-primary' : 'text-secondary'
                  )}
                />
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
