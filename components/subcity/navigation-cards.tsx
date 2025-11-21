'use client';

import { Card } from '@/components/ui/card';
import { ArrowRight, MessageSquare, MapPin, ThumbsUp, Star, ClipboardCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/language-provider';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useSubcityName } from '@/hooks/use-subcity-name';

interface NavigationCard {
  titleKey: string;
  descriptionKey: string;
  path: string;
  icon?: React.ReactNode;
  color: 'primary' | 'secondary';
}

export function SubcityNavigationCards() {
  const router = useRouter();
  const subcity = useSubcityName();
  const { t, language } = useLanguage();
  const [forceUpdate, setForceUpdate] = useState(0);

  const suffix = language === 'en' ? '_en' : language === 'am' ? '_am' : '_om';
  const tr = (key: string) => t(`${key}${suffix}`);

  useEffect(() => {
    console.log(subcity);
  }, [subcity]);

  useEffect(() => {
    const handleLanguageChange = () => {
      setForceUpdate((prev) => prev + 1);
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  const cards: NavigationCard[] = [
    {
      titleKey: 'services.title',
      descriptionKey: 'services.subtitle',
      path: `${subcity}/services`,
      icon: <ClipboardCheck className="h-8 w-8" />,
      color: 'primary',
    },
    {
      titleKey: 'complaints',
      descriptionKey: 'navigation.complaintsDesc',
      path: `${subcity}/complaints`,
      icon: <MessageSquare className="h-8 w-8" />,
      color: 'secondary',
    },
    {
      titleKey: 'ratings.title',
      descriptionKey: 'ratings.subtitle',
      path: `${subcity}/ratings`,
      icon: <Star className="h-8 w-8" />,
      color: 'secondary',
    },
    {
      titleKey: 'feedback.title',
      descriptionKey: 'feedback.subtitle',
      path: `${subcity}/feedback`,
      icon: <ThumbsUp className="h-8 w-8" />,
      color: 'primary',
    },
    {
      titleKey: 'homepage.search.label',
      descriptionKey: 'navigation.employeesDesc',
      path: `${subcity}/hierarchy`,
      icon: <MapPin className="h-8 w-8" />,
      color: 'secondary',
    },
  ];

  return (
    <section className="py-9">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            const isRatings = card.titleKey.startsWith('ratings.');
            return (
              <Card
                key={card.path}
                className={cn(
                  'group p-8 flex flex-col items-center text-center border border-border/40 bg-background/60 backdrop-blur-sm shadow-md hover:shadow-xl transition-shadow cursor-pointer',
                  card.color === 'primary'
                    ? 'hover:border-primary/40 hover:bg-primary/5'
                    : 'hover:border-secondary/40 hover:bg-secondary/5'
                )}
                onClick={() => router.push(card.path)}
              >
                <div
                  className={cn(
                    'mb-4 flex items-center justify-center rounded-full h-16 w-16 transition-colors',
                    card.color === 'primary'
                      ? 'bg-primary/10 group-hover:bg-primary/20'
                      : 'bg-secondary/10 group-hover:bg-secondary/20'
                  )}
                >
                  <span className={card.color === 'primary' ? 'text-primary' : 'text-secondary'}>
                    {card.icon}
                  </span>
                </div>
                <h3
                  className={cn(
                    'font-bold text-xl mb-2 transition-colors',
                    card.color === 'primary'
                      ? 'group-hover:text-primary'
                      : 'group-hover:text-secondary'
                  )}
                >
                  {isRatings ? tr(card.titleKey) : t(card.titleKey)}
                </h3>
                <p className="text-base text-muted-foreground mb-2">
                  {isRatings ? tr(card.descriptionKey) : t(card.descriptionKey)}
                </p>
                <ArrowRight
                  className={cn(
                    'h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity mt-2',
                    card.color === 'primary' ? 'text-primary' : 'text-secondary'
                  )}
                />
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
