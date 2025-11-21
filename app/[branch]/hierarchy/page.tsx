'use client';
import { useLanguage } from '@/components/language-provider';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useOrganization } from '@/hooks/use-organization';
import { PICTURE_URL } from '@/constants/base_url';
import { useEffect } from 'react';
import { useSubcityName } from '@/hooks/use-subcity-name';
import { BackNavigation } from '@/components/back-navigation';

export default function EmployeesPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const { SectorLeaders } = useOrganization();
  const pathName = useSubcityName();

  function handleClick(id: string) {
    router.push(`/hierarchy/directors/${id}`);
  }
  useEffect(() => {
    console.log(SectorLeaders);
    console.log(pathName);
  }, [SectorLeaders, pathName]);

  return (
    <div className="mx-auto p-3">
      <BackNavigation />
      <h1 className="text-3xl font-bold mb-6">{t('employees.title')}</h1>

      <div className="flex flex-col md:flex-row  items-center justify-center gap-3 mb-8">
        {SectorLeaders.map((leader) => (
          <Card key={leader.id} className="w-full m-3 text-center  h-72 rounded-lg flex flex-col">
            <CardHeader className="bg-orange-500 rounded-t-lg" />

            <div className="flex justify-center -mt-10">
              <Avatar className="h-20 w-20 border-4 border-white">
                <AvatarImage
                  src={
                    leader.profile_picture
                      ? `${PICTURE_URL}${leader.profile_picture}`
                      : '/placeholder.svg'
                  }
                  alt={leader.name_en}
                />
                <AvatarFallback>{leader.name_en}</AvatarFallback>
              </Avatar>
            </div>

            <CardContent className="p-0 my-auto">
              <h2 className="text-lg font-semibold line-clamp-2">
                {leader[`appointed_person_${language}`]}
              </h2>
              <p>{leader[`office_location_${language}`]}</p>
              <div className="text-gray-500 line-clamp-2">{leader[`name_${language}`]}</div>
            </CardContent>

            <CardFooter className="mt-auto flex items-center justify-center">
              <Button variant="link" onClick={() => handleClick(leader.id)}>
                Members
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
