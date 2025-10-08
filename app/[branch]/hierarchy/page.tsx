'use client';
import { useLanguage } from '@/components/language-provider';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PICTURE_URL } from '@/constants/base_url';
import { useEffect, useState } from 'react';
import { useSubcityName } from '@/hooks/use-subcity-name';
import { useCurrentSubcity, useSubcityAdmin } from '@/hooks/use-subcity';
import { Sector, Subcities } from '@/types/types';

export default function EmployeesPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const subcity = useSubcityName();
  const { mutateAsync: findCurrentAdmin } = useSubcityAdmin();
  const currentSub = useCurrentSubcity();
  const [currentSubcity, setCurrentSubcity] = useState<Subcities | null>(null);
  const [subcityLeader, setSubcityLeader] = useState<Sector | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCurrentSubcity(currentSub);
    console.log(currentSub);
  }, [currentSub]);

  useEffect(() => {
    if (currentSubcity) {
      loadSectorLeaders();

      console.log(subcity);
    }
  }, [currentSubcity]);

  function handleClick(id: string) {
    if (!currentSub) return;
    router.push(`/${subcity}/hierarchy/directors/${id}`);
  }

  const loadSectorLeaders = async () => {
    try {
      if (currentSubcity && subcity) {
        setIsLoading(true);
        console.log('Loading sector leaders for current subcity:', currentSubcity.id);
        const response = await findCurrentAdmin(currentSubcity.id);
        console.log(response);
        setSubcityLeader(response);
      }
    } catch (error) {
      console.error('Failed to load sector leaders:', error);
      setSubcityLeader(null);
    } finally {
      setIsLoading(false);
    }
  };

  const leaderName = subcityLeader ? subcityLeader[`name_${language}` as keyof Sector] : '';
  const appointedPerson = subcityLeader
    ? subcityLeader[`appointed_person_${language}` as keyof Sector]
    : '';
  const officeLocation = subcityLeader
    ? subcityLeader[`office_location_${language}` as keyof Sector]
    : '';
  const profilePicture = subcityLeader?.profile_picture;
  const leaderId = subcityLeader?.id;

  // Get fallback initials
  const getFallbackInitials = () => {
    if (!subcityLeader) return 'SL';
    const name = subcityLeader.name_en || '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{t('employees.title')}</h1>
      <div className="flex items-center justify-center gap-6 mb-8">
        <Card className="w-full py-2 text-center h-64 rounded-lg">
          <CardHeader className="bg-orange-500 h-16" />
          <div className="flex justify-center -mt-10">
            <Avatar className="h-20 w-20 border-4 border-white">
              <AvatarImage
                src={profilePicture ? `${PICTURE_URL}${profilePicture}` : '/placeholder.svg'}
                alt={subcityLeader?.name_en || 'Subcity Leader'}
              />
              <AvatarFallback>{isLoading ? '...' : getFallbackInitials()}</AvatarFallback>
            </Avatar>
          </div>
          <CardContent>
            <h2 className="text-lg font-semibold">{appointedPerson || t('employees.noLeader')}</h2>
            <div>
              <p>{officeLocation || t('employees.noLocation')}</p>
            </div>
            <div className="text-gray-500">{leaderName || t('employees.noName')}</div>
            <div className="flex items-end justify-center">
              {leaderId && (
                <Button variant="link" onClick={() => handleClick(leaderId)} disabled={isLoading}>
                  {isLoading ? t('employees.loading') : t('employees.members')}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
