import api from '../api';
export const dashboardService = { getStats: async () => { const r = await api.get('/clinicadmin/dashboard/stats'); return r.data.data; } };
