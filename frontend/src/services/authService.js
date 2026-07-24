import api from './axios';

export async function syncClerkUser(payload) {
  try {
    const response = await api.post('/auth/sync', payload);
    return response.data;
  } catch (err) {
    if (payload) {
      try {
        localStorage.setItem('dashnova_synced_user', JSON.stringify(payload));
      } catch (storageError) {
        console.warn('Unable to persist user to localStorage:', storageError);
      }
    }
    const error = new Error('Unable to sync user with backend');
    error.cause = err;
    throw error;
  }
}

