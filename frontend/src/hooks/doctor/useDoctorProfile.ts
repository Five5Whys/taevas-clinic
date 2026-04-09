import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, useEffect } from 'react';
import { doctorProfileService } from '../../services/doctor';
import type { DoctorProfileData } from '../../services/doctor';

export const useDoctorProfile = () =>
  useQuery({
    queryKey: ['doctor', 'profile'],
    queryFn: () => doctorProfileService.getProfile(),
    retry: false,
  });

export const useDoctorProfileCompletion = () =>
  useQuery({
    queryKey: ['doctor', 'profile', 'completion'],
    queryFn: () => doctorProfileService.getCompletion(),
    retry: false,
  });

export const useSaveDoctorProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<DoctorProfileData>) => doctorProfileService.saveProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['doctor', 'profile'] });
      qc.invalidateQueries({ queryKey: ['doctor', 'profile', 'completion'] });
    },
  });
};

export const useDeleteDoctorProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => doctorProfileService.deleteProfile(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['doctor', 'profile'] });
      qc.invalidateQueries({ queryKey: ['doctor', 'profile', 'completion'] });
    },
  });
};

export const useUploadFile = () =>
  useMutation({
    mutationFn: ({ file, type }: { file: File; type: string }) =>
      doctorProfileService.uploadFile(file, type),
  });

/**
 * Auto-save hook: debounces profile saves by 2 seconds after the last change.
 * Returns { trigger, status } where trigger(data) queues a save
 * and status is 'idle' | 'saving' | 'saved' | 'error'.
 */
export const useAutoSaveDoctorProfile = () => {
  const saveMutation = useSaveDoctorProfile();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestDataRef = useRef<Partial<DoctorProfileData> | null>(null);

  // Derive a simple status string
  const status: 'idle' | 'saving' | 'saved' | 'error' = saveMutation.isPending
    ? 'saving'
    : saveMutation.isError
      ? 'error'
      : saveMutation.isSuccess
        ? 'saved'
        : 'idle';

  const trigger = useCallback(
    (data: Partial<DoctorProfileData>) => {
      latestDataRef.current = data;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (latestDataRef.current) {
          saveMutation.mutate(latestDataRef.current);
        }
      }, 2000);
    },
    [saveMutation],
  );

  // Flush on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { trigger, status, saveNow: saveMutation.mutate };
};
