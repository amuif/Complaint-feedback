'use client';

import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquare, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export function FeedbackCTA() {
  const { t } = useLanguage();

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop"
          alt="Addis Ababa Street"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/80"></div>
      </div>
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-6 text-center"
        >
          <div className="inline-flex items-center justify-center rounded-full bg-white/10 p-1 px-3">
            <MessageSquare className="mr-2 h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">Share Your Experience</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
              {t('feedback.title')}
            </h2>
            <p className="max-w-[900px] text-white/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t('feedback.subtitle')}
            </p>
          </div>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="bg-white text-primary hover:bg-white/90 rounded-full"
          >
            <Link href="/feedback" className="flex items-center gap-2">
              {t('feedback.cta')}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
