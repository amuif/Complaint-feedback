'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLanguage } from '@/components/language-provider';
import { ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PICTURE_URL } from '@/constants/base_url';
import apiClient from '@/lib/api';
import { Employee } from '@/types/types';

export default function EmployeesMembersPage() {
  const router = useRouter();
  const params = useParams();
  const { language, t } = useLanguage();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const teams = params.teams as string;
  const employeesId = params.employees as string;

  const loadEmployees = async (teamLeaderId: string) => {
    try {
      console.log('teamLeaderId', teamLeaderId);
      const data = await apiClient.getEmployeesByTeamLeader(teamLeaderId);
      console.log(data);
      setEmployees(data || []);
    } catch (error) {
      console.error(`Failed to load employees for team leader ${teamLeaderId}:`, error);
      setEmployees([]);
    }
  };

  useEffect(() => {
    if (employeesId) {
      loadEmployees(employeesId);
    }
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

      {employees.length === 0 ? (
        <div className="p-6 text-center rounded-lg">
          <p>There are no employees</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((emp) => {
            const firstName = emp[`first_name_${language}`] as string;
            const middleName = emp[`middle_name_${language}`] as string;
            const fullName = middleName ? `${firstName} ${middleName}` : firstName;

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
                      alt={fullName}
                    />
                    <AvatarFallback>{firstName?.charAt(0) || 'E'}</AvatarFallback>
                  </Avatar>
                </div>
                <CardContent className="text-center">
                  <h2 className="text-lg font-semibold">{fullName}</h2>
                  <p className="text-sm text-gray-600">{emp[`position_${language}`]}</p>
                  <p className="text-sm">
                    {t('employees.office')} {emp.office_number || 'N/A'}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
