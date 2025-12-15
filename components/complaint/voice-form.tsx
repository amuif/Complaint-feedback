'use client';
import { Mic, Paperclip, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { handleApiError, handleApiSuccess } from '@/lib/error-handler';
import apiClient from '@/lib/api';
import { useLanguage } from '../language-provider';
import { VoiceFeedback } from '../voice-feedback';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { voiceComplaint } from '@/schema/complaint';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
  Director,
  Employee,
  Sector,
  Subcities,
  TeamLeader,
  voiceComplaintData,
} from '@/types/types';
import { useCurrentSubcity, useSubcityAdmin } from '@/hooks/use-subcity';
import { useSubcityName } from '@/hooks/use-subcity-name';

type ComplaintFormData = z.infer<typeof voiceComplaint>;

const VoiceForm = () => {
  const { t, language } = useLanguage();
  const subcity = useSubcityName();
  const { mutateAsync: findCurrentAdmin } = useSubcityAdmin();
  const currentSub = useCurrentSubcity();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [sectorLeaders, setSectorLeaders] = useState<Sector[]>([]);
  const [subcityLeader, setSubcityLeader] = useState<Sector>();
  const [sector_id, setSector_id] = useState<string>('');
  const [directors_id, setDirectors_id] = useState<string>('');
  const [team_id, setTeam_id] = useState<string>('');
  const [employee_id, setEmployee_id] = useState<string>('');
  const [directors, setDirectors] = useState<Director[]>([]);
  const [teamLeaders, setTeamLeaders] = useState<TeamLeader[]>([]);
  const [loadingSectorLeaders, setLoadingSectorLeaders] = useState(false);
  const [loadingDirectors, setLoadingDirectors] = useState(false);
  const [loadingTeamLeaders, setLoadingTeamLeaders] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingSubcities, setLoadingSubcities] = useState(false);
  const [subcities, setSubcities] = useState<Subcities[]>([]);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const [currentSubcity, setCurrentSubcity] = useState<Subcities | null>(null);

  useEffect(() => {
    setCurrentSubcity(currentSub);
    console.log(currentSub);
  }, [currentSub]);

  useEffect(() => {
    loadSubcities();
  }, []);

  const loadDirectors = async (value: string) => {
    const [id, name] = value.split('|');
    setSector_id(id);
    setLoadingDirectors(true);
    setErrorMessage(null);
    try {
      if (currentSubcity && subcity) {
        console.log('going-subcity');
        const data = await apiClient.getSubcityDirectors(id);
        console.log(data);
        setDirectors(data || []);
      } else {
        const data = await apiClient.getDirectorsBySectorLeader(id);
        setDirectors(data || []);
      }
    } catch (error) {
      console.error(`Failed to load directors for sector leader ${id}:`, error);
      setErrorMessage('Failed to load directors. Please try again.');
      setDirectors([]);
    } finally {
      setLoadingDirectors(false);
    }
  };
  const loadSubcities = async () => {
    setLoadingSubcities(true);
    setErrorMessage(null);
    try {
      console.log(currentSubcity);
      if (subcity && currentSubcity) {
        setSubcities([currentSubcity]);
      } else {
        const response = await apiClient.getSubcities();
        setSubcities(response || []);
      }
    } catch (error) {
      console.error('Failed to load subcities:', error);
      setErrorMessage('Failed to load subcities. Please try again.');
      setSubcities([]);
    } finally {
      setLoadingSubcities(false);
    }
  };

  const loadSectorLeaders = async () => {
    if (sectorLeaders.length > 0) return;
    setLoadingSectorLeaders(true);
    setErrorMessage(null);

    try {
      if (currentSubcity && subcity) {
        console.log('Loading sector leaders for current subcity:', currentSubcity.id);
        const response = await findCurrentAdmin(currentSubcity.id);
        console.log(response);
        setSubcityLeader(response);
      } else {
        console.log('Loading all sector leaders');
        const response = await apiClient.getSectorLeaders();
        setSectorLeaders(response);
      }
    } catch (error) {
      console.error('Failed to load sector leaders:', error);
      setErrorMessage('Failed to load sector leaders. Please try again.');
      setSectorLeaders([]);
    } finally {
      setLoadingSectorLeaders(false);
    }
  };

  const loadTeamLeaders = async (directorId: string) => {
    console.info(directorId);
    const [id, name] = directorId.split('|');
    setDirectors_id(id);
    setLoadingTeamLeaders(true);
    setErrorMessage(null);
    try {
      if (currentSubcity && subcity) {
        console.log('going dteam sub');
        const data = await apiClient.getTeamLeaderSubcityByDirector(id, currentSub?.id);
        console.log(data);
        setTeamLeaders(data || []);
      } else {
        const data = await apiClient.getTeamLeadersByDirector(id);
        console.log(data);
        setTeamLeaders(data || []);
      }
    } catch (error) {
      console.error(`Failed to load team leaders for director ${directorId}:`, error);
      setErrorMessage('Failed to load team leaders. Please try again.');
      setTeamLeaders([]);
    } finally {
      setLoadingTeamLeaders(false);
    }
  };

  const loadEmployees = async (teamLeader: string) => {
    const [id, name] = teamLeader?.split('|');
    console.log(id);
    setTeam_id(id);
    setLoadingEmployees(true);
    setErrorMessage(null);
    try {
      const data = await apiClient.getEmployeesByTeamLeader(id);
      console.log(data);
      setEmployees(data || []);
    } catch (error) {
      console.error(`Failed to load employees for team leader ${id}:`, error);
      setErrorMessage('Failed to load employees. Please try again.');
      setEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleEmployeeChange = (employeeId: string) => {
    const [id, name] = employeeId.split('|');
    setEmployee_id(id);

    // Ensure both sides are the same type for comparison
    const selectedEmployee = employees.find((e) => String(e.id) === String(id));
    setValue('office', selectedEmployee?.office_number || '');
  };

  const handleSectorLeaderChange = (sectorLeaderId: string) => {
    setValue('director', '');
    setValue('teamLeader', '');
    setValue('employee', '');
    setValue('office', '');
    setDirectors([]);
    setTeamLeaders([]);
    setEmployees([]);

    if (sectorLeaderId) {
      loadDirectors(sectorLeaderId);
    }
  };

  const handleDirectorChange = (directorId: string) => {
    setValue('teamLeader', '');
    setValue('employee', '');
    setValue('office', '');
    setTeamLeaders([]);
    setEmployees([]);

    if (directorId) {
      loadTeamLeaders(directorId);
    }
  };

  const handleTeamLeaderChange = (teamLeaderId: string) => {
    setValue('employee', '');
    setValue('office', '');
    setEmployees([]);

    if (teamLeaderId) {
      loadEmployees(teamLeaderId);
    }
  };

  const onSubmit = async (data: voiceComplaintData) => {
    setErrorMessage(null);
    const [subcity_id, subcity_name] = data.subcity_id.split('|');
    try {
      const complaintData: voiceComplaintData = {
        complaint_name: data.complaint_name,
        phone_number: data.phone_number,
        subcity_id: subcity_id,
        woreda: data.woreda,
        office: data.office || '',
        complaint_description: data.complaint_description,
        desired_action: data.desired_action,
        complaint_date: data.complaint_date,
        sector_id: sector_id,
        division_id: directors_id,
        department_id: team_id,
        employee_id: employee_id,
        voice_file_path: audioUrl,
        complaint_source: 'public_complaint',
        attachment: attachment ?? null,
      };

      const response = await apiClient.submitVoiceComplaint(complaintData);

      if (response.success) {
        handleApiSuccess(
          `Complaint submitted successfully! Tracking code is your phone number: ${response.data?.tracking_code}`,
          'Success'
        );
        setAudioUrl('');
        reset();
      } else {
        throw new Error(response.message || 'Failed to submit complaint');
      }
    } catch (error) {
      console.error('Failed to submit complaint:', error);
      setErrorMessage('Failed to submit complaint. Please try again.');
      handleApiError(error, 'Failed to submit complaint. Please try again.');
    }
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAttachment(file);
    // Set the value as File | null | undefined
    setValue('attachment', file, { shouldValidate: true });

    // Create preview for image files
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachmentPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAttachmentPreview(null);
    }
  };
  // Remove attachment
  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentPreview(null);
    setValue('attachment', undefined, { shouldValidate: true }); // Set to undefined
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ComplaintFormData>({
    resolver: zodResolver(voiceComplaint),
    defaultValues: {
      complaint_name: '',
      subcity_id: '',
      woreda: '',
      phone_number: '',
      complaintDetails: '',
      sectorLeader: '',
      director: '',
      teamLeader: '',
      employee: '',
      office: '',
      actionRequired: '',
      complaintDate: '',
      voice_file_path: '',
      complaint_source: 'public_source',
      attachment: null,
    },
    mode: 'onChange',
  });
  const sectorLeader = watch('sectorLeader');
  const director = watch('director');
  const teamLeader = watch('teamLeader');

  return (
    <div>
      {' '}
      <Card>
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Mic className="h-5 w-5" />
            {t('feedback.voice.title')}
          </CardTitle>
          <CardDescription>{t('complaints.form.voice.description')}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1">
              <Label htmlFor="complainantName">{t('complaints.form.complainantName')} *</Label>
              <Input
                id="complainantName"
                {...register('complaint_name')}
                onFocus={() => setActiveField('complainantName')}
                lang={language}
                maxLength={50}
              />
              {errors.complaint_name && (
                <p className="text-sm text-red-500">{errors.complaint_name.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {watch('complaint_name')?.length || 0}/50 {t('complaints.form.characters.used')}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="voicePhone">{t('complaints.form.phone')} *</Label>
              <Input
                id="voicePhone"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                lang={language}
                dir="ltr"
                {...register('phone_number')}
                maxLength={10}
              />
              {errors.phone_number && (
                <p className="text-sm text-red-500">{errors.phone_number.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {watch('phone_number')?.length || 0}/10 {t('complaints.form.characters.used')}
              </p>
            </div>
            <input type="hidden" {...register('complaint_source')} value="public_complaint" />
            <VoiceFeedback
              register={register('voice_file_path')}
              audioUrl={audioUrl}
              setAudioUrl={setAudioUrl}
              setAudioBlob={setAudioBlob}
            />
            <div className="space-y-2">
              <Label htmlFor="attachment">{t('complaints.form.attachment')}</Label>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="attachment"
                  className="flex items-center w-full gap-2 cursor-pointer border rounded-md px-4 py-2 hover:bg-accent"
                >
                  <Paperclip className="h-4 w-4" />
                  {t('complaints.form.chooseFile')}
                </Label>
                <Input
                  id="attachment"
                  type="file"
                  className="hidden"
                  onChange={handleAttachmentChange}
                  accept="image/*,.pdf,.doc,.docx"
                />
                {attachment && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm truncate max-w-xs">{attachment.name}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={removeAttachment}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              {attachmentPreview && (
                <div className="mt-2">
                  <img
                    src={attachmentPreview}
                    alt="Attachment preview"
                    className="max-w-xs max-h-32 rounded-md"
                  />
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {t('complaints.form.attachmentDescription')}
              </p>
              {errors.attachment && (
                <p className="text-sm text-red-500">{errors.attachment.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 mt-8">
              <div className="space-y-1">
                <Label htmlFor="subcity">{t('complaints.form.subcity')} *</Label>
                <Controller
                  name="subcity_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        loadSectorLeaders();
                      }}
                      disabled={loadingSubcities || !subcities || subcities.length === 0}
                    >
                      <SelectTrigger id="subcity">
                        <SelectValue
                          placeholder={
                            loadingSubcities ? 'Loading subcities...' : t('select.form.subcity')
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {currentSubcity
                          ? (() => {
                              const id = currentSubcity.id;
                              const subcityName = currentSubcity?.[`name_${language}`];
                              return (
                                <SelectItem key={id} value={`${id} | ${subcityName}`}>
                                  {subcityName}
                                </SelectItem>
                              );
                            })()
                          : subcities?.map((subcity) => {
                              const id = subcity.id;
                              const subcityName = subcity?.[`name_${language}`];
                              return (
                                <SelectItem key={id} value={`${id} | ${subcityName}`}>
                                  {subcityName}
                                </SelectItem>
                              );
                            })}
                      </SelectContent>{' '}
                    </Select>
                  )}
                />
                {errors.subcity_id && (
                  <p className="text-sm text-red-500">{errors.subcity_id.message}</p>
                )}
              </div>{' '}
              <div className="space-y-1">
                <Label htmlFor="sectorLeader">{t('complaints.form.sectorLeader')}</Label>
                <Controller
                  name="sectorLeader"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleSectorLeaderChange(value);
                      }}
                      disabled={loadingSectorLeaders}
                    >
                      <SelectTrigger id="sectorLeader">
                        <SelectValue
                          placeholder={
                            loadingSectorLeaders
                              ? t('complaints.form.selectSectorLeaderLoading')
                              : t('complaints.form.selectSectorLeader')
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(sectorLeaders) ? (
                          subcity ? (
                            (() => {
                              console.log(subcityLeader);
                              const firstLeader = subcityLeader;

                              console.log('tehre is not firstLeader');
                              if (!firstLeader) return null;
                              console.log('tehre is firstLeader');

                              const id = firstLeader.id;
                              const appointedPerson = firstLeader[`appointed_person_${language}`];
                              if (!id || !appointedPerson) return null;
                              console.log('tehre is id and appointedPerson');
                              return (
                                <SelectItem key={id} value={`${id} | ${appointedPerson}`}>
                                  {appointedPerson}
                                </SelectItem>
                              );
                            })()
                          ) : (
                            sectorLeaders
                              .map((sectorLeader, index) => {
                                const id = sectorLeader.id;
                                const appointedPerson =
                                  sectorLeader[`appointed_person_${language}`];
                                return (
                                  <SelectItem
                                    key={id ?? index}
                                    value={`${id} | ${appointedPerson}`}
                                  >
                                    {appointedPerson}
                                  </SelectItem>
                                );
                              })
                              .filter(Boolean)
                          )
                        ) : (
                          <SelectItem disabled value="no-items">
                            {loadingSectorLeaders ? 'Loading...' : 'No sector leaders found'}
                          </SelectItem>
                        )}
                      </SelectContent>{' '}
                    </Select>
                  )}
                />
              </div>
              {/* Director - always visible, optional */}
              <div className="space-y-1">
                <Label htmlFor="director">{t('complaints.form.director')}</Label>
                <Controller
                  name="director"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleDirectorChange(value);
                      }}
                      disabled={!sectorLeader || loadingDirectors}
                    >
                      <SelectTrigger id="director">
                        <SelectValue
                          placeholder={
                            loadingDirectors
                              ? t('complaints.form.DirectorLoading')
                              : sectorLeader
                                ? t('complaints.form.selectDirector')
                                : t('complaints.form.selectsectorleaderfirst')
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {directors.map((director, index) => {
                          const id = director.id;
                          const appointedPerson = director?.[`appointed_person_${language}`];
                          return (
                            <SelectItem key={index} value={`${id} | ${appointedPerson}`}>
                              {appointedPerson}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {/* Team Leader - always visible, optional */}
              <div className="space-y-1">
                <Label htmlFor="teamLeader">{t('complaints.form.teamLeader')}</Label>
                <Controller
                  name="teamLeader"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleTeamLeaderChange(value);
                      }}
                      disabled={!director || loadingTeamLeaders}
                    >
                      <SelectTrigger id="teamLeader">
                        <SelectValue
                          placeholder={
                            loadingTeamLeaders
                              ? t('complaints.form.TeamLeaderLoading')
                              : director
                                ? t('complaints.form.selectTeamLeader')
                                : t('complaints.form.selectDirectorfirst')
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {teamLeaders.map((teamLeader) => {
                          const id = teamLeader.id;
                          const appointedPerson = teamLeader?.[`appointed_person_${language}`];
                          return (
                            <SelectItem key={teamLeader.id} value={`${id} | ${appointedPerson}`}>
                              {appointedPerson}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {/* Expertise (Employees) - always visible, optional */}
              <div className="space-y-1">
                <Label htmlFor="employee">{t('complaints.form.expertise')}</Label>
                <Controller
                  name="employee"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleEmployeeChange(value);
                      }}
                      disabled={!teamLeader || loadingEmployees}
                    >
                      <SelectTrigger id="employee">
                        <SelectValue
                          placeholder={
                            loadingEmployees
                              ? t('complaints.form.ExpertiseLoading')
                              : teamLeader
                                ? t('complaints.form.selectExpertise')
                                : t('complaints.form.selectTeamleaderfirst')
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((employee) => {
                          const id = employee.id;
                          const appointedPerson =
                            employee?.[`first_name_${language}`] +
                            ' ' +
                            employee?.[`middle_name_${language}`];
                          +' ' + employee?.[`last_name_${language}`];
                          return (
                            <SelectItem key={employee.id} value={`${id} | ${appointedPerson}`}>
                              {appointedPerson}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {/* Office number - optional */}
              <div className="space-y-2">
                <Label htmlFor="voiceOffice">{t('complaints.form.office')}</Label>
                <Input
                  id="voiceOffice"
                  {...register('office')}
                  onFocus={() => setActiveField('office')}
                  lang={language}
                  maxLength={20}
                />
                {errors.office && <p className="text-sm text-red-500">{errors.office.message}</p>}
                <p className="text-xs text-muted-foreground">
                  {watch('office')?.length || 0}/20 {t('complaints.form.characters.used')}
                </p>
              </div>
            </div>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button
                type="submit"
                className="px-8"
                disabled={isSubmitting || !audioUrl || !audioUrl.startsWith('blob:')}
              >
                {isSubmitting ? 'Submitting...' : t('complaints.form.submit')}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceForm;
