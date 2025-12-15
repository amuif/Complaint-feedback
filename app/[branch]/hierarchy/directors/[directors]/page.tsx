'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLanguage } from '@/components/language-provider';
import { ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PICTURE_URL } from '@/constants/base_url';
import { useSubcityName } from '@/hooks/use-subcity-name';
import { Director } from '@/types/types';
import apiClient from '@/lib/api';

export default function DirectorsMenuPage() {
  const router = useRouter();
  const subcity = useSubcityName();
  const { language, t } = useLanguage();
  const { directors } = useParams();
  const slug = Array.isArray(directors) ? directors[0] : directors;
  const id = Number.parseInt(slug || '', 10);
  const [subcityDirectors, setSubcityDirectors] = useState<Director[]>([]);

  const loadDirectors = async (id: string) => {
    try {
      const data = await apiClient.getSubcityDirectors(id);
      setSubcityDirectors(data || []);
    } catch (error) {
      console.error(`Failed to load directors for sector leader ${id}:`, error);
      setSubcityDirectors([]);
    }
  };

  const handleMemberClick = (memberId: string) => {
    router.push(`/${subcity}/hierarchy/directors/${id}/teams/${memberId}`);
  };

  useEffect(() => {
    if (id && !isNaN(id)) {
      loadDirectors(id.toString());
    }
  }, [id]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t('navigation.back')}
        </Button>
      </div>

      {subcityDirectors.length === 0 ? (
        <div className="p-6 text-center bg-gray-100 rounded-lg">
          <p>{t('employees.noMembers')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subcityDirectors.map((emp) => {
            return (
              <Card key={emp.id} className="overflow-hidden shadow rounded-lg">
                <CardHeader className="bg-orange-500 h-16" />
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
                    <AvatarFallback>
                      {(emp[`name_${language}`] as string)?.charAt(0) || 'D'}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardContent className="text-center pt-4">
                  <p className="text-lg font-semibold">{emp[`appointed_person_${language}`]}</p>
                  <h2 className="text-gray-600 font-semibold">{emp[`name_${language}`]}</h2>
                  <p className="text-sm">
                    {t('employees.office')} {emp[`office_location_${language}`]}
                  </p>
                  <Button variant="link" size="sm" onClick={() => handleMemberClick(emp.id)}>
                    Members
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
