'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLanguage } from '@/components/language-provider';
import { ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useEmployeesQuery } from '@/hooks/use-organization';
import { PICTURE_URL } from '@/constants/base_url';
import HierarchySkeleton from '@/components/hierarchy/hierarchy-skeleton';

export default function EmployeesMembersPage() {
  const router = useRouter();
  const params = useParams();
  const { language, t } = useLanguage();
  const teamLeaderId = (params.employees || params.teams) as string;
  const { data: Employees = [], isLoading } = useEmployeesQuery(teamLeaderId?.toString());

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

      {Employees.length === 0 ? (
        <div className="p-6 text-center bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p>{t('employees.noEmployees')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Employees.map((emp) => {
            const firstName =
              (emp as any)[`first_name_${language}`] ||
              (emp as any).first_name_en ||
              (emp as any).first_name_am ||
              '';
            const middleName =
              (emp as any)[`middle_name_${language}`] ||
              (emp as any).middle_name_en ||
              (emp as any).middle_name_am ||
              '';
            const lastName =
              (emp as any)[`last_name_${language}`] ||
              (emp as any).last_name_en ||
              (emp as any).last_name_am ||
              '';
            const fullName =
              [firstName, middleName, lastName].filter(Boolean).join(' ') ||
              (emp as any).name_en ||
              (emp as any)[`name_${language}`] ||
              '';
            const position =
              (emp as any)[`position_${language}`] ||
              (emp as any).position_en ||
              (emp as any).position_am ||
              '';

            return (
              <Card key={emp.id} className="overflow-hidden shadow rounded-lg flex flex-col h-72">
                <CardHeader className="bg-orange-500 h-16 rounded-t-lg" />

                {/* Avatar */}
                <div className="flex justify-center -mt-12">
                  <Avatar className="h-20 w-20 border-4 border-white">
                    <AvatarImage
                      src={
                        emp.profile_picture
                          ? `${PICTURE_URL}${emp.profile_picture}`
                          : '/placeholder.svg'
                      }
                      alt={fullName || 'Employee'}
                    />
                    <AvatarFallback>{fullName ? fullName.slice(0, 2).toUpperCase() : 'EMP'}</AvatarFallback>
                  </Avatar>
                </div>

                {/* Card Content */}
                <CardContent className="text-center flex-1 my-auto">
                  <h2 className="text-lg font-semibold line-clamp-2">{fullName}</h2>
                  {position && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{position}</p>}
                  {emp.office_number && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('employees.office')} {emp.office_number}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
