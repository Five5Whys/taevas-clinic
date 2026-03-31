import api from '../api';
export const reportService = { getReport: async () => { const r = await api.get('/clinicadmin/reports'); return r.data.data; } };
