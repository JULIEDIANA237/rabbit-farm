'use client';

import {
  Camera,
  ImagePlus,
  Trash2,
  Star,
} from 'lucide-react';

interface RabbitPhoto {
  id: string;
  url: string;
  isPrimary: boolean;
}

interface RabbitPhotoUploaderProps {
  rabbitId: string;
  photos: RabbitPhoto[];
  onUploaded?: () => void;
  onDeleted?: () => void;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:3001';

export function RabbitPhotoUploader({
  rabbitId,
  photos,
  onUploaded,
  onDeleted,
}: RabbitPhotoUploaderProps) {
  async function upload(file: File) {
    const token =
      localStorage.getItem(
        'rabbit_farm_access_token',
      );

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
      const text = await response.text();

      throw new Error(
        text || 'Échec de l’upload.',
      );
    }

    onUploaded?.();
  }

  async function handleFile(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      await upload(file);
    } catch (error) {
      console.error(
        '[PHOTO] Upload error:',
        error,
      );
    }

    event.target.value = '';
  }

  async function deletePhoto(
    photoId: string,
  ) {
    const token =
      localStorage.getItem(
        'rabbit_farm_access_token',
      );

    const response = await fetch(
      `${API_URL}/rabbits/photos/${photoId}`,
      {
        method: 'DELETE',

        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        'Impossible de supprimer la photo.',
      );
    }

    onDeleted?.();
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative aspect-square overflow-hidden rounded-2xl border bg-slate-100"
          >
            <img
              src={`${API_URL}${photo.url}`}
              alt="Photo du lapin"
              className="h-full w-full object-cover"
            />

            {photo.isPrimary && (
              <div className="absolute left-2 top-2 rounded-full bg-white/90 p-1.5">
                <Star
                  size={15}
                  className="fill-yellow-400 text-yellow-500"
                />
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                deletePhoto(photo.id)
              }
              className="absolute right-2 top-2 rounded-full bg-red-600 p-2 text-white shadow"
              aria-label="Supprimer la photo"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}

        {/* Appareil photo */}
        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100">
          <Camera size={28} />

          <span className="mt-2 text-sm font-semibold">
            Prendre une photo
          </span>

          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFile}
          />
        </label>

        {/* Galerie */}
        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-600 transition hover:bg-slate-100">
          <ImagePlus size={28} />

          <span className="mt-2 text-sm font-semibold">
            Galerie
          </span>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </label>
      </div>
    </div>
  );
}