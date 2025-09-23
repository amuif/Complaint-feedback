'use client';

import type React from 'react';
import { useLanguage } from '@/components/language-provider';
import { Card } from '@/components/ui/card';
import { BackNavigation } from '@/components/back-navigation';
import { ArrowRight, Map, Truck, Shield, Users, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface ServiceCard {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary';
}

export default function ServicesPage() {
  const router = useRouter();
  const { t } = useLanguage();
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

  const services: ServiceCard[] = [
    {
      id: '1',
      titleKey: 'services.cityFreightVehiclePermit.title',
      descriptionKey: 'services.cityFreightVehiclePermit.description',
      icon: <Truck className="h-8 w-8" />,
      color: 'primary',
    },
    {
      id: '2',
      titleKey: 'services.cityFreightVehicleRenewal.title',
      descriptionKey: 'services.cityFreightVehicleRenewal.description',
      icon: <Truck className="h-8 w-8" />,
      color: 'secondary',
    },
    {
      id: '3',
      titleKey: 'services.foreignAccidentClearance.title',
      descriptionKey: 'services.foreignAccidentClearance.description',
      icon: <Shield className="h-8 w-8" />,
      color: 'primary',
    },
    {
      id: '4',
      titleKey: 'services.licensePointsCompensation.title',
      descriptionKey: 'services.licensePointsCompensation.description',
      icon: <Users className="h-8 w-8" />,
      color: 'secondary',
    },
    {
      id: '5',
      titleKey: 'services.transportManagement.title',
      descriptionKey: 'services.transportManagement.description',
      icon: <Map className="h-8 w-8" />,
      color: 'primary',
    },
    {
      id: '6',
      titleKey: 'services.newMotorbikePermit.title',
      descriptionKey: 'services.newMotorbikePermit.description',
      icon: <Truck className="h-8 w-8" />,
      color: 'secondary',
    },
    {
      id: '7',
      titleKey: 'services.communityInquiry.title',
      descriptionKey: 'services.communityInquiry.description',
      icon: <Users className="h-8 w-8" />,
      color: 'primary',
    },
    {
      id: '8',
      titleKey: 'services.accidentClaim.title',
      descriptionKey: 'services.accidentClaim.description',
      icon: <HelpCircle className="h-8 w-8" />,
      color: 'secondary',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <BackNavigation />
      </div>
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">{t('services.title')}</h1>
      <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
        {t('services.subtitle')}
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
                onClick={() => router.push(`/services/${service.id}`)}
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
                  {t(service.titleKey)}
                </h3>
                <p className="text-base text-muted-foreground mb-2">{t(service.descriptionKey)}</p>
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
