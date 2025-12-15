'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/components/language-provider';
import {
  Facebook,
  Twitter,
  Send,
  Youtube,
  Globe,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
} from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="space-y-4 md:col-span-6">
            <div className="flex items-center gap-2">
              <div className="relative overflow-hidden rounded-full bg-white p-1">
                <Image
                  src="/logo.png"
                  alt="Traffic Management Authority Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold">{t('site.title')}</span>
                <span className="text-xs opacity-80">{t('site.subtitle')}</span>
              </div>
            </div>
            <p className="text-sm opacity-80 max-w-md">{t('about.content')}</p>

            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/aartmatmc"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 opacity-80 hover:opacity-100 transition-opacity"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com/AARTMA1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 opacity-80 hover:opacity-100 transition-opacity"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://t.me/trafficmanagementagency"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 opacity-80 hover:opacity-100 transition-opacity"
              >
                <Send className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.AddisAbabaTrafficManagement.com/channel"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 opacity-80 hover:opacity-100 transition-opacity"
              >
                <Youtube className="h-5 w-5" />
              </Link>
              <Link
                href="https://aatma.gov.et"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 opacity-80 hover:opacity-100 transition-opacity"
              >
                <Globe className="h-5 w-5" />
              </Link>
            </div>

            <ul className="mt-4 space-y-2 text-sm opacity-80">
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <Link href="mailto:aartma@gmail.com">aartma@gmail.com</Link>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <Link href="tel:011-667-3455">011-667-3455</Link> /{' '}
                <Link href="tel:0911018606">0911018606</Link>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                Free Call center: <Link href="tel:696">696</Link>
              </li>
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Equatorial Guinea Road, 22 Mazoria, Addis Ababa, Ethiopia
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-lg font-semibold mb-4">{t('footer.mission.title')}</h3>
            <p className="text-sm opacity-80">{t('footer.mission.content')}</p>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-lg font-semibold mb-4">{t('footer.vision.title')}</h3>
            <p className="text-sm opacity-80">{t('footer.vision.content')}</p>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-80">
          <p>
            &copy; {currentYear} {t('site.subtitle')}. {t('footer.rights')}.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm opacity-80 hover:opacity-100 transition-opacity flex items-center group"
      >
        <ChevronRight className="h-3 w-3 mr-1 transition-transform group-hover:translate-x-1" />
        <span>{label}</span>
      </Link>
    </li>
  );
}
