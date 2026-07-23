import api from './axios';

export function syncClerkUser(payload) {
  return api.post('/auth/sync', payload);
}
