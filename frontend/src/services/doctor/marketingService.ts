import api from '../api';
export const marketingService = { getReviews: async (params: any = {}) => { const r = await api.get('/doctor/marketing/reviews', { params }); return r.data.data?.content ?? r.data.data; } };
