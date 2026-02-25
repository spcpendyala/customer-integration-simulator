import apiClient from './client';

export const sendWebhook = async (integrationType, payload) => {
  const { data } = await apiClient.post(`/webhook/${integrationType}`, payload);
  return data;
};

export const getEvents = async () => {
  const { data } = await apiClient.get('/events');
  return data;
};

export const getEvent = async (eventId) => {
  const { data } = await apiClient.get(`/events/${eventId}`);
  return data;
};

export const getEventLogs = async (eventId) => {
  const { data } = await apiClient.get(`/events/${eventId}/logs`);
  return data;
};

export const getMetrics = async () => {
  const { data } = await apiClient.get('/metrics');
  return data;
};
