import { trackComplaint } from '@/schema/complaint';
import { useEffect, useState } from 'react';
import z from 'zod';
import { Label } from '../ui/label';
import { useLanguage } from '../language-provider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { handleApiError, handleApiSuccess } from '@/lib/error-handler';
import apiClient from '@/lib/api';
import { ComplaintData } from '@/types/types';
import { Badge } from '../ui/badge';
import { AlertCircle, Building, Calendar, CheckCircle, Clock, FileText, User } from 'lucide-react';
import { Separator } from '../ui/separator';
import { format, parseISO, isValid } from 'date-fns';
import AudioPlayer from '../audio-player';

type trackComplaintType = z.infer<typeof trackComplaint>;
const TrackComplaint = () => {
  const { t, language } = useLanguage();
  const [showResponse, setShowResponse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [complaints, setComplaints] = useState<ComplaintData[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<trackComplaintType>({
    resolver: zodResolver(trackComplaint),
    defaultValues: {
      phone_number: '',
    },
  });
  const onSubmit = async (data: trackComplaintType) => {
    setIsLoading(true);
    try {
      const response = await apiClient.trackComplaint(data.phone_number);
      if (response.success && response.data) {
        console.info('response', response.data);
        setComplaints(response.data);
        handleApiSuccess('Success');
        setHasSearched(true);
        reset();
      } else {
        throw new Error(response.message || 'Failed to submit complaint');
      }
    } catch (error) {
      console.error('Error at tracking complaint', error);
      handleApiError(error, 'Failed to submit feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const formatDate = (isoDate: string | undefined): string => {
    if (!isoDate) return 'N/A';
    const date = parseISO(isoDate);
    if (!isValid(date)) return 'Invalid Date';
    return format(date, 'MMMM d, yyyy, h:mm a');
  };
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
      case 'normal':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };
  return (
    <>
      <Card className="flex-col gap-2 p-3">
        <CardHeader className="flex-col gap-2">
          <CardTitle>{t('complaints.track.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>{t('complaints.track.description1')}</Label>
          <div className="flex gap-3 w-full lg:w-[40%] py-3">
            <Input {...register('phone_number')} placeholder={t('complaints.track.input')} />
            <Button className="" onClick={handleSubmit(onSubmit)}>
              {t('complaints.track.submit')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        {hasSearched && (
          <div className="space-y-4">
            {complaints.length > 0 ? (
              <>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Complaint Details</h3>
                  <Badge variant="secondary">{complaints.length} complaint(s) found</Badge>
                </div>

                {complaints.map((complaint, index) => (
                  <Card key={index} className="w-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">
                            Complaint #{complaint.phone_number}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="w-4 h-4" />
                            <span>{complaint.complaint_name}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(complaint.status!)}>
                            {getStatusIcon(complaint.status!)}
                            <span className="ml-1 capitalize">{complaint.status || 'Pending'}</span>
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <Label className="font-medium">Description</Label>
                        </div>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                          {complaint.complaint_description}
                        </p>

                        {complaint.voice_note && (
                          <AudioPlayer
                            audioUrl={`${process.env.NEXT_PUBLIC_API_AUDIO_URL}/${complaint.voice_note.replace(/\\/g, '/')}`}
                          />
                        )}
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <Label className="text-xs text-muted-foreground">Created At</Label>
                              <p className="text-sm">{formatDate(complaint.created_at)}</p>
                            </div>
                          </div>

                          {complaint.resolved_at && (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <div>
                                <Label className="text-xs text-muted-foreground">Resolved At</Label>
                                <p className="text-sm">{formatDate(complaint.resolved_at)}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-muted-foreground flex items-start" />
                            <div>
                              <Label className="text-xs text-muted-foreground">Department </Label>
                              <p className="text-sm">
                                {
                                  complaint.department?.[
                                    `name_${language}` as `name_en` | `name_am` | `name_af`
                                  ]
                                }
                              </p>
                            </div>
                          </div>

                          {complaint.office_id && (
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <Label className="text-xs text-muted-foreground">Office ID</Label>
                                <p className="text-sm">{complaint.office_id}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {complaint.response && (
                        <>
                          <Separator />
                          <div className="space-y-2">
                            <Label className="font-medium">Official Response</Label>
                            <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
                              <p className="text-sm text-blue-800">{complaint.response}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <Card className="w-full">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Complaints Found</h3>
                  <p className="text-muted-foreground text-center">
                    No complaints were found for this phone number. Please check the number and try
                    again.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default TrackComplaint;
