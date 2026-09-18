export function getJwtSecret(): string {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('La variable d’environnement JWT_SECRET est requise.');
  }

  return jwtSecret;
}