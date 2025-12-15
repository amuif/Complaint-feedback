'use client';

import { useLanguage } from '@/components/language-provider';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, Users, Car, Clock, FileCheck, HelpCircle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function ServiceCards() {
  const { t } = useLanguage();

  const services = [
    {
      icon: <FileText className="h-8 w-8 text-primary service-icon" />,
      title: 'Document Verification',
      description: 'Verify traffic-related documents and certificates',
      link: '/services/document-verification',
      image: 'https://th.bing.com/th/id/OIP.zqbTrhES3IYV9G1BWVweUwHaJv?cb=iwc2&rs=1&pid=ImgDetMain',
    },
    {
      icon: <Users className="h-8 w-8 text-primary service-icon" />,
      title: 'License Services',
      description: "Apply for or renew driver's licenses and permits",
      link: '/services/license-services',
      image:
        'https://th.bing.com/th/id/OIP.1UDRESSx1PGW88QPyQcldAHaEJ?w=333&h=187&c=7&r=0&o=5&cb=iwc2&dpr=1.2&pid=1.7',
    },
    {
      icon: <Car className="h-8 w-8 text-primary service-icon" />,
      title: 'Vehicle Registration',
      description: 'Register vehicles and obtain necessary permits',
      link: '/services/vehicle-registration',
      image:
        'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
    },
    {
      icon: <Clock className="h-8 w-8 text-primary service-icon" />,
      title: 'Traffic Violation Appeals',
      description: 'Appeal traffic violations and penalties',
      link: '/services/traffic-violations',
      image:
        'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
    },
    {
      icon: <FileCheck className="h-8 w-8 text-primary service-icon" />,
      title: 'Road Event Permits',
      description: 'Apply for permits for road events and closures',
      link: '/services/road-events',
      image:
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
    },
    {
      icon: <HelpCircle className="h-8 w-8 text-primary service-icon" />,
      title: 'General Inquiries',
      description: 'Get information about traffic management services',
      link: '/services/inquiries',
      image:
        'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-2">
            Our Services
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary-solid">
            {t('services.title')}
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            {t('services.subtitle')}
          </p>
        </motion.div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={item}>
              <Card className="flex flex-col h-full service-card border border-border/40 bg-background/60 backdrop-blur-sm overflow-hidden">
                <div className="h-48 w-full relative">
                  <Image
                    src={service.image || '/placeholder.svg'}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      {service.icon}
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base mt-2">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto pt-4">
                  <Button asChild variant="outline" className="w-full group">
                    <Link href={service.link} className="flex items-center justify-between">
                      <span>Learn More</span>
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
