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
import VoiceForm from '@/components/complaint/voice-form';
import TextForm from '@/components/complaint/text-form';
import TrackComplaint from '@/components/complaint/track-complaint';

function ComplaintsContent() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSecureContext, setIsSecureContext] = useState(true);
  const [activeTab, setActiveTab] = useState(''); 
  const { t, language } = useLanguage();


const DynamicVoiceForm = dynamic(() => import('@/components/complaint/voice-form'), {
  ssr: false
});
const DynamicTextForm = dynamic(() => import('@/components/complaint/text-form'), {
  ssr: false
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

        {/* Buttons with icons */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex items-center px-3 sm:px-4 py-2 rounded border hover:bg-gray-100 sm:text-base text-sm ${
              activeTab === 'voice' ? 'bg-gray-200' : ''
            }`}
          >
            <Mic className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            {t('submit.voice.complaint')}
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center px-3 sm:px-4 py-2 rounded border hover:bg-gray-100 sm:text-base text-sm ${
              activeTab === 'text' ? 'bg-gray-200' : ''
            }`}
          >
            <FileText className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            {t('submit.text.complaint')}
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`flex items-center px-3 sm:px-4 py-2 rounded border hover:bg-gray-100 sm:text-base text-sm ${
              activeTab === 'track' ? 'bg-gray-200' : ''
            }`}
          >
            <Eye className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            {t('track.complaint')}
          </button>
        </div>

        
<div className="w-full">
  {activeTab === 'voice' && <DynamicVoiceForm />}
  {activeTab === 'text' && <DynamicTextForm />}
  {activeTab === 'track' && <TrackComplaint />}
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
