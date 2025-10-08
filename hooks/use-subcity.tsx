import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { useSubcityName } from './use-subcity-name';
import { Subcities } from '@/types/types';
import { useEffect, useState } from 'react';

export function useCurrentSubcity(): Subcities | null {
  const [currentSubcity, setCurrentSubcity] = useState<Subcities | null>(null);
  const subcityName = useSubcityName() || '';

  useEffect(() => {
    const fetchSubcity = async () => {
      try {
        const subcities = await apiClient.getSubcities();
        const nameToSlug = (name: string) =>
          name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        const found = subcities.find((branch) => nameToSlug(branch.name_en) === subcityName);
        setCurrentSubcity(found || null);
      } catch (error) {
        console.error('Failed to load current subcity:', error);
        setCurrentSubcity(null);
      }
    };

    fetchSubcity();
  }, [subcityName]);

  return currentSubcity || null;
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
    mutationFn: async ({ id, directorId }: { id: string; directorId: string }) => {
      return await apiClient.getTeamLeaderSubcityByDirector(id, directorId);
    },
  });
}
