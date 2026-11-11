'use client';

import Image from 'next/image';
import {
  Camera,
  ImagePlus,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { useRef, useState } from 'react';

import type { RabbitPhoto } from '@/types/rabbit';

import {
  deleteRabbitPhoto,
  setPrimaryRabbitPhoto,
  uploadRabbitPhoto,
} from '@/lib/rabbit-photos';

interface RabbitPhotoManagerProps {
  rabbitId: string;
  photos: RabbitPhoto[];
  onChanged?: () => void;
}

export function RabbitPhotoManager({
  rabbitId,
  photos,
  onChanged,
}: RabbitPhotoManagerProps) {
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] =
    useState<RabbitPhoto | null>(null);

  const [busy, setBusy] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  /** Lance une action sur les photos, puis recharge la fiche. */
  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    setPhotoError(null);
    try {
      await action();
      onChanged?.();
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : 'Action impossible sur la photo.');
    } finally {
      setBusy(false);
    }
  }

  const primaryPhoto =
    photos.find((photo) => photo.isPrimary) ??
    photos[0] ??
    null;

  function handleFile(file: File) {
    return run(() => uploadRabbitPhoto(rabbitId, file, photos.length === 0));
  }

  function handleSetPrimary(photoId: string) {
    return run(() => setPrimaryRabbitPhoto(photoId));
  }

  async function handleDelete(photoId: string) {
    if (!window.confirm('Supprimer cette photo ?')) return;
    await run(() => deleteRabbitPhoto(photoId));
    setPreview(null);
  }

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    void handleFile(file);

    event.target.value = '';
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">
            Photos
          </h2>

          <p className="text-sm text-slate-500">
            Photo principale et galerie du lapin
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {photos.length} photo
          {photos.length > 1 ? 's' : ''}
        </span>
      </div>

      {busy && <p className="mb-3 text-sm text-slate-500">Envoi en cours…</p>}
      {photoError && (
        <p className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{photoError}</p>
      )}

      {primaryPhoto ? (
        <button
          type="button"
          onClick={() => setPreview(primaryPhoto)}
          className="group relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100"
        >
          <Image
            src={primaryPhoto.url}
            alt="Photo principale du lapin"
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            unoptimized
          />

          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow">
            <span className="inline-flex items-center gap-1">
              <Star size={13} className="fill-current" />
              Principale
            </span>
          </div>
        </button>
      ) : (
        <div className="mb-4 flex aspect-[4/3] items-center justify-center rounded-2xl bg-slate-100 text-center">
          <div>
            <Camera
              size={40}
              className="mx-auto text-slate-400"
            />

            <p className="mt-2 text-sm text-slate-500">
              Aucune photo
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={() =>
            cameraInputRef.current?.click()
          }
          className="flex min-h-28 flex-col items-center justify-center rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
        >
          <Camera size={24} />

          <span className="mt-2 text-sm font-semibold">
            Prendre une photo
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            galleryInputRef.current?.click()
          }
          className="flex min-h-28 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-600 transition hover:bg-slate-100"
        >
          <ImagePlus size={24} />

          <span className="mt-2 text-sm font-semibold">
            Galerie
          </span>
        </button>

        {photos
          .filter(
            (photo) =>
              photo.id !== primaryPhoto?.id,
          )
          .map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100"
            >
              <button
                type="button"
                onClick={() => setPreview(photo)}
                className="absolute inset-0"
              >
                <Image
                  src={photo.url}
                  alt="Photo du lapin"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </button>

              <div className="absolute inset-x-2 bottom-2 flex justify-between opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() =>
                    void handleSetPrimary(photo.id)
                  }
                  className="rounded-full bg-white p-2 shadow"
                  title="Définir comme principale"
                >
                  <Star size={15} />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    void handleDelete(photo.id)
                  }
                  className="rounded-full bg-white p-2 text-red-600 shadow"
                  title="Supprimer"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
      </div>

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleInputChange}
      />

      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />

      {preview && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative h-[80vh] w-full max-w-3xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <Image
              src={preview.url}
              alt="Photo du lapin"
              fill
              className="object-contain"
              unoptimized
            />

            <button
              type="button"
              onClick={() => setPreview(null)}
              className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-slate-700 shadow"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}