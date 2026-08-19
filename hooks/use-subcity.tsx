import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { useSubcityName } from './use-subcity-name';
import { Subcities } from '@/types/types';
import { useMemo } from 'react';

export function useSubcitiesQuery() {
  return useQuery({
    queryKey: ['subcities'],
    queryFn: async () => {
      const subcities = await apiClient.getSubcities();
      return subcities || [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });
}

export function useCurrentSubcity(): Subcities | null {
  const subcityName = useSubcityName() || '';
  const { data: subcities } = useSubcitiesQuery();

  const currentSubcity = useMemo(() => {
    if (!subcities || !subcityName) return null;
    const nameToSlug = (name: string) =>
      name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    return subcities.find((branch) => nameToSlug(branch.name_en) === subcityName) || null;
  }, [subcities, subcityName]);

  return currentSubcity;
}

export function useSubcityAdminQuery(subcityId?: string) {
  return useQuery({
    queryKey: ['subcity-admin', subcityId],
    queryFn: async () => {
      if (!subcityId) return [];
      const response = await apiClient.getSectorsBySubcity(subcityId);
      const data =
        response && typeof response === 'object' && 'data' in response
          ? (response as any).data
          : response;
      if (Array.isArray(data)) return data;
      if (data && typeof data === 'object') return [data];
      return [];
    },
    enabled: !!subcityId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSubcityDirectorsQuery(sectorLeaderId?: string) {
  return useQuery({
    queryKey: ['subcity-directors', sectorLeaderId],
    queryFn: async () => {
      if (!sectorLeaderId) return [];
      const response = await apiClient.getSubcityDirectors(sectorLeaderId.trim());
      const data =
        response && typeof response === 'object' && 'data' in response
          ? (response as any).data
          : response;
      return Array.isArray(data) ? data : [];
    },
    enabled: !!sectorLeaderId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSubcityTeamLeadersQuery(subcityId?: string, directorId?: string) {
  return useQuery({
    queryKey: ['subcity-team-leaders', subcityId, directorId],
    queryFn: async () => {
      if (!directorId || !subcityId) return [];
      const response = await apiClient.getTeamLeaderSubcityByDirector(directorId, subcityId);
      const data =
        response && typeof response === 'object' && 'data' in response
          ? (response as any).data
          : response;
      return Array.isArray(data) ? data : [];
    },
    enabled: !!directorId && !!subcityId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSubcityAdmin() {
  return useMutation({
    mutationFn: async (id: string) => {
      return await apiClient.getSectorsBySubcity(id);
    },
  });
}

export function useSubcityDirectors() {
  return useMutation({
    mutationFn: async (id: string) => {
      return await apiClient.getSubcityDirectors(id.trim());
    },
  });
}

export function useSubcityTeamLeaders() {
  return useMutation({
    mutationFn: async ({
      id,
      subcityId,
      directorId,
    }: {
      id?: string;
      subcityId?: string;
      directorId: string;
    }) => {
      const targetSubcityId = subcityId || id;
      return await apiClient.getTeamLeaderSubcityByDirector(directorId, targetSubcityId);
    },
  });
}
