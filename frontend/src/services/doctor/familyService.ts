import api from '../api';
export const familyService = { getByPatient: async (id: string) => { const r = await api.get(`/doctor/family/patient/${id}`); return r.data.data; } };
