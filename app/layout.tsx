import type React from 'react';
import type { Metadata } from 'next/dist/lib/metadata/types/metadata-interface';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/components/language-provider';
import Header from '@/components/header';
import Footer from '@/components/footer';
import IdleMediaPlayer from '@/components/idle-media-player';
import { ReactQueryProvider } from '@/lib/react-query-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Citizen Charter Portal | Addis Ababa Traffic Management Authority',
  description: 'Official citizen charter portal for the Addis Ababa Traffic Management Authority',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={inter.className}>
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <LanguageProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <IdleMediaPlayer />
              </div>
            </LanguageProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
