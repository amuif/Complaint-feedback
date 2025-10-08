'use client';
import { FileText, Paperclip, X, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
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
import { useEffect, useState, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { complaintSchema } from '@/schema/complaint';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Director, Employee, Sector, Subcities, TeamLeader } from '@/types/types';
import { Textarea } from '../ui/textarea';
import { Calendar } from '@dhis2/ui';
import AmharicKeyboard from '../amharic-keyboard';

import { toGregorian, toEthiopian } from 'ethiopian-date';
type ComplaintFormData = z.infer<typeof complaintSchema>;

const TextForm = () => {
  const { t, language } = useLanguage();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { mutateAsync: findCurrentAdmin } = useSubcityAdmin();
  const currentSub = useCurrentSubcity();
  const subcity = useSubcityName();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showAmharicKeyboard, setShowAmharicKeyboard] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
  const [selectedSectorLeaderName, setSelectedSectorLeaderName] = useState('');
  const [subcities, setSubcities] = useState<Subcities[]>([]);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const [currentSubcity, setCurrentSubcity] = useState<Subcities | null>(null);
  // Calendar states
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarType, setCalendarType] = useState<'am' | 'en' | 'af'>('en');
  const [selectedDateDisplay, setSelectedDateDisplay] = useState('');

  // Inside your component
  const calendarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCurrentSubcity(currentSub);
  }, [currentSub]);

  useEffect(() => {
    loadSubcities();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);
  useEffect(() => {
    console.log(selectedDateDisplay);
  }, [selectedDateDisplay]);

  const handleDateSelect = (payload: any) => {
    console.log('Selected date payload:', payload);

    // Extract the date from the correct property
    let dateValue: string;

    if (payload && typeof payload === 'object') {
      if (payload.calendarDateString) {
        dateValue = payload.calendarDateString;
      } else if (payload.value) {
        dateValue = payload.value;
      } else if (payload.date) {
        dateValue = payload.date;
      } else {
        console.error('Unexpected payload format:', payload);
        return;
      }
    } else if (typeof payload === 'string') {
      dateValue = payload;
    } else {
      console.error('Invalid payload:', payload);
      return;
    }

    if (calendarType === 'am') {
      // Ensure format is dd/mm/yyyy
      const parts = dateValue.split('-'); // Some calendars may give yyyy-mm-dd
      if (parts.length === 3) {
        dateValue = `${parts[2]}/${parts[1]}/${parts[0]}`; // convert yyyy-mm-dd => dd/mm/yyyy
      }
    }
    console.log('Selected date value:', dateValue);

    // Set the form value
    setValue('complaintDate', dateValue, { shouldValidate: true });

    // Update display value based on calendar type
    // updateDateDisplay(dateValue);

    // Close calendar
    setShowCalendar(false);
  }; // Toggle between Ethiopian and Gregorian calendars

  // Get calendar props based on type
  const getCalendarProps = () => {
    const baseProps = {
      onDateSelect: handleDateSelect,
      onClose: () => setShowCalendar(false),
      selectedDate: watch('complaintDate'),
      locale: language === 'am' ? 'am-ET' : 'en',
    };

    if (calendarType === 'am') {
      return {
        ...baseProps,
        calendar: 'ethiopic' as const,
        locale: 'am-ET',
        numberingSystem: 'ethi',
        timeZone: 'Africa/Addis_Ababa',
        weekDayFormat: 'narrow' as const,
      };
    } else {
      return {
        ...baseProps,
        calendar: 'gregory' as const,
        timeZone: 'Africa/Addis_Ababa',
        weekDayFormat: 'narrow' as const,
      };
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

  const handleEmployeeChange = (employeeId: string) => {
    const [id, name] = employeeId.split('|');
    setEmployee_id(id);
    const selectedEmployee = employees.find((e) => String(e.id) === String(id));
    setValue('office', selectedEmployee?.office_number || '');
  };

  const onSubmit = async (data: ComplaintFormData) => {
    setErrorMessage(null);
    const [subcity_id, subcity_name] = data.subcity_id.split('|');

    let complaintDate = data.complaintDate;

    if (calendarType === 'am') {
      const converted = convertEthiopianToGregorian(data.complaintDate);
      if (!converted) {
        console.error('Failed to convert Ethiopian date:', data.complaintDate);
      }
      complaintDate = converted || data.complaintDate;
    }

    try {
      const formData = new FormData();

      formData.append('complaint_name', data.complainantName);
      formData.append('phone_number', data.phone);
      formData.append('subcity_id', subcity_id.toString());
      formData.append('woreda', data.woreda);
      formData.append('complaint_description', data.complaintDetails);
      formData.append('desired_action', data.actionRequired);
      formData.append('sector_id', sector_id.toString());
      formData.append('division_id', directors_id.toString());
      formData.append('department_id', team_id.toString());
      formData.append('employee_id', employee_id.toString());
      formData.append('complaint_source', 'public_complaint');
      formData.append('complaint_date', complaintDate);

      if (attachment) {
        formData.append('attachment', attachment);
      }

      const response = await apiClient.submitComplaint(formData);

      if (response.success) {
        handleApiSuccess(
          `Complaint submitted successfully! Tracking code is your phone number: ${response.data?.tracking_code}`,
          'Success'
        );
        setAudioUrl(null);
        reset();
        setSelectedDateDisplay('');
        setAttachment(null);
      } else {
        throw new Error(response.message || 'Failed to submit complaint');
      }
    } catch (error) {
      console.error('Failed to submit complaint:', error);
      setErrorMessage('Failed to submit complaint. Please try again.');
      handleApiError(error, 'Failed to submit complaint. Please try again.');
    }
  };

  const handleAmharicInput = (char: string) => {
    if (!activeField) return;

    const currentValue = watch(activeField as keyof ComplaintFormData) || '';
    setValue(activeField as keyof ComplaintFormData, currentValue + char);
  };
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      complainantName: '',
      subcity_id: '',
      woreda: '',
      phone: '',
      complaintDetails: '',
      sectorLeader: '',
      director: '',
      teamLeader: '',
      employee: '',
      office: '',
      actionRequired: '',
      complaintDate: '',
      attachment: null,
      voice_file_path: '',
    },
    mode: 'onChange',
  });
  const sectorLeader = watch('sectorLeader');
  const director = watch('director');
  const teamLeader = watch('teamLeader');
  const complaintDate = watch('complaintDate');

  useEffect(() => {
    if (complaintDate) {
      console.log('Raw complaintDate:', complaintDate);

      if (calendarType === 'am') {
        // Handle Ethiopian date format (dd/mm/yyyy)
        const parts = complaintDate.split('/');
        console.log('Ethiopian date parts:', parts);

        if (parts.length === 3) {
          const [day, month, year] = parts;
          setSelectedDateDisplay(`${day}/${month}/${year}`);
        } else {
          // Fallback if format is unexpected
          setSelectedDateDisplay(complaintDate);
        }
      } else {
        // Handle Gregorian date
        try {
          const date = new Date(complaintDate);
          if (!isNaN(date.getTime())) {
            setSelectedDateDisplay(date.toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US'));
          } else {
            // If it's already in display format, use it directly
            setSelectedDateDisplay(complaintDate);
          }
        } catch (error) {
          console.error('Error formatting date:', error);
          setSelectedDateDisplay(complaintDate);
        }
      }
    } else {
      setSelectedDateDisplay('');
    }
  }, [complaintDate, calendarType, language]);
  useEffect(() => {
    setCalendarType(language);
  }, [language]);

  return (
    <div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('complaints.submit.title')}
          </CardTitle>
          <CardDescription>{t('complaints.submit.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Complainant's full-name */}
            <div className="space-y-1">
              <Label htmlFor="complainantName">{t('complaints.form.complainantName')} *</Label>
              <Input
                id="complainantName"
                {...register('complainantName')}
                onFocus={() => setActiveField('complainantName')}
                lang={language}
                maxLength={50}
              />
              {errors.complainantName && (
                <p className="text-sm text-red-500">{errors.complainantName.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {watch('complainantName')?.length || 0}/50 {t('complaints.form.characters.used')}
              </p>
            </div>
            {/* Sub-city and Woreda */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            loadingSubcities
                              ? t('select.form.subcityLoading')
                              : t('select.form.subcity')
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
                <Label htmlFor="woreda">{t('complaints.form.woreda')}</Label>
                <Input id="woreda" {...register('woreda')} lang={language} maxLength={20} />
                {errors.woreda && <p className="text-sm text-red-500">{errors.woreda.message}</p>}
                <p className="text-xs text-muted-foreground">
                  {watch('woreda')?.length || 0}/20 {t('complaints.form.characters.used')}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t('complaints.form.phone')} *</Label>
              <Input
                id="phone"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                lang={language}
                dir="ltr"
                {...register('phone')}
                maxLength={10}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
              <p className="text-xs text-muted-foreground">
                {watch('phone')?.length || 0}/10 {t('complaints.form.characters.used')}
              </p>
            </div>
            {/* Sector Leader - always visible, optional */}
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
                              const appointedPerson = sectorLeader[`appointed_person_${language}`];
                              return (
                                <SelectItem key={id ?? index} value={`${id} | ${appointedPerson}`}>
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
                          <SelectItem key={index} value={`${id}|${appointedPerson}}`}>
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
            <div className="space-y-1">
              <Label htmlFor="office">{t('complaints.form.office')}</Label>
              <Input
                id="office"
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
            {/* Complaint description */}
            <div className="space-y-1">
              <Label htmlFor="complaintDetails">{t('complaints.form.issueDescription')} *</Label>
              <Textarea
                id="complaintDetails"
                {...register('complaintDetails')}
                lang={language}
                dir={language === 'am' ? 'ltr' : 'auto'}
                inputMode="text"
                onFocus={() => setActiveField('complaintDetails')}
                className="min-h-[100px]"
                maxLength={100}
              />
              {errors.complaintDetails && (
                <p className="text-sm text-red-500">{errors.complaintDetails.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {watch('complaintDetails')?.length || 0}/100 {t('complaints.form.characters.used')}
              </p>
            </div>
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
            {/* Date */}
            <div className="space-y-3">
              <Label htmlFor="complaintDate" className="flex items-center gap-2 text-base">
                <CalendarIcon className="h-5 w-5" />
                {t('complaints.form.date')} *
              </Label>

              <div className="flex flex-col gap-3">
                {/* Date Display and Calendar Trigger */}
                <div className="relative">
                  {/* Hidden input for form registration */}
                  <Input
                    id="complaintDate"
                    type="hidden"
                    {...register('complaintDate', { required: true })}
                  />
                  <div className="flex gap-2">
                    <Input
                      value={selectedDateDisplay}
                      readOnly
                      onClick={() => setShowCalendar(!showCalendar)}
                      placeholder={
                        calendarType === 'am' ? 'የኢትዮጵያ ቀን ምረጥ' : 'Select Gregorian date'
                      }
                      className="cursor-pointer flex-1 font-amharic"
                      dir={calendarType === 'am' ? 'ltr' : 'ltr'}
                    />
                  </div>

                  {/* DHIS2 Calendar */}
                  {showCalendar && (
                    <div
                      ref={calendarRef}
                      className="absolute z-50 mt-2 border rounded-lg shadow-lg bg-white"
                    >
                      <Calendar {...getCalendarProps()} />
                    </div>
                  )}
                </div>
              </div>

              {errors.complaintDate && (
                <p className="text-sm text-red-500">{errors.complaintDate.message}</p>
              )}
            </div>{' '}
            {/* Action required */}
            <div className="space-y-1">
              <Label htmlFor="actionRequired">{t('complaints.form.explanation')} *</Label>
              <Textarea
                id="actionRequired"
                {...register('actionRequired')}
                lang={language}
                dir={language === 'am' ? 'ltr' : 'auto'}
                inputMode="text"
                onFocus={() => setActiveField('actionRequired')}
                className="min-h-[100px]"
                maxLength={100}
                placeholder={t('complaints.form.Briefexplanation')}
              />
              {errors.actionRequired && (
                <p className="text-sm text-red-500">{errors.actionRequired.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {watch('actionRequired')?.length || 0}/100 {t('complaints.form.characters.used')}
              </p>
            </div>
            {/* Agreement checkbox */}
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="agreement" className="rounded border-gray-300" required />
              <label htmlFor="agreement" className="text-sm font-normal">
                {t('complaints.form.agreement')}
              </label>
            </div>
            {/* Amharic keyboard toggle */}
            <div>
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
              <div className="">{showAmharicKeyboard && <AmharicKeyboard />}</div>
            </div>
            {/* Submit button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : t('complaints.form.submit')}
            </Button>
          </form>
        </CardContent>
      </Card>
      {/* {showAmharicKeyboard && ( */}
      {/*   <div className="mt-8"> */}
      {/*     <AmharicKeyboard onCharacterClick={handleAmharicInput} /> */}
      {/*   </div> */}
      {/* )} */}
    </div>
  );
};

export default TextForm;

import * as ethiopianDate from 'ethiopian-date';
import { useCurrentSubcity, useSubcityAdmin } from '@/hooks/use-subcity';
import { useSubcityName } from '@/hooks/use-subcity-name';

export const convertEthiopianToGregorian = (ethDate: string): string | null => {
  if (!ethDate) return null;

  const parts = ethDate.split('/').map((p) => Number(p));
  if (parts.length !== 3) return null;
  const [day, month, year] = parts;
  if ([day, month, year].some((v) => isNaN(v))) return null;

  try {
    // Note: toGregorian expects (year, month, day)
    const res = (ethiopianDate as any).toGregorian(year, month, day);

    // The library may return [y,m,d] or { year, month, day }
    let gYear: number, gMonth: number, gDay: number;
    if (Array.isArray(res)) {
      [gYear, gMonth, gDay] = res;
    } else if (res && typeof res === 'object') {
      gYear = res.year ?? res[0];
      gMonth = res.month ?? res[1];
      gDay = res.day ?? res[2];
    } else {
      return null;
    }

    if ([gYear, gMonth, gDay].some((v) => typeof v !== 'number' || isNaN(v))) return null;

    return `${gYear}-${String(gMonth).padStart(2, '0')}-${String(gDay).padStart(2, '0')}`;
  } catch (err) {
    console.error('Ethiopian → Gregorian conversion failed:', err);
    return null;
  }
};
