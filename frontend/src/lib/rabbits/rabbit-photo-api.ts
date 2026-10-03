import { getAccessToken } from '@/lib/auth-storage';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:3001';

function getHeaders(): HeadersInit {
  const token = getAccessToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

export async function uploadRabbitPhoto(
  rabbitId: string,
  file: File,
): Promise<void> {
  const formData = new FormData();

  formData.append('photo', file);

  const response = await fetch(
    `${API_URL}/rabbits/${rabbitId}/photos`,
    {
      method: 'POST',
      headers: getHeaders(),
      body: formData,
    },
  );

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      message || 'Impossible de télécharger la photo.',
    );
  }
}

export async function deleteRabbitPhoto(
  rabbitId: string,
  photoId: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/rabbits/${rabbitId}/photos/${photoId}`,
    {
      method: 'DELETE',
      headers: getHeaders(),
    },
  );

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      message || 'Impossible de supprimer la photo.',
    );
  }
}

export async function setRabbitPrimaryPhoto(
  rabbitId: string,
  photoId: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/rabbits/${rabbitId}/photos/${photoId}/primary`,
    {
      method: 'PATCH',
      headers: getHeaders(),
    },
  );

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      message || 'Impossible de définir la photo principale.',
    );
  }
}