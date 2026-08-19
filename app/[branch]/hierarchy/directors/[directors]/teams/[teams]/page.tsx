'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLanguage } from '@/components/language-provider';
import { ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PICTURE_URL } from '@/constants/base_url';
import { useCurrentSubcity, useSubcityTeamLeadersQuery } from '@/hooks/use-subcity';
import HierarchySkeleton from '@/components/hierarchy/hierarchy-skeleton';

export default function DepartmentMembersPage() {
  const router = useRouter();
  const params = useParams();
  const { language, t } = useLanguage();
  const id = params.directors as string;
  const directorId = params.teams as string;
  const currentSubcity = useCurrentSubcity();
  const targetSubcityId = currentSubcity?.id || id;
  const { data: teamsList = [], isLoading } = useSubcityTeamLeadersQuery(targetSubcityId, directorId);

  const handleMemberClick = (memberId: string | number) => {
    const branchName = currentSubcity?.name_en.toLowerCase().replace(/\s+/g, '-') || (params.branch as string) || '';
    router.push(
      `/${branchName}/hierarchy/directors/${id}/teams/${directorId}/employees/${memberId}`
    );
  };

  if (isLoading) {
    return <HierarchySkeleton count={3} showTitle={false} />;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t('navigation.back')}
        </Button>
      </div>

      {teamsList.length === 0 ? (
        <div className="p-6 text-center bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p>{t('employees.noMembers')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamsList.map((emp, index) => {
            const appointedPerson =
              (emp as any)[`appointed_person_${language}`] ||
              (emp as any)[`appointed_person_af`] ||
              (emp as any)[`appointed_person_om`] ||
              (emp as any)[`appointed_person_am`] ||
              (emp as any)[`appointed_person_en`] ||
              (emp as any)[`name_${language}`] ||
              (emp as any)[`name_en`] ||
              '';
            const name =
              (emp as any)[`name_${language}`] ||
              (emp as any)[`name_af`] ||
              (emp as any)[`name_om`] ||
              (emp as any)[`name_am`] ||
              (emp as any)[`name_en`] ||
              '';
            const officeLocation =
              (emp as any)[`office_location_${language}`] ||
              (emp as any)[`office_location_af`] ||
              (emp as any)[`office_location_om`] ||
              (emp as any)[`office_location_am`] ||
              (emp as any)[`office_location_en`] ||
              (emp as any).office_number ||
              '';

            return (
              <Card key={emp.id ?? index} className="overflow-hidden shadow rounded-lg flex flex-col h-72">
                <CardHeader className="bg-orange-500 h-16 rounded-t-lg" />

                <div className="flex justify-center -mt-12">
                  <Avatar className="h-20 w-20 border-4 border-white">
                    <AvatarImage
                      src={
                        emp.profile_picture
                          ? `${PICTURE_URL}${emp.profile_picture}`
                          : '/placeholder.svg'
                      }
                      alt={name || appointedPerson || 'Team Leader'}
                    />
                    <AvatarFallback>{name ? name.slice(0, 2).toUpperCase() : 'TL'}</AvatarFallback>
                  </Avatar>
                </div>

                <CardContent className="text-center flex-1 my-auto">
                  <h2 className="text-lg font-semibold line-clamp-2">{name}</h2>
                  {appointedPerson && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{appointedPerson}</p>
                  )}
                  {officeLocation && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('employees.office')} {officeLocation}
                    </p>
                  )}
                </CardContent>

                <CardFooter className="mt-auto flex justify-center">
                  <Button variant="link" size="sm" onClick={() => handleMemberClick(emp.id)}>
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
