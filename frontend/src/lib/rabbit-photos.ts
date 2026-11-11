import { getAccessToken } from '@/lib/auth-storage';
import { compressImage } from '@/lib/image-compress';

/**
 * Photos des lapins : elles passent par l'API REST du backend
 * (envoi du fichier vers Supabase Storage), pas par GraphQL.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function request(path: string, init: RequestInit) {
  const token = getAccessToken();
  if (!token) throw new Error('Session expirée. Reconnecte-toi.');

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { ...init.headers, Authorization: `Bearer ${token}` },
    });
  } catch {
    throw new Error('Serveur injoignable. Vérifie que le backend tourne.');
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string | string[] } | null;
    const message = Array.isArray(body?.message) ? body.message.join(' ') : body?.message;
    throw new Error(message || `Erreur ${response.status}`);
  }
  return response.json().catch(() => null);
}

export async function uploadRabbitPhoto(rabbitId: string, file: File, isPrimary = true) {
  const photo = await compressImage(file);

  const body = new FormData();
  body.append('file', photo);
  body.append('isPrimary', String(isPrimary));
  return request(`/rabbits/${rabbitId}/photos`, { method: 'POST', body });
}

export function setPrimaryRabbitPhoto(photoId: string) {
  return request(`/rabbits/photos/${photoId}/primary`, { method: 'PATCH' });
}

export function deleteRabbitPhoto(photoId: string) {
  return request(`/rabbits/photos/${photoId}`, { method: 'DELETE' });
}
