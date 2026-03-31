import api from '../api';
export const doctorDashboardService = { getStats: async () => { const r = await api.get('/doctor/dashboard/stats'); return r.data.data; } };
