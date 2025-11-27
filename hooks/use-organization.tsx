'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { useState } from 'react';

interface ApiResponse<T> {
  data?: T;
  success: boolean;
  message?: string;
}

export function useOrganization() {
  const queryClient = useQueryClient();
  const [selectedSectorId, setSelectedSectorId] = useState<string>('');
  const [selectedDirectorId, setSelectedDirectorId] = useState<string>('');
  const [selectedDeparmentId, setSelectedDepartmentId] = useState<string>('');
  const [subcityId, setSubcityId] = useState<string>('');

  const sectorsQuery = useQuery({
    queryKey: ['get-sector-leaders'],
    queryFn: async () => {
      const response = await apiClient.getSectorLeaders();
      return response;
    },
  });

  const directorsQuery = useQuery({
    queryKey: ['get-directors-by-sector-leaders', selectedSectorId],
    queryFn: async () => {
      const response = await apiClient.getDirectorsBySectorLeader(selectedSectorId);
      return response;
    },
    enabled: !!selectedSectorId,
  });

  const departmentsQuery = useQuery({
    queryKey: ['get-departments-by-directors', selectedDirectorId],
    queryFn: async () => {
      const response = await apiClient.getTeamLeadersByDirector(selectedDirectorId);
      return response;
    },
    enabled: !!selectedDirectorId,
  });

  const employeesQuery = useQuery({
    queryKey: ['get-employees-by-deparment', selectedDeparmentId],
    queryFn: async () => {
      const response = await apiClient.getEmployeesByTeamLeader(selectedDeparmentId);
      return response;
    },
    enabled: !!selectedDeparmentId,
  });

  const employeesInMainOffice = useQuery({
    queryKey:['get-main-office-employees'],
    queryFn: async()=>{
      const response = await apiClient.getEmployeesInMainOffice()
     return response
    }
  })

  const employeesBySubcityQuery = useQuery({
    queryKey: ['get-employees-by-subcity', subcityId],
    queryFn: async () => {
      const response = await apiClient.getEmployeesBySubcity(subcityId);
      return response;
    },
  });

  return {
    SectorLeaders: sectorsQuery.data || [],
    Directors: directorsQuery.data || [],
    Teams: departmentsQuery.data || [],
    Employees: employeesQuery.data || [],
    MainOfficeEmployees:employeesInMainOffice.data || [],
    EmployeesBySubcity: employeesBySubcityQuery.data || [],
    setSelectedSectorId,
    selectedSectorId,
    setSelectedDirectorId,
    setSelectedDepartmentId,
    setSubcityId,
    subcityId,
    isLoading:
      sectorsQuery.isLoading ||
      directorsQuery.isLoading ||
      departmentsQuery.isLoading ||
      employeesQuery.isLoading ||
      employeesBySubcityQuery.isLoading,
    error:
      sectorsQuery.error ||
      directorsQuery.error ||
      departmentsQuery.error ||
      employeesQuery.error ||
      employeesBySubcityQuery.isError,
  };
}
