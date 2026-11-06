import imageCompression from 'browser-image-compression';

export async function compressRabbitPhoto(
  file: File,
): Promise<File> {
  const compressed =
    await imageCompression(file, {
      maxSizeMB: 1,

      maxWidthOrHeight: 1600,

      useWebWorker: true,

      fileType: 'image/webp',
    });

  return new File(
    [compressed],
    `rabbit-${Date.now()}.webp`,
    {
      type: 'image/webp',
    },
  );
}