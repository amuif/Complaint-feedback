import { Calendar, FileText, Mic } from 'lucide-react';
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
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { complaintSchema } from '@/schema/complaint';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { ComplaintData, Director, Employee, Sector, Subcities, TeamLeader } from '@/types/types';
import { Textarea } from '../ui/textarea';

import { AmharicKeyboard } from '../amharic-keyboard';

type ComplaintFormData = z.infer<typeof complaintSchema>;

const TextForm = () => {
  const { t, language } = useLanguage();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showAmharicKeyboard, setShowAmharicKeyboard] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sectorLeaders, setSectorLeaders] = useState<Sector[]>([]);
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

  const loadSectorLeaders = async () => {
    if (sectorLeaders.length > 0) return;
    setLoadingSectorLeaders(true);
    setErrorMessage(null);
    try {
      const response = await apiClient.getSectorLeaders();
      console.log(response);

      // Extract the data from the API response
      if (response && typeof response === 'object' && 'data' in response) {
        setSectorLeaders(response || []);
      } else if (Array.isArray(response)) {
        setSectorLeaders(response);
      } else {
        setSectorLeaders([]);
      }
    } catch (error) {
      console.error('Failed to load sector leaders:', error);
      setErrorMessage('Failed to load sector leaders. Please try again.');
      setSectorLeaders([]);
    } finally {
      setLoadingSectorLeaders(false);
    }
  };
  const loadSubcities = async () => {
    setLoadingSubcities(true);
    setErrorMessage(null);
    try {
      const response = await apiClient.getSubcities();
      setSubcities(response || []);
      console.log('subcities', response);
    } catch (error) {
      console.error('Failed to load subcities:', error);
      setErrorMessage('Failed to load subcities. Please try again.');
      setSubcities([]);
    } finally {
      setLoadingSubcities(false);
    }
  };
  const loadDirectors = async (value: string) => {
    const [id, name] = value.split('|');
    setSector_id(id);
    setLoadingDirectors(true);
    setErrorMessage(null);
    try {
      const data = await apiClient.getDirectorsBySectorLeader(id);
      setDirectors(data || []);
    } catch (error) {
      console.error(`Failed to load directors for sector leader ${id}:`, error);
      setErrorMessage('Failed to load directors. Please try again.');
      setDirectors([]);
    } finally {
      setLoadingDirectors(false);
    }
  };

  const loadTeamLeaders = async (directorId: string) => {
    console.info(directorId);
    const [id, name] = directorId.split('|');
    setDirectors_id(id);
    setLoadingTeamLeaders(true);
    setErrorMessage(null);
    try {
      const data = await apiClient.getTeamLeadersByDirector(id);
      console.log(data);
      setTeamLeaders(data || []);
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

    try {
      const complaintData: ComplaintData = {
        complaint_name: data.complainantName,
        phone_number: data.phone,
        subcity_id: subcity_id,
        woreda: data.woreda,
        complaint_description: data.complaintDetails,
        desired_action: data.actionRequired,
        sector_id: sector_id,
        division_id: directors_id,
        department_id: team_id,
        employee_id: employee_id,
        voice_note: audioUrl,
        complaint_source: 'public_complaint',
      };

      const response = await apiClient.submitComplaint(complaintData);

      if (response.success) {
        handleApiSuccess(
          `Complaint submitted successfully! Tracking code is your phone number: ${response.data?.tracking_code}`,
          'Success'
        );
        setAudioUrl(null);
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
    formState: { errors, isSubmitting, isValid },
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
      voice_file_path: '',
    },
    mode: 'onChange',
  });
  const sectorLeader = watch('sectorLeader');
  const director = watch('director');
  const teamLeader = watch('teamLeader');

  useEffect(() => {
    loadSectorLeaders();
    loadSubcities();
  }, []);

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
                      onValueChange={field.onChange}
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
                        {subcities?.map((subcity) => {
                          const id = subcity.id;
                          const subcityName = subcity?.[`name_${language}`];
                          return (
                            <SelectItem key={id} value={`${id}|${subcityName}`}>
                              {subcityName}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
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
                      {sectorLeaders.map((sectorLeader, index) => {
                        const id = sectorLeader.id;
                        const appointedPerson = sectorLeader[`appointed_person_${language}`];
                        return (
                          <SelectItem key={index} value={`${id}|${appointedPerson}`}>
                            {appointedPerson}
                          </SelectItem>
                        );
                      })}{' '}
                    </SelectContent>
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

            {/* Date */}
            <div className="space-y-1">
              <Label htmlFor="complaintDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t('complaints.form.date')} *
              </Label>
              <Input
                id="complaintDate"
                type="date"
                {...register('complaintDate')}
                lang={language}
              />
              {errors.complaintDate && (
                <p className="text-sm text-red-500">{errors.complaintDate.message}</p>
              )}
            </div>

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
              {showAmharicKeyboard && <AmharicKeyboard onCharacterClick={handleAmharicInput} />}
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
