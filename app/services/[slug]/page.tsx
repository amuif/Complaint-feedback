'use client';

import { useParams } from 'next/navigation';
import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import { BackNavigation } from '@/components/back-navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import servicesJson from '../../../components/services.json';

export default function ServiceDetailPage() {
  const { language } = useLanguage();
  // map "or" to JSON key "om"
  const locale = language === 'af' ? 'om' : language;

  const params = useParams();
  const slug = params.slug as string;

  const [open, setOpen] = useState<'requirements' | 'timeline-fee' | 'details' | null>(null);

  useEffect(() => {
    const onLang = () => setOpen(null); // Reset open state on language change
    window.addEventListener('languageChanged', onLang);
    return () => window.removeEventListener('languageChanged', onLang);
  }, []);

  const svc = (servicesJson.services as Record<string, any>)[slug];
  if (!svc) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4 text-primary-solid">
          {locale === 'am'
            ? 'አገልግሎት አልተገኘም'
            : locale === 'om'
              ? 'Tajaajilni hin argamne'
              : 'Service Not Found'}
        </h1>
        <Button asChild>
          <Link href="/services">
            {locale === 'am'
              ? 'መለያየት ወደ አገልግሎቶች'
              : locale === 'om'
                ? 'Deebii Gara Tajaajiloota'
                : 'Back to Services'}
          </Link>
        </Button>
      </div>
    );
  }

  const cards = [
    {
      key: 'requirements' as const,
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: locale === 'am' ? 'መስፈርቶች' : locale === 'om' ? 'Barbaachisummaa' : 'Requirements',
      description:
        locale === 'am'
          ? 'የአገልግሎቱ የሚያስፈልጉ ሰነዶች'
          : locale === 'om'
            ? 'Dokumantoota barbaachisan'
            : 'Documents & prerequisites',
      content: (
        <>
          <ul className="space-y-3 mt-4">
            {Array.isArray(svc.requirements?.[locale]) && svc.requirements[locale].length > 0
              ? svc.requirements[locale].map((r: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))
              : null}{' '}
            {/* Render nothing if there are no requirements */}
          </ul>
          {(!Array.isArray(svc.requirements?.[locale]) ||
            svc.requirements[locale].length === 0) && (
            <p className="text-muted-foreground">No requirements found.</p>
          )}
        </>
      ),
    },
    {
      key: 'timeline-fee' as const,
      icon: <Clock className="h-6 w-6 text-primary" />,
      title:
        locale === 'am' ? 'ጊዜ እና ክፍያ' : locale === 'om' ? 'Yeroo fi Kaffaltii' : 'Timeline & Fee',
      description:
        locale === 'am'
          ? 'የሂደት ጊዜ እና ክፍያዎች'
          : locale === 'om'
            ? 'Yeroo hojmaa fi kaffaltii'
            : 'Processing time & service fees',
      content: (
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {locale === 'am' ? 'ጊዜ' : locale === 'om' ? 'Yeroo' : 'Timeline'}
            </h3>
            {svc.timeline?.[locale] ? (
              <p>{svc.timeline[locale]}</p>
            ) : (
              <p className="text-muted-foreground">No timeline found.</p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {locale === 'am' ? 'ክፍያ' : locale === 'om' ? 'Kaffaltii' : 'Fee'}
            </h3>
            {svc.fee?.[locale] &&
            typeof svc.fee[locale] === 'object' &&
            Object.keys(svc.fee[locale]).length > 0 ? (
              <ul className="space-y-2">
                {Object.entries(svc.fee[locale]).map(([key, value], i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                    <span>
                      <strong>
                        {key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase())
                          .trim()}
                        :
                      </strong>{' '}
                      {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No fee information found.</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'details' as const,
      icon: <AlertCircle className="h-6 w-6 text-primary" />,
      title: locale === 'am' ? 'ዝርዝሮች' : locale === 'om' ? 'Faayilota' : 'Details',
      description:
        locale === 'am'
          ? 'ቦታ፣ ሁኔታ እና መለኪያዎች'
          : locale === 'om'
            ? "Ida'ama fi Sirna"
            : 'Place, mode & standards',
      content: (
        <ul className="space-y-2 mt-4">
          <li>
            <strong>Place:</strong>{' '}
            {svc.place?.[locale] ?? <span className="text-muted-foreground">No place found.</span>}
          </li>
          <li>
            <strong>Mode:</strong>{' '}
            {svc.mode ?? <span className="text-muted-foreground">No mode found.</span>}
          </li>
          <li>
            <strong>Standard Time:</strong>{' '}
            {svc.standard?.time != null ? (
              svc.standard.time
            ) : (
              <span className="text-muted-foreground">No standard time found.</span>
            )}
          </li>
          <li>
            <strong>Standard Quality:</strong>{' '}
            {svc.standard?.quality != null ? (
              svc.standard.quality
            ) : (
              <span className="text-muted-foreground">No standard quality found.</span>
            )}
          </li>
        </ul>
      ),
    },
  ];

  const getRelatedServices = (currentSlug: string) => {
    const allServices = Object.entries(servicesJson.services);

    // Check if current service is a parent (like "4", "7", "8")
    const isParent = ['4', '7', '8'].includes(currentSlug);

    // Check if current service is a sub-service (like "4.1", "7.2", etc.)
    const isSubService = currentSlug.includes('.');

    if (isParent) {
      // If viewing parent service, show all its sub-services
      return allServices.filter(([k]) => k.startsWith(currentSlug + '.'));
    } else if (isSubService) {
      // If viewing sub-service, show parent and all sibling sub-services
      const parentSlug = currentSlug.split('.')[0];
      return allServices.filter(
        ([k]) => k === parentSlug || (k.startsWith(parentSlug + '.') && k !== currentSlug)
      );
    } else {
      // For regular services (1, 2, 3, 5, 6), show any 3 other services
      return allServices.filter(([k]) => k !== currentSlug).slice(0, 3);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <BackNavigation />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-6 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
          {svc.title?.[locale] ?? '—'}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {svc.description?.[locale] ?? 'No description found.'}
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto mt-8">
        <div className="flex flex-col md:flex-row gap-6">
          {cards.map((c) => (
            <button
              key={c.key}
              onClick={() => setOpen(open === c.key ? null : c.key)}
              className={`flex-1 flex flex-col items-center justify-center p-8 rounded-xl border bg-background/80 shadow-md transition-all ${
                open === c.key ? 'border-primary bg-primary/5' : 'border-border hover:bg-primary/10'
              } relative group`}
            >
              <div className="mb-2">{c.icon}</div>
              <div className="text-2xl font-bold mb-1 text-center">{c.title}</div>
              <div className="text-muted-foreground text-base mb-2 text-center">
                {c.description}
              </div>
              <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-primary opacity-70 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>

        {cards.map(
          (c) =>
            open === c.key && (
              <div key={c.key} className="p-6 border border-primary/10 bg-muted/10 rounded-xl mt-6">
                {c.content}
              </div>
            )
        )}
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          {locale === 'am'
            ? 'ተዛማጅ አገልግሎቶች'
            : locale === 'om'
              ? 'Tajaajiloota Walitti Fufan'
              : 'Related Services'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {getRelatedServices(slug).map(([k, related]: any) => (
            <Card key={k} className="service-card">
              <CardHeader>
                <CardTitle className="text-lg">{related.title?.[locale] ?? '—'}</CardTitle>
                <CardDescription>{related.description?.[locale] ?? '—'}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href={`/services/${k}`} className="flex justify-between">
                    <span>
                      {locale === 'am'
                        ? 'ዝርዝር ይመልከቱ'
                        : locale === 'om'
                          ? "Bal'ina Ilaali"
                          : 'View Details'}
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
