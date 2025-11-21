'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, Suspense } from 'react';
import { useLanguage } from '@/components/language-provider';
import { AlertTriangle, Mic, FileText, Eye } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Head from 'next/head';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Toaster } from '@/components/ui/toaster';
import { BackNavigation } from '@/components/back-navigation';
import { Button } from '@/components/ui/button';

function ComplaintsContent() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSecureContext, setIsSecureContext] = useState(true);
  const [activeTab, setActiveTab] = useState('');
  const { t } = useLanguage();

  const DynamicVoiceForm = dynamic(() => import('@/components/complaint/voice-form'), {
    ssr: false,
  });
  const DynamicTextForm = dynamic(() => import('@/components/complaint/text-form'), {
    ssr: false,
  });
  const DynamicTrackComplaint = dynamic(() => import('@/components/complaint/track-complaint'), {
    ssr: false,
  });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isSecure =
        window.location.protocol === 'https:' ||
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';
      setIsSecureContext(isSecure);
    }
  }, [searchParams]);

  const buttonOptions = [
    {
      id: 1,
      text: t('submit.voice.complaint'),
      value: 'voice',
      icon: <Mic className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />,
      handleClick: () => setActiveTab('voice'),
    },
    {
      id: 2,
      text: t('submit.text.complaint'),
      value: 'text',
      icon: <FileText className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />,
      handleClick: () => setActiveTab('text'),
    },
    {
      id: 3,
      text: t('track.complaint'),
      value: 'track',
      icon: <Eye className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />,
      handleClick: () => setActiveTab('track'),
    },
  ];
  return (
    <>
      <Head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src * 'self' 'unsafe-inline' 'unsafe-eval' data: blob:;"
        />
      </Head>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <BackNavigation />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">
          {t('complaints.onlyTitle')}
        </h1>

        {errorMessage && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {!isSecureContext && (
          <Alert variant="default" className="mb-6 bg-amber-50 border-amber-200">
            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
            <AlertDescription className="text-sm sm:text-base text-amber-800">
              Voice recording requires a secure connection (HTTPS). Your current connection is not
              secure, which may prevent the microphone from working properly. Please access this
              page via HTTPS.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex w-full flex-wrap gap-2 sm:gap-4 mb-6">
          {buttonOptions.map((option) => (
            <Button
              onClick={option.handleClick}
              className={`flex items-center justify-start w-full px-3 sm:px-4 py-2 rounded border hover:bg-gray-100 sm:text-base text-sm text-left 
${activeTab === option.value ? 'bg-gray-200' : ''}
`}
              variant="outline"
            >
              {option.icon}
              {option.text}
            </Button>
          ))}
        </div>

        <div className="w-full">
          {activeTab === 'voice' && <DynamicVoiceForm />}
          {activeTab === 'text' && <DynamicTextForm />}
          {activeTab === 'track' && <DynamicTrackComplaint />}
        </div>
      </div>

      <Toaster />
    </>
  );
}

export default function ComplaintsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-8">Loading...</div>}>
      <ComplaintsContent />
    </Suspense>
  );
}
