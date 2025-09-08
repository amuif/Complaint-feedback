'use client';
import { useLanguage } from '@/components/language-provider';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useOrganization } from '@/hooks/use-organization';
import { PICTURE_URL } from '@/constants/base_url';
import { useEffect } from 'react';

export default function EmployeesPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const { SectorLeaders } = useOrganization();

  function handleClick(id: string) {
    router.push(`/organization/directors/${id}`);
  }
  useEffect(() => {
    console.log(SectorLeaders);
  }, [SectorLeaders]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{t('employees.title')}</h1>

      {/* Leaders row */}
      <div className="flex items-center justify-center  gap-6 mb-8">
        {SectorLeaders.map((leader) => (
          <Card key={leader.id} className="w-full text-center">
            <CardHeader className="bg-orange-500 h-16" />
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
            <CardContent>
              <h2 className="text-lg font-semibold">{leader[`appointed_person_${language}`]}</h2>
              <Button variant="link" onClick={() => handleClick(leader.id)}>
                Members
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
