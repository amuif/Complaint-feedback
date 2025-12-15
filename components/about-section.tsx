'use client';

import { useLanguage } from '@/components/language-provider';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export function AboutSection() {
  const { t } = useLanguage();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const values = [
    'Measurement-based approach',
    'User-centered service',
    'Transparency',
    'Trustworthiness',
    'Accountability',
    'Collaborative work',
  ];

  return (
    <section className="py-16 about-section">
      <div className="container px-4 md:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-2">
            About Us
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary-solid">
            {t('about.title')}
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            {t('about.content')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[400px] rounded-xl overflow-hidden image-overlay"
          >
            <Image
              src="https://images.unsplash.com/photo-1591456983933-0c264720bcd3?q=80&w=2070&auto=format&fit=crop"
              alt="Ethiopian Landscape and Culture"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center space-y-4"
          >
            <h3 className="text-2xl font-bold text-primary-solid">Our History</h3>
            <p>
              The Addis Ababa Traffic Management Authority was established to address the growing
              traffic challenges in Ethiopia's capital city. As the city expanded and vehicle
              ownership increased, there was a need for a dedicated authority to manage traffic
              flow, enforce regulations, and ensure road safety.
            </p>
            <p>
              Since its inception, the Authority has implemented various initiatives to improve
              traffic management, including the installation of traffic lights, deployment of
              traffic officers, and public awareness campaigns on road safety.
            </p>
            <p>
              Today, we continue to evolve and adopt modern technologies and approaches to create a
              safer and more efficient traffic system for all road users in Addis Ababa.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12"
        >
          <motion.div variants={fadeIn} className="space-y-4">
            <Card className="border border-primary/20 bg-background/60 backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <CardHeader>
                <CardTitle className="text-xl text-primary-solid">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  By 2022 E.C., we aim to establish a peaceful traffic movement that is accepted by
                  road users in Addis Ababa.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn} className="space-y-4">
            <Card className="border border-primary/20 bg-background/60 backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <CardHeader>
                <CardTitle className="text-xl text-primary-solid">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  To improve traffic flow and safety by raising road safety awareness, defining road
                  usage, managing the transportation system and traffic control with modern
                  technology, enforcing traffic rules and regulations, and strengthening event
                  management systems.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn} className="space-y-4">
            <Card className="border border-primary/20 bg-background/60 backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <CardHeader>
                <CardTitle className="text-xl text-primary-solid">Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-2 gap-2">
                  {values.map((value, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn} className="space-y-4">
            <Card className="border border-primary/20 bg-background/60 backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <CardHeader>
                <CardTitle className="text-xl text-primary-solid">Our Commitment</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We are committed to providing services according to the standards set in the
                  charter, following the law and government policies, serving citizens with respect
                  and fairness, fighting corruption, giving special attention to vulnerable groups,
                  responding quickly to inquiries, and being accountable for our services and
                  decisions.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
