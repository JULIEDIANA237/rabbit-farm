import { getAccessToken } from '@/lib/auth-storage';

/**
 * Photos des lapins : elles passent par l'API REST du backend
 * (envoi du fichier vers Supabase Storage), pas par GraphQL.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

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

export function uploadRabbitPhoto(rabbitId: string, file: File, isPrimary = true) {
  if (!file.type.startsWith('image/')) throw new Error('Le fichier doit être une image.');
  if (file.size > MAX_PHOTO_SIZE) throw new Error('La photo ne doit pas dépasser 5 Mo.');

  const body = new FormData();
  body.append('file', file);
  body.append('isPrimary', String(isPrimary));
  return request(`/rabbits/${rabbitId}/photos`, { method: 'POST', body });
}

export function setPrimaryRabbitPhoto(photoId: string) {
  return request(`/rabbits/photos/${photoId}/primary`, { method: 'PATCH' });
}

export function deleteRabbitPhoto(photoId: string) {
  return request(`/rabbits/photos/${photoId}`, { method: 'DELETE' });
}
