import api from '../api';

export interface DoctorProfileData {
  id?: string;
  status?: 'DRAFT' | 'COMPLETE';
  // Professional Info
  qualifications: string[];
  specializations: string[];
  experienceYears: number | null;
  // License
  medicalLicenseNumber: string;
  licenseIssuedCountry: string;
  licenseIssuedState: string;
  licenseCertificateUrl: string;
  // Identity
  panCardNumber: string;
  panCardAttachmentUrl: string;
  // Signature
  signatureUrl: string;
  // Contact
  email: string;
  // Address
  homeAddress: string;
  state: string;
  city: string;
  zipCode: string;
  // Other
  remarks: string;
}

export interface ProfileCompletion {
  complete: boolean;
  missingFields: string[];
  status: 'DRAFT' | 'COMPLETE';
  percentage: number;
  missingMandatory: string[];
  missingOptional: string[];
}

export const doctorProfileService = {
  getProfile: async (): Promise<DoctorProfileData | null> => {
    const r = await api.get('/doctors/profile');
    return r.data.data ?? null;
  },
  saveProfile: async (data: Partial<DoctorProfileData>): Promise<DoctorProfileData> => {
    const r = await api.put('/doctors/profile', data);
    return r.data.data;
  },
  deleteProfile: async (): Promise<void> => {
    await api.delete('/doctors/profile');
  },
  getCompletion: async (): Promise<ProfileCompletion> => {
    const r = await api.get('/doctors/profile/completion');
    const d = r.data.data;
    return {
      complete: d?.complete ?? false,
      missingFields: d?.missingFields ?? [],
      // Map BE response to FE interface
      status: d?.complete ? 'COMPLETE' : 'DRAFT',
      percentage: d?.complete ? 100 : 0,
      missingMandatory: d?.missingFields ?? [],
      missingOptional: [],
    };
  },
  uploadFile: async (file: File, type: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    const r = await api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return r.data.data?.url ?? r.data.data;
  },
};
