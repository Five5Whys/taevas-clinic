import api from '../api';
export const deviceReportService = { getAll: async (params: any = {}) => { const r = await api.get('/doctor/device-reports', { params }); return r.data.data?.content ?? r.data.data; } };
