
const ACCESS_TOKEN_KEY = 'rabbit_farm_access_token';

export function setAccessToken(token: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, token);

  console.log('[AUTH STORAGE] Token enregistré');
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const token = localStorage.getItem(ACCESS_TOKEN_KEY);

  console.log(
    '[AUTH STORAGE] Token:',
    token ? 'présent' : 'absent',
  );

  return token;
}

export function removeAccessToken(): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(ACCESS_TOKEN_KEY);

  console.log('[AUTH STORAGE] Token supprimé');
}

