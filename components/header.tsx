'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/components/language-provider';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/language-selector';
import { Menu, X, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubcityName } from '@/hooks/use-subcity-name';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const subcity = useSubcityName();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      setForceUpdate((prev) => prev + 1);
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { href: subcity ? `/${subcity}` : '/', label: t('home') },
    { href: subcity ? `/${subcity}/services` : '/services', label: t('services') },
    { href: subcity ? `/${subcity}/complaints` : '/complaints', label: t('complaints') },
    { href: subcity ? `/${subcity}/ratings` : '/ratings', label: t('ratings') },
    { href: '/help', label: t('help') }, // Assuming you have a translation for 'help'
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 header-shadow'
          : 'bg-transparent'
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex cursor-pointer items-center gap-2"
        >
          <Link
            href={subcity === 'main' ? '/' : `/${subcity}`}
            className="flex  items-center gap-1 md:gap-2"
          >
            <div className="relative overflow-hidden p-1 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Traffic Management Authority Logo"
                width={50}
                height={50}
                className="h-8 w-8 md:h-10 md:w-10"
              />
            </div>
            <div className="flex flex-col max-w-[160px] md:max-w-none overflow-hidden">
              <span className="text-xs md:text-base font-bold text-primary truncate leading-tight">
                {t('site.subtitle')}
              </span>
              <span className="text-[10px] md:text-xs text-secondary leading-tight">
                {language === 'am'
                  ? 'የአዲስ አበባ ትራፊክ አስተዳደር ባለስልጣን'
                  : language === 'af'
                    ? 'Abbaa Taayitaa Bulchiinsa Daandii Finfinnee'
                    : 'Addis Ababa Traffic Management Authority'}
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        {/* <motion.nav */}
        {/*   initial={{ opacity: 0, y: -10 }} */}
        {/*   animate={{ opacity: 1, y: 0 }} */}
        {/*   transition={{ duration: 0.5, delay: 0.1 }} */}
        {/*   className="hidden md:flex items-center gap-6" */}
        {/* > */}
        {/*   {navItems.map((item) => ( */}
        {/*     <Link */}
        {/*       key={item.href} */}
        {/*       href={item.href} */}
        {/*       className={`text-sm font-medium transition-colors hover:text-primary ${ */}
        {/*         pathname === item.href ? 'text-primary' : 'text-muted-foreground' */}
        {/*       }`} */}
        {/*     > */}
        {/*       {item.label} */}
        {/*     </Link> */}
        {/*   ))} */}
        {/* </motion.nav> */}
        {/**/}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <LanguageSelector />
          <ModeToggle />
          <Button asChild variant="ghost" size="icon" className="hidden md:flex">
            <Link href="/help">
              <HelpCircle className="h-5 w-5 text-secondary" />
              <span className="sr-only">{t('help')}</span>
            </Link>
          </Button>
          <Button
            asChild
            className="hidden md:flex rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            <Link href="/feedback">{t('feedback.cta')}</Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </motion.div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="container md:hidden py-4 bg-background/95 backdrop-blur-md overflow-hidden"
          >
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <MobileNavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  pathname={pathname}
                  onClick={toggleMenu}
                />
              ))}
              <Button
                asChild
                className="w-full rounded-full mt-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                <Link
                  key="feedback"
                  href={subcity === 'main' ? '/feedback' : `/${subcity}/feedback`}
                  onClick={toggleMenu}
                >
                  {t('feedback.cta')}
                </Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MobileNavLink({
  href,
  label,
  pathname,
  onClick,
}: {
  href: string;
  label: string;
  pathname: string;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={href}
        className={`text-sm font-medium transition-colors hover:text-primary flex items-center p-2 rounded-md hover:bg-muted ${
          pathname === href ? 'text-primary bg-muted' : ''
        }`}
        onClick={onClick}
      >
        {label}
      </Link>
    </motion.div>
  );
}
