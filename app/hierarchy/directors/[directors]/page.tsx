'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLanguage } from '@/components/language-provider';
import { ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useOrganization } from '@/hooks/use-organization';
import { PICTURE_URL } from '@/constants/base_url';
import { BackNavigation } from '@/components/back-navigation';

export default function DirectorsMenuPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const { directors } = useParams();
  const { Directors, setSelectedSectorId } = useOrganization();
  const slug = Array.isArray(directors) ? directors[0] : directors;
  const id = Number.parseInt(slug || '', 10);

  const handleMemberClick = (memberId: string) => {
    router.push(`/hierarchy/directors/${id}/teams/${memberId}`);
  };

  useEffect(() => {
    setSelectedSectorId(id.toString());
  }, []);

  useEffect(() => {
    console.log(Directors);
  }, [Directors]);
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <BackNavigation />
        {/* <h1 className="text-2xl font-bold">{leaderName}</h1> */}
      </div>

      {Directors.length === 0 ? (
        <div className="p-6 text-center bg-gray-100 rounded-lg">
          <p>{t('employees.noMembers')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Directors.map((emp) => {
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
                      alt={emp[`name_${language}`] as string}
                    />
                    <AvatarFallback>{emp[`name_${language}`]}</AvatarFallback>
                  </Avatar>
                </div>

                <CardContent className="text-center my-auto flex-1">
                  <p className="text-lg font-semibold">{emp[`appointed_person_${language}`]}</p>
                  <h2 className="text-gray-600 font-semibold">{emp[`name_${language}`]}</h2>
                  <p className="text-sm">
                    {t('employees.office')} {emp[`office_location_${language}`]}
                  </p>
                </CardContent>

                <CardFooter className="mt-auto flex justify-center">
                  <Button variant="link" size="sm" onClick={() => handleMemberClick(emp.id)}>
                    Members
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
