'use client';
import { useLanguage } from '@/components/language-provider';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PICTURE_URL } from '@/constants/base_url';
import { useEffect, useState } from 'react';
import { useSubcityName } from '@/hooks/use-subcity-name';
import { BackNavigation } from '@/components/back-navigation';
import { useCurrentSubcity, useSubcityAdminQuery } from '@/hooks/use-subcity';
import HierarchySkeleton from '@/components/hierarchy/hierarchy-skeleton';

export default function EmployeesPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const currentSubcity = useCurrentSubcity();
  const pathName = useSubcityName();
  const { data: subcitySector = [], isLoading } = useSubcityAdminQuery(currentSubcity?.id);

  function handleClick(id: string | number) {
    const branchName = pathName || currentSubcity?.name_en.toLowerCase().replace(/\s+/g, '-') || '';
    router.push(`/${branchName}/hierarchy/directors/${id}`);
  }

  if (isLoading || !currentSubcity) {
    return <HierarchySkeleton count={1} showTitle={true} />;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <BackNavigation />
      </div>
      <h1 className="text-3xl font-bold mb-6">{t('employees.title')}</h1>

      {subcitySector.length === 0 ? (
        <div className="p-6 text-center bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p>{t('employees.noMembers')}</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-8">
          {subcitySector.map((leader, index) => {
            const appointedPerson =
              leader[`appointed_person_${language}`] ||
              leader[`appointed_person_en`] ||
              leader[`name_${language}`] ||
              leader[`name_en`];
            const officeLocation =
              leader[`office_location_${language}`] ||
              leader[`office_location_en`] ||
              '';
            const name =
              leader[`name_${language}`] ||
              leader[`name_en`] ||
              '';

            return (
              <Card key={leader.id ?? index} className="w-full max-w-sm m-3 text-center h-72 rounded-lg flex flex-col shadow">
                <CardHeader className="bg-orange-500 rounded-t-lg h-16" />

                <div className="flex justify-center -mt-10">
                  <Avatar className="h-20 w-20 border-4 border-white">
                    <AvatarImage
                      src={
                        leader.profile_picture
                          ? `${PICTURE_URL}${leader.profile_picture}`
                          : '/placeholder.svg'
                      }
                      alt={leader.name_en || 'Profile'}
                    />
                    <AvatarFallback>{leader.name_en ? leader.name_en.slice(0, 2).toUpperCase() : 'SL'}</AvatarFallback>
                  </Avatar>
                </div>

                <CardContent className="p-0 my-auto">
                  <h2 className="text-lg font-semibold line-clamp-2">
                    {appointedPerson}
                  </h2>
                  {officeLocation && <p className="text-sm text-muted-foreground">{officeLocation}</p>}
                  {name && <div className="text-gray-500 text-sm line-clamp-2">{name}</div>}
                </CardContent>

                <CardFooter className="mt-auto flex items-center justify-center">
                  <Button variant="link" onClick={() => handleClick(leader.id)}>
                    {t('employees.members')}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
