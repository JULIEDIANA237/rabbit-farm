'use client';

import { useRef, useState } from 'react';

import {
  Camera,
  Check,
  ImagePlus,
  Loader2,
  Star,
  Trash2,
} from 'lucide-react';

import type { RabbitPhoto } from '@/types/rabbit';

import { RabbitPhoto as RabbitPhotoDisplay } from './RabbitPhoto';

interface RabbitPhotoManagerProps {
  rabbitId: string;
  photos: RabbitPhoto[];
  uploading?: boolean;
  deleting?: boolean;
  settingPrimary?: boolean;

  onUpload: (file: File) => Promise<void>;
  onDelete: (photoId: string) => Promise<void>;
  onSetPrimary: (photoId: string) => Promise<void>;
}

export function RabbitPhotoManager({
  rabbitId,
  photos,
  uploading = false,
  deleting = false,
  settingPrimary = false,
  onUpload,
  onDelete,
  onSetPrimary,
}: RabbitPhotoManagerProps) {
  const galleryInputRef =
    useRef<HTMLInputElement>(null);

  const cameraInputRef =
    useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string | null>(
    null,
  );

  const handleFile = async (
    file?: File,
  ) => {
    if (!file) return;

    setError(null);

    if (!file.type.startsWith('image/')) {
      setError(
        'Veuillez sélectionner une image.',
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        'La photo ne doit pas dépasser 5 Mo.',
      );
      return;
    }

    try {
      await onUpload(file);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Impossible de charger la photo.',
      );
    }
  };

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Photos du lapin
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Ajoutez une photo pour faciliter
          l'identification et le suivi.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() =>
            cameraInputRef.current?.click()
          }
          disabled={uploading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <Camera size={18} />
          )}

          Prendre une photo
        </button>

        <button
          type="button"
          onClick={() =>
            galleryInputRef.current?.click()
          }
          disabled={uploading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <ImagePlus size={18} />
          Choisir dans la galerie
        </button>
      </div>

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(event) => {
          void handleFile(
            event.target.files?.[0],
          );

          event.target.value = '';
        }}
      />

      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          void handleFile(
            event.target.files?.[0],
          );

          event.target.value = '';
        }}
      />

      {photos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <ImagePlus
            className="mx-auto text-slate-400"
            size={32}
          />

          <p className="mt-3 text-sm text-slate-500">
            Aucune photo enregistrée.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <RabbitPhotoDisplay
                photo={photo}
                alt={`Photo du lapin ${rabbitId}`}
                size={220}
                className="!h-auto !w-full aspect-square rounded-none"
              />

              {photo.isPrimary && (
                <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-1 text-xs font-semibold text-white shadow">
                  <Check size={12} />
                  Principale
                </div>
              )}

              <div className="flex gap-2 p-2">
                {!photo.isPrimary && (
                  <button
                    type="button"
                    disabled={settingPrimary}
                    onClick={() =>
                      void onSetPrimary(
                        photo.id,
                      )
                    }
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-slate-100 px-2 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                  >
                    <Star size={14} />
                    Principale
                  </button>
                )}

                <button
                  type="button"
                  disabled={deleting}
                  onClick={() =>
                    void onDelete(photo.id)
                  }
                  className="flex items-center justify-center rounded-lg bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100 disabled:opacity-50"
                  aria-label="Supprimer la photo"
                >
                  {deleting ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <Trash2 size={15} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}