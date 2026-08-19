'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/language-provider';
import apiClient from '@/lib/api';
import { Toaster } from '@/components/ui/toaster';
import { handleApiError, handleApiSuccess } from '@/lib/error-handler';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BackNavigation } from '@/components/back-navigation';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion } from 'framer-motion';
import AmharicKeyboard from '@/components/amharic-keyboard';
import { Director, TeamLeader, Employee, Sector, Subcities } from '@/types/types';
import z from 'zod';
import { ratingSchema } from '@/schema/rating';
import { Control, Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RatingStars } from '@/components/rating-stars';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useCurrentSubcity, useSubcityAdmin } from '@/hooks/use-subcity';
import { useSubcityName } from '@/hooks/use-subcity-name';

type ratingFormData = z.infer<typeof ratingSchema>;

export default function RatingsPage() {
  const { t, language } = useLanguage();
  const { mutateAsync: findCurrentAdmin } = useSubcityAdmin();
  const currentSub = useCurrentSubcity();
  const subcity = useSubcityName();

  const [loadingSectorLeaders, setLoadingSectorLeaders] = useState(false);
  const [loadingDirectors, setLoadingDirectors] = useState(false);
  const [loadingTeamLeaders, setLoadingTeamLeaders] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingSubcities, setLoadingSubcities] = useState(false);
  const [subcities, setSubcities] = useState<Subcities[]>([]);
  const [currentSubcity, setCurrentSubcity] = useState<Subcities | null>(null);
  const [subcityLeader, setSubcityLeader] = useState<Sector | Sector[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const suffix = language === 'en' ? '_en' : language === 'am' ? '_am' : '_om';
  const tr = (key: string) => t(`${key}${suffix}`);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ratingFormData>({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      full_name: '',
      subcity_id: '',
      sectorLeader: '',
      director: '',
      teamLeader: '',
      experstise: '',
      comment: '',
      overAllRating: 0,
      punctuality: 0,
      knowledge: 0,
      courtesy: 0,
    },
    mode: 'onChange',
  });

  // Rating states
  const [overallRating, setOverallRating] = useState(0);
  const [courtesyRating, setCourtesyRating] = useState(0);
  const [timelinessRating, setTimelinessRating] = useState(0);
  const [knowledgeRating, setKnowledgeRating] = useState(0);

  // Hover states for ratings
  const [hoverOverall, setHoverOverall] = useState(0);
  const [hoverCourtesy, setHoverCourtesy] = useState(0);
  const [hoverTimeliness, setHoverTimeliness] = useState(0);
  const [hoverKnowledge, setHoverKnowledge] = useState(0);

  // Form states
  const [showAmharicKeyboard, setShowAmharicKeyboard] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [comments, setComments] = useState('');

  // Hierarchy states
  const [sectorLeaders, setSectorLeaders] = useState<Sector[]>([]);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [teamLeaders, setTeamLeaders] = useState<TeamLeader[]>([]);
  const [experts, setExperts] = useState<Employee[]>([]);
  const [sector_id, setSector_id] = useState<string>('');
  const [directors_id, setDirectors_id] = useState<string>('');
  const [team_id, setTeam_id] = useState<string>('');
  const [employee_id, setEmployee_id] = useState<string>('');

  // Selected values
  const [selectedSectorLeader, setSelectedSectorLeader] = useState<string>('');
  const [selectedDirector, setSelectedDirector] = useState<string>('');
  const [selectedTeamLeader, setSelectedTeamLeader] = useState<string>('');
  const [selectedExpert, setSelectedExpert] = useState<string>('');

  useEffect(() => {
    loadSubcities();
  }, []);

  useEffect(() => {
    setCurrentSubcity(currentSub);
    if (currentSub && subcity) {
      loadSectorLeaders(currentSub.id);
    }
  }, [currentSub, subcity]);

  const loadSectorLeaders = async (subcityParamId?: string) => {
    setLoadingSectorLeaders(true);
    setErrorMessage(null);
    try {
      const targetSubcityId = subcityParamId || currentSubcity?.id;
      if (targetSubcityId && subcity) {
        console.log('Loading sector leaders for current subcity:', targetSubcityId);
        const response = await findCurrentAdmin(targetSubcityId);
        console.log('Subcity leader response:', response);
        const leaderData =
          response && typeof response === 'object' && 'data' in response
            ? (response as any).data
            : response;
        setSubcityLeader(leaderData);
      } else {
        console.log('Loading all sector leaders');
        const response = await apiClient.getSectorLeaders();
        if (response && typeof response === 'object' && 'data' in response) {
          setSectorLeaders((response as any).data || []);
        } else if (Array.isArray(response)) {
          setSectorLeaders(response);
        } else {
          setSectorLeaders([]);
        }
      }
    } catch (error) {
      console.error('Failed to load sector leaders:', error);
      setErrorMessage('Failed to load sector leaders. Please try again.');
      setSectorLeaders([]);
      setSubcityLeader(null);
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
    } catch (error) {
      console.error('Failed to load subcities:', error);
      setErrorMessage('Failed to load subcities. Please try again.');
      setSubcities([]);
    } finally {
      setLoadingSubcities(false);
    }
  };
  const loadDirectors = async (value: string) => {
    const [id] = value.split('|');
    const trimmedId = id.trim();
    setSector_id(trimmedId);
    setLoadingDirectors(true);
    setErrorMessage(null);
    try {
      let data: Director[] = [];
      if (currentSubcity && subcity) {
        data = await apiClient.getSubcityDirectors(trimmedId);
      } else {
        data = await apiClient.getDirectorsBySectorLeader(trimmedId);
      }
      const directorsList =
        data && typeof data === 'object' && 'data' in data ? (data as any).data : data;
      setDirectors(Array.isArray(directorsList) ? directorsList : []);
    } catch (error) {
      console.error(`Failed to load directors for sector leader ${trimmedId}:`, error);
      setErrorMessage('Failed to load directors. Please try again.');
      setDirectors([]);
    } finally {
      setLoadingDirectors(false);
    }
  };

  const loadTeamLeaders = async (directorId: string) => {
    const [id] = directorId.split('|');
    const trimmedId = id.trim();
    setDirectors_id(trimmedId);
    setLoadingTeamLeaders(true);
    setErrorMessage(null);
    try {
      let data: TeamLeader[] = [];
      if (currentSubcity && subcity) {
        data = await apiClient.getTeamLeaderSubcityByDirector(trimmedId, currentSubcity?.id);
      } else {
        data = await apiClient.getTeamLeadersByDirector(trimmedId);
      }
      const teamLeadersList =
        data && typeof data === 'object' && 'data' in data ? (data as any).data : data;
      setTeamLeaders(Array.isArray(teamLeadersList) ? teamLeadersList : []);
    } catch (error) {
      console.error(`Failed to load team leaders for director ${trimmedId}:`, error);
      setErrorMessage('Failed to load team leaders. Please try again.');
      setTeamLeaders([]);
    } finally {
      setLoadingTeamLeaders(false);
    }
  };

  const loadEmployees = async (teamLeader: string) => {
    const [id] = teamLeader?.split('|');
    const trimmedId = id.trim();
    setTeam_id(trimmedId);
    setLoadingEmployees(true);
    setErrorMessage(null);
    try {
      const data = await apiClient.getEmployeesByTeamLeader(trimmedId);
      const employeesList =
        data && typeof data === 'object' && 'data' in data ? (data as any).data : data;
      setExperts(Array.isArray(employeesList) ? employeesList : []);
    } catch (error) {
      console.error(`Failed to load employees for team leader ${trimmedId}:`, error);
      setErrorMessage('Failed to load employees. Please try again.');
      setExperts([]);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleSectorLeaderChange = (value: string) => {
    setSelectedSectorLeader(value);
    setSelectedDirector('');
    setSelectedTeamLeader('');
    setSelectedExpert('');
    setValue('director', '');
    setValue('teamLeader', '');
    setValue('experstise', '');
    setDirectors([]);
    setTeamLeaders([]);
    setExperts([]);
    if (value) loadDirectors(value);
  };

  const handleDirectorChange = (value: string) => {
    setSelectedDirector(value);
    setSelectedTeamLeader('');
    setSelectedExpert('');
    setValue('teamLeader', '');
    setValue('experstise', '');
    setTeamLeaders([]);
    setExperts([]);
    if (value) loadTeamLeaders(value);
  };

  const handleTeamLeaderChange = (value: string) => {
    setSelectedTeamLeader(value);
    setSelectedExpert('');
    setValue('experstise', '');
    setExperts([]);
    if (value) loadEmployees(value);
  };

  const handleEmployeeChange = (employeeId: string) => {
    const [id] = employeeId.split('|');
    setEmployee_id(id.trim());
    setSelectedExpert(employeeId);
  };

  const onSubmit = async (data: ratingFormData) => {
    if (!selectedSectorLeader) {
      console.error('error at submitted rating');
      toast.error(tr('ratings.form.errorTitle'));
      return;
    }
    const [subcity_id] = data.subcity_id.split('|');
    const [sector_id] = data.sectorLeader.split('|');

    try {
      const ratingData = {
        full_name: data.full_name,
        subcity_id: Number(subcity_id.trim()),
        sector_id: Number(sector_id.trim()),
        director_id: getIdFromValue(data.director || ''),
        department_id: getIdFromValue(data.teamLeader || ''),
        employee_id: getIdFromValue(data.experstise || ''),
        overall_rating: data.overAllRating,
        additional_comments: comments,
        courtesy: data.courtesy,
        punctuality: data.punctuality,
        knowledge: data.knowledge,
        comments: data.comment || undefined,
      };

      const response = await apiClient.submitRating(ratingData);

      if (response.success) {
        handleApiSuccess(tr('ratings.form.success'));
        // Reset all form fields
        reset({
          full_name: '',
          subcity_id: currentSubcity
            ? `${currentSubcity.id} | ${currentSubcity[`name_${language}`]}`
            : '',
          sectorLeader: '',
          director: '',
          teamLeader: '',
          experstise: '',
          comment: '',
          overAllRating: 0,
          punctuality: 0,
          knowledge: 0,
          courtesy: 0,
        });
        setComments('');
        setSelectedSectorLeader('');
        setSelectedDirector('');
        setSelectedTeamLeader('');
        setSelectedExpert('');
        setDirectors([]);
        setTeamLeaders([]);
        setExperts([]);
      } else {
        throw new Error(response.message || 'Failed to submit rating');
      }
    } catch (error) {
      handleApiError(error, tr('ratings.form.errorBody'));
    }
  };

  const handleAmharicInput = (char: string) => {
    if (activeField === 'comments') {
      setComments((prev) => prev + char);
    }
  };

  const focusField = (fieldName: string) => setActiveField(fieldName);

  return (
    <div className="container mx-auto p-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <BackNavigation />
        </div>

        <h1 className="text-3xl font-bold mb-2">{tr('ratings.title')}</h1>
        <p className="text-muted-foreground mb-8">{tr('ratings.subtitle')}</p>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">{tr('ratings.form.title')}</h2>
          <p className="text-muted-foreground mb-6">{tr('ratings.form.description')}</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1">
              <Label htmlFor="complainantName">{t('complaints.form.complainantName')} *</Label>
              <Input
                id="complainantName"
                {...register('full_name')}
                onFocus={() => setActiveField('complainantName')}
                lang={language}
                maxLength={50}
              />
              {errors.full_name && (
                <p className="text-sm text-red-500">{errors.full_name.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {watch('full_name')?.length || 0}/50 {t('complaints.form.characters.used')}
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
                      {subcities?.map((subcityItem) => {
                        const id = subcityItem.id;
                        const subcityName = subcityItem?.[`name_${language}`];
                        return (
                          <SelectItem key={id} value={`${id} | ${subcityName}`}>
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
            </div>

            {/* Sector Leader Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {tr('ratings.form.sectorLeader')}
              </label>
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
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingSectorLeaders
                            ? t('complaints.form.selectSectorLeaderLoading')
                            : tr('ratings.form.selectSectorLeader')
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {subcity ? (
                        (() => {
                          const leaders = Array.isArray(subcityLeader)
                            ? subcityLeader
                            : subcityLeader
                              ? [subcityLeader]
                              : [];
                          if (leaders.length === 0) {
                            return (
                              <SelectItem disabled value="no-items">
                                {loadingSectorLeaders ? 'Loading...' : 'No sector leaders found'}
                              </SelectItem>
                            );
                          }
                          return leaders
                            .map((leader, index) => {
                              const id = leader.id;
                              const appointedPerson =
                                leader[`appointed_person_${language}`] ||
                                leader[`appointed_person_en`] ||
                                leader[`name_${language}`] ||
                                leader[`name_en`];
                              if (!id || !appointedPerson) return null;
                              return (
                                <SelectItem key={id ?? index} value={`${id} | ${appointedPerson}`}>
                                  {appointedPerson}
                                </SelectItem>
                              );
                            })
                            .filter(Boolean);
                        })()
                      ) : (
                        Array.isArray(sectorLeaders) && sectorLeaders.length > 0 ? (
                          sectorLeaders
                            .filter((sector) => sector.subcity_id == null)
                            .map((sectorLeader, index) => {
                              const id = sectorLeader.id;
                              const appointedPerson =
                                sectorLeader[`appointed_person_${language}`] ||
                                sectorLeader[`appointed_person_en`] ||
                                sectorLeader[`name_${language}`] ||
                                sectorLeader[`name_en`];
                              return (
                                <SelectItem key={id ?? index} value={`${id} | ${appointedPerson}`}>
                                  {appointedPerson}
                                </SelectItem>
                              );
                            })
                            .filter(Boolean)
                        ) : (
                          <SelectItem disabled value="no-items">
                            {loadingSectorLeaders ? 'Loading...' : 'No sector leaders found'}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.sectorLeader && (
                <p className="text-sm text-red-500">{errors.sectorLeader?.message}</p>
              )}
            </div>

            {/* Director Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {tr('ratings.form.director')}
              </label>
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
                    disabled={!selectedSectorLeader || loadingDirectors}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingDirectors
                            ? t('complaints.form.DirectorLoading')
                            : selectedSectorLeader
                              ? tr('ratings.form.selectDirector')
                              : tr('ratings.form.selectSectorLeaderFirst')
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {directors.map((director, index) => {
                        const id = director.id;
                        const appointedPerson =
                          director?.[`appointed_person_${language}`] ||
                          director?.[`appointed_person_en`] ||
                          director?.[`name_${language}`] ||
                          director?.[`name_en`];
                        return (
                          <SelectItem key={id ?? index} value={`${id} | ${appointedPerson}`}>
                            {appointedPerson}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Team Leader Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {tr('ratings.form.teamLeader')}
              </label>
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
                    disabled={!selectedDirector || loadingTeamLeaders}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingTeamLeaders
                            ? t('complaints.form.TeamLeaderLoading')
                            : selectedDirector
                              ? tr('ratings.form.selectTeamLeader')
                              : tr('ratings.form.selectDirectorFirst')
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {teamLeaders.map((teamLeader, index) => {
                        const id = teamLeader.id;
                        const appointedPerson =
                          teamLeader?.[`appointed_person_${language}`] ||
                          teamLeader?.[`appointed_person_en`] ||
                          teamLeader?.[`name_${language}`] ||
                          teamLeader?.[`name_en`];
                        return (
                          <SelectItem key={id ?? index} value={`${id} | ${appointedPerson}`}>
                            {appointedPerson}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Expert Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">{tr('ratings.form.expert')}</label>
              <Controller
                name="experstise"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleEmployeeChange(value);
                    }}
                    disabled={!selectedTeamLeader || loadingEmployees}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingEmployees
                            ? t('complaints.form.ExpertiseLoading')
                            : selectedTeamLeader
                              ? tr('ratings.form.selectExpert')
                              : tr('ratings.form.selectTeamLeaderFirst')
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {experts.map((employee, index) => {
                        const id = employee.id;
                        const fullName = [
                          employee?.[`first_name_${language}`] || employee?.first_name_en,
                          employee?.[`middle_name_${language}`] || employee?.middle_name_en,
                          employee?.[`last_name_${language}`] || employee?.last_name_en,
                        ]
                          .filter(Boolean)
                          .join(' ');
                        return (
                          <SelectItem key={id ?? index} value={`${id} | ${fullName}`}>
                            {fullName}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {/* Ratings Section */}
            <div>
              <label className="text-sm font-medium mb-2 block">{tr('ratings.form.overall')}</label>
              <RatingStars name="overAllRating" control={control} />
              {errors.overAllRating && (
                <p className="text-sm text-red-500"> Please select a rating (1-5 stars)</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {tr('ratings.form.courtesy')}
                </label>
                <RatingStars name="courtesy" control={control} />
                {errors.courtesy && (
                  <p className="text-sm text-red-500"> Please select a rating (1-5 stars)</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {tr('ratings.form.punctuality')}
                </label>
                <RatingStars name="punctuality" control={control} />
                {errors.punctuality && (
                  <p className="text-sm text-red-500"> Please select a rating (1-5 stars)</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  {tr('ratings.form.knowledge')}
                </label>
                <RatingStars name="knowledge" control={control} />
                {errors.knowledge && (
                  <p className="text-sm text-red-500"> Please select a rating (1-5 stars)</p>
                )}
              </div>
            </div>
            {/* Comments Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">{tr('ratings.form.comments')}</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      console.log(window.innerWidth);
                      toast.error(t('error.showKeyboard'));
                      return;
                    }
                    setShowAmharicKeyboard(!showAmharicKeyboard);
                  }}
                >
                  {showAmharicKeyboard
                    ? tr('ratings.form.hideAmhKbd')
                    : tr('ratings.form.showAmhKbd')}
                </Button>
              </div>
              <Textarea
                placeholder={tr('ratings.form.shareExp')}
                className="min-h-[100px]"
                lang={language}
                dir={language === 'en' ? 'ltr' : 'auto'}
                inputMode="text"
                onFocus={() => focusField('comments')}
                {...register('comment')}
              />
              {showAmharicKeyboard && (
                <div className="mt-4 p-4 border rounded-md bg-muted">
                  <AmharicKeyboard onInput={(text) => setValue('comment', text)} />
                </div>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? tr('ratings.form.submitting') : tr('ratings.form.submit')}
            </Button>
          </form>
        </Card>
      </motion.div>
      <Toaster />
    </div>
  );
}
function getIdFromValue(value: string) {
  if (!value) return;
  const [id, name] = value.split('|');
  return Number(id.trim());
}
