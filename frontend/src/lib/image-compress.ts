/**
 * Réduit une photo dans le navigateur avant l'envoi : plus rapide en 3G et
 * sous la limite de 4,5 Mo des fonctions Vercel. Une photo de téléphone
 * de 5 à 10 Mo passe en général à 200–500 Ko.
 */
export const MAX_SOURCE_SIZE = 25 * 1024 * 1024;
export const MAX_UPLOAD_SIZE = 4 * 1024 * 1024;

export async function compressImage(file: File, maxSide = 1600, quality = 0.82): Promise<File> {
  if (!file.type.startsWith('image/')) throw new Error('Le fichier doit être une image.');
  if (file.size > MAX_SOURCE_SIZE) throw new Error('Cette photo est trop lourde (25 Mo maximum).');
  // Petites images : inutile de les retoucher.
  if (file.size <= 400 * 1024 && file.type !== 'image/heic') return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    // Format non lisible par le navigateur (HEIC sur certains Android) : on envoie tel quel.
    if (file.size > MAX_UPLOAD_SIZE) throw new Error('Format de photo non pris en charge. Choisis une photo JPG ou PNG.');
    return file;
  }

  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) return file;
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
  if (!blob || blob.size >= file.size) {
    if (file.size > MAX_UPLOAD_SIZE) throw new Error('Cette photo est trop lourde. Réduis-la avant de l’envoyer.');
    return file;
  }
  const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
  return new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() });
}
