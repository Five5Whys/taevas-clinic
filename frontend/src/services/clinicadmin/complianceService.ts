import api from '../api';
export const complianceService = { getStatus: async () => { const r = await api.get('/clinicadmin/compliance/status'); return r.data.data; } };
