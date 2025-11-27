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
import { useOrganization } from '@/hooks/use-organization';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { PICTURE_URL } from '@/constants/base_url';

type ComplaintFormData = z.infer<typeof voiceComplaint>;

const VoiceForm = () => {
  const { t, language } = useLanguage();
  const { EmployeesBySubcity, MainOfficeEmployees, setSubcityId } = useOrganization();
  const { mutateAsync: findCurrentAdmin } = useSubcityAdmin();
  const subcity = useSubcityName();
  const currentSub = useCurrentSubcity();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showNoData, setShowNoData] = useState<boolean>(false);
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
  const [foundEmployees, setFoundEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [hierarchyLoading, setHierarchyLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
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
  const subcityId = watch('subcity_id');
  useEffect(() => {
    setCurrentSubcity(currentSub);
    console.log(currentSub);
  }, [currentSub]);

  useEffect(() => {
    setCurrentSubcity(currentSub);
    if (currentSub) {
      console.log(currentSub.id);
      setSubcityId(currentSub.id);
    } else {
      setSubcityId('main');
    }
  }, [currentSub]);
  useEffect(() => {
    loadSubcities();
  }, []);
  useEffect(() => {
    if (!selectedEmployee) return;

    const loadHierarchy = async () => {
      setHierarchyLoading(true);
      try {
        setErrorMessage(null);

        console.log(`[${new Date().toISOString()}] 🧩 Selected employee:`, selectedEmployee);

        const sectorId = selectedEmployee.sector?.id;
        const directorId = selectedEmployee.division?.id;
        const teamLeaderId = selectedEmployee.department?.id;
        const appointedPerson = [
          selectedEmployee?.[`first_name_${language}`],
          selectedEmployee?.[`middle_name_${language}`],
          selectedEmployee?.[`last_name_${language}`],
        ]
          .filter(Boolean)
          .join(' ');
        // Build readable labels
        const sectorValue = `${sectorId} | ${selectedEmployee.sector?.[`appointed_person_${language}`] || ''}`;
        const directorValue = `${directorId} | ${selectedEmployee.division?.[`appointed_person_${language}`] || ''}`;
        const teamLeaderValue = `${teamLeaderId} | ${selectedEmployee.department?.[`appointed_person_${language}`] || ''}`;
        const employeeValue = `${selectedEmployee.id} | ${appointedPerson}`;

        // Load sector leaders
        console.log(`[${new Date().toISOString()}] ▶ Loading sector leaders...`);
        await loadSectorLeaders();
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Load directors with error handling
        console.log(`[${new Date().toISOString()}] ▶ Loading directors for sectorId=${sectorId}`);
        const directors = await loadDirectors(sectorValue);
        if (!directors || directors.length === 0) {
          throw new Error('No directors found for the selected sector');
        }
        console.log(`[${new Date().toISOString()}] Directors loaded: ${directors?.length ?? 0}`);
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Load team leaders with error handling
        console.log(
          `[${new Date().toISOString()}] ▶ Loading team leaders for directorId=${directorId}`
        );
        const teamLeaders = await loadTeamLeaders(directorValue);
        if (!teamLeaders || teamLeaders.length === 0) {
          throw new Error('No team leaders found for the selected director');
        }
        console.log(
          `[${new Date().toISOString()}] Team leaders loaded: ${teamLeaders?.length ?? 0}`
        );
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Load employees with error handling
        console.log(
          `[${new Date().toISOString()}] ▶ Loading employees for teamLeaderId=${teamLeaderId}`
        );
        const employees = await loadEmployees(teamLeaderValue);
        console.log(`[${new Date().toISOString()}] Employees loaded: ${employees?.length ?? 0}`);
        handleEmployeeChange(employeeValue);

        // Batch form updates
        setTimeout(() => {
          setValue('sectorLeader', sectorValue);
          setValue('director', directorValue);
          setValue('teamLeader', teamLeaderValue);

          const fullName = [
            selectedEmployee[`first_name_${language}`],
            selectedEmployee[`middle_name_${language}`],
            selectedEmployee[`last_name_${language}`],
          ]
            .filter(Boolean)
            .join(' ');

          setValue('employee', `${selectedEmployee.id} | ${fullName}`);
          setValue('office', selectedEmployee.office_number || '');
        }, 0);

        console.log(`[${new Date().toISOString()}] ✅ All hierarchy values populated successfully`);
      } catch (err) {
        console.error('❌ Error loading employee hierarchy:', err);
        setErrorMessage(`Failed to load organizational data: ${err}`);
      } finally {
        setHierarchyLoading(false);
      }
    };
    loadHierarchy();
  }, [selectedEmployee, language, setValue]);

  useEffect(() => {
    console.log(
      '🔍 CURRENT STATE - Directors:',
      directors.length,
      'TeamLeaders:',
      teamLeaders.length,
      'Employees:',
      employees.length
    );
  }, [directors, teamLeaders, employees]);

  const loadSectorLeaders = async () => {
    if (sectorLeaders.length > 0) return;
    setLoadingSectorLeaders(true);
    setErrorMessage(null);
    let response: Sector | Sector[];

    try {
      if (currentSubcity && subcity) {
        console.log('Loading sector leaders for current subcity:', currentSubcity.id);
        response = await findCurrentAdmin(currentSubcity.id);
        console.log(response);
        setSubcityLeader(response);
      } else {
        console.log('Loading all sector leaders');
        response = await apiClient.getSectorLeaders();
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
  const loadDirectors = async (value: string): Promise<Director[]> => {
    const [id, _] = value.split('|');
    setSector_id(id);
    setLoadingDirectors(true);
    setErrorMessage(null);
    let data: Director[] = [];
    try {
      if (currentSubcity && subcity) {
        console.log('going-subcity');
        data = await apiClient.getSubcityDirectors(id);
        console.log('Loaded directors:', data);
        setDirectors(data || []);
      } else {
        data = await apiClient.getDirectorsBySectorLeader(id);
        console.log(data);
        setDirectors(data || []);
      }
      return data;
    } catch (error) {
      console.error(`Failed to load directors for sector leader ${id}:`, error);
      setErrorMessage('Failed to load directors. Please try again.');
      setDirectors([]);
      return [];
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
  const loadTeamLeaders = async (director: string) => {
    const [id, _] = director.split('|');
    setDirectors_id(id);
    setLoadingTeamLeaders(true);
    setErrorMessage(null);
    let data: TeamLeader[];
    try {
      if (currentSubcity && subcity) {
        console.log('going dteam sub');
        data = await apiClient.getTeamLeaderSubcityByDirector(id, currentSub?.id);
        console.log(data);
        setTeamLeaders(data || []);
      } else {
        data = await apiClient.getTeamLeadersByDirector(id);
        console.log(data);
        setTeamLeaders(data || []);
      }
      return data;
    } catch (error) {
      console.error(`Failed to load team leaders for director ${director}:`, error);
      setErrorMessage('Failed to load team leaders. Please try again.');
      setTeamLeaders([]);
      return [];
    } finally {
      setLoadingTeamLeaders(false);
    }
  };
  const loadEmployees = async (teamLeader: string) => {
    const [id, _] = teamLeader?.split('|');
    console.log(id);
    setTeam_id(id);
    setLoadingEmployees(true);
    setErrorMessage(null);
    let data: Employee[];
    try {
      data = await apiClient.getEmployeesByTeamLeader(id);
      console.log(data);
      setEmployees(data || []);
      return data;
    } catch (error) {
      console.error(`Failed to load employees for team leader ${id}:`, error);
      setErrorMessage('Failed to load employees. Please try again.');
      setEmployees([]);
      return [];
    } finally {
      setLoadingEmployees(false);
    }
  };
  const handleSectorLeaderChange = (sectorLeaderId: string) => {
    setValue('director', '');
    setValue('teamLeader', '');
    setValue('employee', '');
    setValue('office', '');
    // setDirectors([]);
    // setTeamLeaders([]);
    // setEmployees([]);

    if (sectorLeaderId) {
      loadDirectors(sectorLeaderId);
    }
  };
  const handleDirectorChange = (directorId: string) => {
    setValue('teamLeader', '');
    setValue('employee', '');
    setValue('office', '');
    // setTeamLeaders([]);
    // setEmployees([]);

    if (directorId) {
      loadTeamLeaders(directorId);
    }
  };
  const handleTeamLeaderChange = (teamLeaderId: string) => {
    setValue('employee', '');
    setValue('office', '');
    // setEmployees([]);

    if (teamLeaderId) {
      console.log('teamLeaderId', teamLeaderId);
      loadEmployees(teamLeaderId);
    }
  };
  const handleEmployeeChange = (employeeId: string) => {
    const [id, _] = employeeId.split('|');
    setEmployee_id(id.trim());
    const selectedEmployee = employees.find((e) => String(e.id) === String(id));
    setValue('office', selectedEmployee?.office_number || '');
  };

  const onSubmit = async (data: voiceComplaintData) => {
    setErrorMessage(null);
    const [subcity_id, _] = data.subcity_id.split('|');
    try {
      const complaintData: voiceComplaintData = {
        complaint_name: data.complaint_name,
        phone_number: data.phone_number,
        subcity_id: subcity_id.trim().toString(),
        woreda: data.woreda,
        office: data.office || '',
        complaint_description: data.complaint_description,
        desired_action: data.desired_action,
        complaint_date: data.complaint_date,
        sector_id: sector_id.trim().toString(),
        division_id: directors_id.trim().toString(),
        department_id: team_id.trim().toString(),
        employee_id: employee_id.trim().toString(),
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
        setSearchQuery('');
        setFoundEmployees([]);
      } else {
        throw new Error(response.message || 'Failed to submit complaint');
      }
    } catch (error) {
      console.error('Failed to submit complaint:', error);
      setErrorMessage('Failed to submit complaint. Please try again.');
      handleApiError(error, 'Failed to submit complaint. Please try again.');
    }
  };
  const handleEmployeeBySubcitySearch = () => {
    if (!searchQuery) {
      console.log("Either searchQuery or employees bg subcity doesn't exit");
      return;
    }
    setShowNoData(false)
    if (subcity) {
      console.log("Subcity employees", EmployeesBySubcity);
      const employees =
        EmployeesBySubcity.filter((employee) =>
          employee[`first_name_${language}`].toLowerCase().includes(searchQuery)
        ) || [];
      console.log('Found employees', employees);
      setFoundEmployees(employees);
      if (employees.length === 0) {
        setShowNoData(true)
      }
    } else {
      const employees =
        MainOfficeEmployees.filter((employee) =>
          employee[`first_name_${language}`].toLowerCase().includes(searchQuery)
        ) || [];
      console.log('main office employees', employees);
      setFoundEmployees(employees);
      if (employees.length === 0) {
        setShowNoData(true)
      }

    }

  };
  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAttachment(file);
    // Set the value as File | null | undefined
    setValue('attachment', file, { shouldValidate: true });

    // Create preview for image files
    if (file && file.type.startsWith('image/') && typeof window !== 'undefined') {
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
              <Label>Quick search</Label>
              <div className="flex-col gap-3">
                <div className="flex gap-2">
                  <Input
                    value={searchQuery}
                    onChange={(e) => {
                      setShowNoData(false)
setSearchQuery(e.target.value)
                    }}
                    placeholder="Enter employees name"
                  />
                  <Button
                    type="button"
                    onClick={handleEmployeeBySubcitySearch}
                    disabled={!searchQuery.trim() || !subcityId}
                  >
                    Search
                  </Button>
                </div>
                <div>
                  <span className="text-sm">
                    For quick employee search, you must select a sub city first
                  </span>
                </div>
              </div>

              {foundEmployees.length !== 0 && (
                <ScrollArea className="h-[400px] w-full rounded-md border p-4 pt-6">
                  <div className="space-y-3 w-full">
                    {foundEmployees.map((employee) => (
                      <Card
                        key={employee.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4 p-4 rounded-xl shadow-sm "
                      >
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                          <Avatar className="h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0">
                            <AvatarImage
                              src={
                                typeof window !== 'undefined' &&
                                  employee.profile_picture instanceof File &&
                                  typeof window !== 'undefined'
                                  ? URL.createObjectURL(employee.profile_picture)
                                  : typeof employee.profile_picture === 'string'
                                    ? `${PICTURE_URL}/Uploads/profile_pictures/${employee.profile_picture}`
                                    : undefined
                              }
                              className="object-cover"
                            />
                            <AvatarFallback className="text-base sm:text-lg">
                              {employee[`first_name_${language}`] &&
                                employee[`last_name_${language}`]
                                ? `${employee[`first_name_${language}`][0]}${employee[`last_name_${language}`][0]}`
                                : 'NA'}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex flex-col text-center sm:text-left">
                            <span className="text-sm sm:text-base font-medium ">
                              {employee[`first_name_${language}`]}{' '}
                              {employee[`middle_name_${language}`]}{' '}
                              {employee[`last_name_${language}`]}
                            </span>
                            {employee.office_number && (
                              <CardDescription className="text-xs sm:text-sm ">
                                Office: {employee.office_number}
                              </CardDescription>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end sm:justify-center pt-0">
                          <Button
                            type="button"
                            onClick={() => setSelectedEmployee(employee)}
                            className="w-full sm:w-auto"
                          >
                            Select
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}

              {searchQuery && showNoData && (
                <div className='text-destructive'>
                  {t('employees.noMembers')}
                </div>
              )}
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
                  render={({ field }) => {
                    console.log('🔍 TeamLeader Field:', field.value);
                    return (
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
                    );
                  }}
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
                            hierarchyLoading
                              ? 'Loading employee data...'
                              : loadingEmployees
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
                          const appointedPerson = [
                            employee?.[`first_name_${language}`],
                            employee?.[`middle_name_${language}`],
                            employee?.[`last_name_${language}`],
                          ]
                            .filter(Boolean)
                            .join(' ');
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
