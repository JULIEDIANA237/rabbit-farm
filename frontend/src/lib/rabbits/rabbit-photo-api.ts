import { getAccessToken } from '@/lib/auth-storage';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:3001';

export interface RabbitPhoto {
  id: string;
  rabbitId: string;
  url: string;
  path: string;
  isPrimary: boolean;
  createdAt: string;
}

export async function uploadRabbitPhoto(
  rabbitId: string,
  file: File,
  isPrimary = true,
): Promise<RabbitPhoto> {
  const token =
    getAccessToken();

  if (!token) {
    throw new Error(
      'Session utilisateur absente.',
    );
  }

  const formData =
    new FormData();

  formData.append(
    'photo',
    file,
  );

  formData.append(
    'isPrimary',
    String(isPrimary),
  );

  const response =
    await fetch(
      `${API_URL}/rabbits/${rabbitId}/photos`,
      {
        method: 'POST',

        headers: {
          Authorization:
            `Bearer ${token}`,
        },

        body: formData,
      },
    );

  if (!response.ok) {
    const text =
      await response.text();

    throw new Error(
      text ||
        `Erreur upload photo (${response.status})`,
    );
  }

  return response.json();
}