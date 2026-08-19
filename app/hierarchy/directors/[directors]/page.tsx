'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLanguage } from '@/components/language-provider';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useDirectorsQuery } from '@/hooks/use-organization';
import { PICTURE_URL } from '@/constants/base_url';
import { BackNavigation } from '@/components/back-navigation';
import HierarchySkeleton from '@/components/hierarchy/hierarchy-skeleton';

export default function DirectorsMenuPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const { directors } = useParams();
  const slug = Array.isArray(directors) ? directors[0] : directors;
  const id = Number.parseInt(slug || '', 10);
  const { data: Directors = [], isLoading } = useDirectorsQuery(slug?.toString());

  const handleMemberClick = (memberId: string) => {
    router.push(`/hierarchy/directors/${id}/teams/${memberId}`);
  };

  if (isLoading) {
    return <HierarchySkeleton count={3} showTitle={false} />;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <BackNavigation />
      </div>

      {Directors.length === 0 ? (
        <div className="p-6 text-center bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p>{t('employees.noMembers')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Directors.map((emp) => {
            const appointedPerson =
              emp[`appointed_person_${language}`] ||
              emp[`appointed_person_en`] ||
              emp[`name_${language}`] ||
              emp[`name_en`];
            const name =
              emp[`name_${language}`] ||
              emp[`name_en`] ||
              '';
            const officeLocation =
              emp[`office_location_${language}`] ||
              emp[`office_location_en`] ||
              '';

            return (
              <Card key={emp.id} className="overflow-hidden shadow rounded-lg flex flex-col h-72">
                <CardHeader className="bg-orange-500 h-16 rounded-t-lg" />

                <div className="flex justify-center -mt-12">
                  <Avatar className="h-20 w-20 border-4 border-white">
                    <AvatarImage
                      src={
                        emp.profile_picture
                          ? `${PICTURE_URL}${emp.profile_picture}`
                          : '/placeholder.svg'
                      }
                      alt={name || 'Director'}
                    />
                    <AvatarFallback>{name ? name.slice(0, 2).toUpperCase() : 'DIR'}</AvatarFallback>
                  </Avatar>
                </div>

                <CardContent className="text-center my-auto flex-1">
                  <p className="text-lg font-semibold">{appointedPerson}</p>
                  {name && <h2 className="text-gray-600 font-semibold">{name}</h2>}
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
