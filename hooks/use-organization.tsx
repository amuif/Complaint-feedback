'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { useState } from 'react';

export function useSectorLeadersQuery() {
  return useQuery({
    queryKey: ['get-sector-leaders'],
    queryFn: async () => {
      const response = await apiClient.getSectorLeaders();
      return response || [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useDirectorsQuery(sectorLeaderId?: string) {
  return useQuery({
    queryKey: ['get-directors-by-sector-leaders', sectorLeaderId],
    queryFn: async () => {
      if (!sectorLeaderId) return [];
      const response = await apiClient.getDirectorsBySectorLeader(sectorLeaderId);
      return response || [];
    },
    enabled: !!sectorLeaderId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useDepartmentsQuery(directorId?: string) {
  return useQuery({
    queryKey: ['get-departments-by-directors', directorId],
    queryFn: async () => {
      if (!directorId) return [];
      const response = await apiClient.getTeamLeadersByDirector(directorId);
      return response || [];
    },
    enabled: !!directorId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useEmployeesQuery(departmentId?: string) {
  return useQuery({
    queryKey: ['get-employees-by-department', departmentId],
    queryFn: async () => {
      if (!departmentId) return [];
      const response = await apiClient.getEmployeesByTeamLeader(departmentId);
      return response || [];
    },
    enabled: !!departmentId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useOrganization() {
  const [selectedSectorId, setSelectedSectorId] = useState<string>('');
  const [selectedDirectorId, setSelectedDirectorId] = useState<string>('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [subcityId, setSubcityId] = useState<string>('');

  const sectorsQuery = useSectorLeadersQuery();
  const directorsQuery = useDirectorsQuery(selectedSectorId);
  const departmentsQuery = useDepartmentsQuery(selectedDirectorId);
  const employeesQuery = useEmployeesQuery(selectedDepartmentId);

  const employeesInMainOffice = useQuery({
    queryKey: ['get-main-office-employees'],
    queryFn: async () => {
      const response = await apiClient.getEmployeesInMainOffice();
      return response || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const employeesBySubcityQuery = useQuery({
    queryKey: ['get-employees-by-subcity', subcityId],
    queryFn: async () => {
      if (!subcityId) return [];
      const response = await apiClient.getEmployeesBySubcity(subcityId);
      return response || [];
    },
    enabled: !!subcityId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    SectorLeaders: sectorsQuery.data || [],
    Directors: directorsQuery.data || [],
    Teams: departmentsQuery.data || [],
    Employees: employeesQuery.data || [],
    MainOfficeEmployees: employeesInMainOffice.data || [],
    EmployeesBySubcity: employeesBySubcityQuery.data || [],
    setSelectedSectorId,
    selectedSectorId,
    setSelectedDirectorId,
    selectedDirectorId,
    setSelectedDepartmentId,
    selectedDepartmentId,
    setSubcityId,
    subcityId,
    isLoading:
      sectorsQuery.isLoading ||
      directorsQuery.isLoading ||
      departmentsQuery.isLoading ||
      employeesQuery.isLoading,
    sectorsLoading: sectorsQuery.isLoading,
    directorsLoading: directorsQuery.isLoading,
    teamsLoading: departmentsQuery.isLoading,
    employeesLoading: employeesQuery.isLoading,
    error:
      sectorsQuery.error ||
      directorsQuery.error ||
      departmentsQuery.error ||
      employeesQuery.error ||
      employeesBySubcityQuery.isError,
  };
}
