'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/language-provider';
import apiClient from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
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
import { Star } from 'lucide-react';
import { AmharicKeyboard } from '@/components/amharic-keyboard';
import {
  SectorLeader,
  Director,
  TeamLeader,
  Employee,
  Person,
  Sector,
  Subcities,
} from '@/types/types';
import { amare_directors } from '@/hierarchy/Amare.json';
import { elias_directors } from '@/hierarchy/Elias.json';
import { hawa_directors } from '@/hierarchy/hawa.json';
import { kibebew_directors } from '@/hierarchy/kibebew.json';
import { full_list } from '@/hierarchy/full_list.json';
import { subcity } from '@/components/sub-city.json';
import { leaders } from '@/hierarchy/sector_leaders.json';
import z from 'zod';
import { ratingSchema } from '@/schema/rating';
import { Control, Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RatingStars } from '@/components/rating-stars';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type ratingFormData = z.infer<typeof ratingSchema>;
interface RatingProps {
  name: string;
  control: Control<any>;
}
export default function RatingsPage() {
  const { t, language } = useLanguage();
  const [loadingSectorLeaders, setLoadingSectorLeaders] = useState(false);
  const [loadingDirectors, setLoadingDirectors] = useState(false);
  const [loadingTeamLeaders, setLoadingTeamLeaders] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingSubcities, setLoadingSubcities] = useState(false);
  const [subcities, setSubcities] = useState<Subcities[]>([]);
  const [selectedSectorLeaderName, setSelectedSectorLeaderName] = useState('');
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
    formState: { errors, isSubmitting, isValid },
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
    loadSectorLeaders();
    loadSubcities();
  }, []);

  const loadSectorLeaders = async () => {
    if (sectorLeaders.length > 0) return;
    setLoadingSectorLeaders(true);
    setErrorMessage(null);
    try {
      const response = await apiClient.getSectorLeaders();
      console.log(response);

      // Extract the data from the API response
      if (response && typeof response === 'object' && 'data' in response) {
        setSectorLeaders(response.data || []);
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
      setExperts(data || []);
    } catch (error) {
      console.error(`Failed to load employees for team leader ${id}:`, error);
      setErrorMessage('Failed to load employees. Please try again.');
      setEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleSectorLeaderChange = (value: string) => {
    setSelectedSectorLeader(value);
    setSelectedDirector('');
    setSelectedTeamLeader('');
    setSelectedExpert('');
    setDirectors([]);
    setTeamLeaders([]);
    setExperts([]);
    if (value) loadDirectors(value);
  };

  const handleDirectorChange = (value: string) => {
    setSelectedDirector(value);
    setSelectedTeamLeader('');
    setSelectedExpert('');
    setTeamLeaders([]);
    setExperts([]);
    if (value) loadTeamLeaders(value);
  };

  const handleTeamLeaderChange = (value: string) => {
    setSelectedTeamLeader(value);
    setSelectedExpert('');
    setExperts([]);
    if (value) loadEmployees(value);
  };
  const handleEmployeeChange = (employeeId: string) => {
    const [id, name] = employeeId.split('|');
    setEmployee_id(id);

    // Ensure both sides are the same type for comparison
    const selectedEmployee = employees.find((e) => String(e.id) === String(id));
    // setValue('office', selectedEmployee?.office_number || '');
  };
  const onSubmit = async (data: ratingFormData) => {
    if (!selectedSectorLeader) {
      console.error('error at submitted rating');
      toast({
        title: tr('ratings.form.errorTitle'),
        description: tr('ratings.form.errorBody'),
        variant: 'destructive',
      });
      return;
    }
    const [subcity_id, subcity_name] = data.subcity_id.split('|');
    const [sector_id, sector_name] = data.sectorLeader.split('|');

    try {
      const ratingData = {
        full_name: data.full_name,
        subcity_id: Number(subcity_id.trim()),
        sector_leader_id: Number(sector_id.trim()),
        director_id: getIdFromValue(data.director || ''),
        team_leader_id: getIdFromValue(data.teamLeader || ''),
        expert_id: getIdFromValue(data.experstise || ''),
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
        });
        setOverallRating(0);
        setCourtesyRating(0);
        setTimelinessRating(0);
        setKnowledgeRating(0);
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
    } finally {
    }
  };

  const handleAmharicInput = (char: string) => {
    if (activeField === 'comments') {
      setComments((prev) => prev + char);
    }
  };

  const focusField = (fieldName: string) => setActiveField(fieldName);

  return (
    <div className="container mx-auto px-4 py-8">
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
                          loadingSubcities ? 'Loading subcities...' : t('select.form.subcity')
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {subcities?.map((subcity) => {
                        const id = subcity.id;
                        const subcityName = subcity?.[`name_${language}`];
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
            </div>{' '}
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
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={tr('ratings.form.selectSectorLeader')} />
                    </SelectTrigger>
                    <SelectContent>
                      {sectorLeaders.map((sectorLeader, index) => {
                        const id = sectorLeader.id;
                        const appointedPerson = sectorLeader[`appointed_person_${language}`];
                        return (
                          <SelectItem key={index} value={`${id} | ${appointedPerson}`}>
                            {appointedPerson}
                          </SelectItem>
                        );
                      })}{' '}
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
                    disabled={!selectedSectorLeader}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          selectedSectorLeader
                            ? tr('ratings.form.selectDirector')
                            : tr('ratings.form.selectSectorLeaderFirst')
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
                    disabled={!selectedDirector}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          selectedDirector
                            ? tr('ratings.form.selectTeamLeader')
                            : tr('ratings.form.selectDirectorFirst')
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
                    }}
                    disabled={!selectedTeamLeader}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          selectedTeamLeader
                            ? tr('ratings.form.selectExpert')
                            : tr('ratings.form.selectTeamLeaderFirst')
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {experts.map((employee) => {
                        const id = employee.id;
                        const appointedPerson =
                          employee?.[`first_name_${language}`] +
                          employee?.[`last_name_${language}`];
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
                  onClick={() => setShowAmharicKeyboard(!showAmharicKeyboard)}
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
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                onFocus={() => focusField('comments')}
              />
              {showAmharicKeyboard && (
                <div className="mt-4 p-4 border rounded-md bg-muted">
                  <AmharicKeyboard onCharacterClick={handleAmharicInput} />
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
