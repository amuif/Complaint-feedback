'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLanguage } from '@/components/language-provider';
import { ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useOrganization } from '@/hooks/use-organization';
import { PICTURE_URL } from '@/constants/base_url';

export default function DepartmentMembersPage() {
  const router = useRouter();
  const params = useParams();
  const { language, t } = useLanguage();
  const { Teams, setSelectedDirectorId } = useOrganization();
  const id = params.directors as string;
  const teams = params.teams as string;

  const handleMemberClick = (memberId: string) => {
    router.push(`/organization/directors/${id}/teams/${memberId}/employees/${memberId}`);
  };

  useEffect(() => {
    setSelectedDirectorId(teams?.toString());
    console.log(teams);
    console.log(params);
  }, [teams]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t('navigation.back')}
        </Button>
        {/* <h1 className="text-2xl font-bold">{leaderName}</h1> */}
      </div>

      {Teams.length === 0 ? (
        <div className="p-6 text-center bg-gray-100 rounded-lg">
          <p>{t('employees.noMembers')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Teams.map((emp) => {
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
                    <AvatarFallback>{emp[`name_${language}`]}</AvatarFallback>
                  </Avatar>
                </div>
                <CardContent className="text-center">
                  <h2 className="text-lg font-semibold">{emp[`name_${language}`]}</h2>
                  <p className="text-sm text-gray-600">{emp[`appointed_person_${language}`]}</p>
                  <p className="text-sm ">
                    {t('employees.office')} {emp.office_number}
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
