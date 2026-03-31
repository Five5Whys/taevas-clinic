import api from '../api';
export const doctorBillingService = { getInvoices: async (params: any = {}) => { const r = await api.get('/doctor/billing', { params }); return r.data.data; } };
