import { getAccessToken } from '@/lib/auth-storage';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:3001';

export async function uploadRabbitPhoto(
  rabbitId: string,
  file: File,
) {
  const token = getAccessToken();

  if (!token) {
    throw new Error(
      'Session expirée. Veuillez vous reconnecter.',
    );
  }

  const formData = new FormData();

  formData.append('file', file);

  const response = await fetch(
    `${API_URL}/rabbits/${rabbitId}/photos`,
    {
      method: 'POST',

      headers: {
        Authorization: `Bearer ${token}`,
      },

      body: formData,
    },
  );

  if (!response.ok) {
    let message =
      'Impossible de télécharger la photo.';

    try {
      const body = await response.json();

      if (typeof body?.message === 'string') {
        message = body.message;
      }
    } catch {
      // réponse non JSON
    }

    throw new Error(message);
  }

  return response.json();
}