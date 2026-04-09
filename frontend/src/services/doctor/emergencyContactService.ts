import api from '../api';
export const emergencyContactService = {
  list: async (patientId: string) => { const r = await api.get(`/doctor/patients/${patientId}/emergency-contacts`); return r.data.data; },
  add: async (patientId: string, data: any) => { const r = await api.post(`/doctor/patients/${patientId}/emergency-contacts`, data); return r.data.data; },
  update: async (contactId: string, data: any) => { const r = await api.put(`/doctor/emergency-contacts/${contactId}`, data); return r.data.data; },
  delete: async (contactId: string) => { const r = await api.delete(`/doctor/emergency-contacts/${contactId}`); return r.data.data; },
};
