'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/language-provider';
import apiClient from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AmharicKeyboard } from '@/components/amharic-keyboard';
import { Toaster } from '@/components/ui/toaster';
import { handleApiError, handleApiSuccess } from '@/lib/error-handler';
import { BackNavigation } from '@/components/back-navigation';
import { format, parseISO, isValid } from 'date-fns';
import z from 'zod';
import { feedbackSchema, feedbackStatus } from '@/schema/feedback';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sector, Subcities } from '@/types/types';

type FeedbackFormData = z.infer<typeof feedbackSchema>;
type FeedbackStatus = z.infer<typeof feedbackStatus>;

export default function FeedbackPage() {
  const { t, language } = useLanguage();
  const [showAmharicKeyboard, setShowAmharicKeyboard] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [statusRef, setStatusRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [sectorLeaders, setSectorLeaders] = useState<Sector[]>([]);

  const loadSectorLeaders = async () => {
    if (sectorLeaders.length > 0) return;
    try {
      const response = await apiClient.getSectorLeaders();
      console.log(response);
      // Provide a fallback empty array in case response.data is undefined
      setSectorLeaders(response || []);
    } catch (error) {
      console.error('Failed to load sector leaders:', error);
      setSectorLeaders([]);
    }
  };

  useEffect(() => {
    loadSectorLeaders();
  }, []);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      full_name: '',
      phone_number: '',
      feedback_type: 'complaint',
      feedback_text: '',
      sector_id: '',
      feedback_source: 'public_feedback',
    },
  });

  const {
    register: registerTracking,
    handleSubmit: handleSubmitTracking,
    formState: { errors: trackingErrors },
  } = useForm<FeedbackStatus>({
    resolver: zodResolver(feedbackStatus),
    defaultValues: {
      phone_number: '',
    },
  });

  const feedback_text = watch('feedback_text');

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true);

    try {
      const response = await apiClient.submitFeedback(data);
      if (response.success) {
        handleApiSuccess(
          `${t('feedback.submitted.description')} Tracking Code: ${data.phone_number}`,
          t('feedback.submitted.title')
        );
        reset();
      } else {
        throw new Error(response.message || 'Failed to submit feedback');
      }
    } catch (error) {
      handleApiError(error, 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusCheck = async (data: FeedbackStatus) => {
    setIsChecking(true);
    try {
      const response = await apiClient.trackFeedback(data.phone_number.trim());
      if (response.success) {
        handleApiSuccess(
          `${response.data?.status}\nLast Updated: ${formatDate(response.data?.updated_at)}`,
          'Feedback Status'
        );
      } else {
        throw new Error(response.message || 'Feedback not found');
      }
    } catch (error) {
      handleApiError(error, 'Failed to check status. Please verify your tracking code.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleAmharicInput = (char: string) => {
    if (activeField === 'feedback_text') {
      setValue('feedback_text', feedback_text + char);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <div className="mb-6">
        <BackNavigation />
      </div>
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">
        {t('feedback.form.title')}
      </h1>
      <div className="grid ">
        <Card>
          <CardHeader>
            <CardTitle>{t('feedback.form.title')}</CardTitle>
            <CardDescription>{t('feedback.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">{t('feedback.form.name')}*</Label>
                <Input id="name" {...register('full_name')} />
                {errors.full_name && (
                  <p className="text-red-500 text-sm">{errors.full_name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t('feedback.form.phone')}*</Label>
                <Input id="phone" type="tel" {...register('phone_number')} />
                {errors.phone_number && (
                  <p className="text-red-500 text-sm">{errors.phone_number.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="sectorLeader">{t('complaints.form.sectorLeader')}</Label>
                <Controller
                  name="sector_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger id="sectorLeader">
                        <SelectValue placeholder={t('complaints.form.selectSectorLeader')} />
                      </SelectTrigger>
                      <SelectContent>
                        {sectorLeaders.map((sectorLeader, index) => {
                          const id = sectorLeader.id;
                          const appointedPerson = sectorLeader[`appointed_person_${language}`];
                          return (
                            <SelectItem key={index} value={`${id}`}>
                              {appointedPerson}
                            </SelectItem>
                          );
                        })}{' '}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label>{t('feedback.form.type')}*</Label>
                <RadioGroup
                  defaultValue="complaint"
                  onValueChange={(value) =>
                    setValue('feedback_type', value as FeedbackFormData['feedback_type'])
                  }
                  className="flex gap-4"
                >
                  {['complaint', 'suggestion', 'compliment'].map((type) => (
                    <div className="flex items-center space-x-2" key={type}>
                      <RadioGroupItem value={type} id={type} />
                      <Label htmlFor={type}>{t(`feedback.types.${type}`)}</Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.feedback_type && (
                  <p className="text-red-500 text-sm">{errors.feedback_type.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">{t('feedback.form.message')}*</Label>
                <Textarea
                  id="message"
                  {...register('feedback_text')}
                  onFocus={() => setActiveField('feedback_text')}
                  lang={language}
                  dir={language === 'am' ? 'ltr' : 'auto'}
                  inputMode="text"
                />
                {errors.feedback_text && (
                  <p className="text-red-500 text-sm">{errors.feedback_text.message}</p>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAmharicKeyboard(!showAmharicKeyboard)}
                  className="w-full"
                >
                  {showAmharicKeyboard
                    ? t('feedback.form.hideKeyboard')
                    : t('feedback.form.showKeyboard')}
                </Button>
                {showAmharicKeyboard && <AmharicKeyboard onCharacterClick={handleAmharicInput} />}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : t('feedback.form.submit')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}

const formatDate = (isoDate: string | undefined): string => {
  if (!isoDate) return 'N/A';
  const date = parseISO(isoDate);
  if (!isValid(date)) return 'Invalid Date';
  return format(date, 'MMMM d, yyyy, h:mm a');
};
