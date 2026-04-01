import api from '../api';
export const configService = {
  getClinicConfig: async () => { const r = await api.get('/clinicadmin/config'); return r.data.data; },
  getScheduleConfig: async () => { const r = await api.get('/clinicadmin/config/schedule'); return r.data.data; },
  updateScheduleConfig: async (data: any) => { const r = await api.put('/clinicadmin/config/schedule', data); return r.data.data; },
  getDoctorSchedules: async () => { const r = await api.get('/clinicadmin/config/schedule/doctors'); return r.data.data; },
  updateDoctorSchedule: async (id: string, data: any) => { const r = await api.put(`/clinicadmin/config/schedule/doctors/${id}`, data); return r.data.data; },
  getBillingConfig: async () => { const r = await api.get('/clinicadmin/config/billing'); return r.data.data; },
  updateBillingConfig: async (data: any) => { const r = await api.put('/clinicadmin/config/billing', data); return r.data.data; },
  getIdConfig: async () => { const r = await api.get('/clinicadmin/config/id-config'); return r.data.data; },
  updateIdConfig: async (data: any) => { const r = await api.put('/clinicadmin/config/id-config', data); return r.data.data; },
};
