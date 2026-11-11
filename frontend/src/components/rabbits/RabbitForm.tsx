
'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useRef, useState } from 'react';
import {
  ArrowLeft,
  Camera,
  ImagePlus,
  Save,
  Trash2,
  Upload,
} from 'lucide-react';

import { useCreateRabbit } from '@/hooks/rabbits/useCreateRabbit';
import { getAccessToken } from '@/lib/auth-storage';
import type {
  CreateRabbitInput,
  RabbitSex,
} from '@/types/rabbit';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export function RabbitForm() {
  const router = useRouter();

  const { createRabbit, loading, error } = useCreateRabbit();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const [form, setForm] = useState<CreateRabbitInput>({
    code: '',
    sex: 'FEMALE',
    birthDate: '',
    color: '',
    weight: undefined,
    observations: '',
  });

  const updateField = <K extends keyof CreateRabbitInput>(
    field: K,
    value: CreateRabbitInput[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /**
   * Sélection d'une image depuis la galerie
   * ou la caméra du téléphone.
   */
  const handlePhotoSelected = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setPhotoError(null);

    // Vérification du type
    if (!file.type.startsWith('image/')) {
      setPhotoError(
        'Veuillez sélectionner une image valide.',
      );

      event.target.value = '';
      return;
    }

    // Limite raisonnable avant upload
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setPhotoError(
        'La photo ne doit pas dépasser 5 Mo.',
      );

      event.target.value = '';
      return;
    }

    setPhoto(file);

    const previewUrl = URL.createObjectURL(file);

    setPhotoPreview((oldPreview) => {
      if (oldPreview) {
        URL.revokeObjectURL(oldPreview);
      }

      return previewUrl;
    });
  };

  /**
   * Supprime uniquement la photo sélectionnée
   * avant la création du lapin.
   */
  const removePhoto = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhoto(null);
    setPhotoPreview(null);
    setPhotoError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  };

  /**
   * Upload de la photo après création du lapin.
   *
   * IMPORTANT :
   * l'URL /api/rabbits/{id}/photos doit correspondre
   * à ta route NestJS d'upload.
   */
  const uploadRabbitPhoto = async (
    rabbitId: string,
  ) => {
    if (!photo) {
      return;
    }

    setUploadingPhoto(true);
    setPhotoError(null);

    try {
      const token = getAccessToken();

      if (!token) {
        throw new Error(
          'Session expirée. Veuillez vous reconnecter.',
        );
      }

      const formData = new FormData();

      formData.append('file', photo);

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
        const responseText =
          await response.text();

        throw new Error(
          responseText ||
            `Erreur HTTP ${response.status}`,
        );
      }
    } catch (uploadError) {
      console.error(
        '[RABBIT PHOTO] Upload error:',
        uploadError,
      );

      throw new Error(
        'Le lapin a été créé, mais la photo n’a pas pu être enregistrée.',
      );
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!form.code.trim()) {
      return;
    }

    try {
      const input: CreateRabbitInput = {
        ...form,

        code: form.code.trim(),

        birthDate:
          form.birthDate || undefined,

        color:
          form.color?.trim() || undefined,

        observations:
          form.observations?.trim() || undefined,

        weight:
          form.weight !== undefined &&
          !Number.isNaN(form.weight)
            ? Number(form.weight)
            : undefined,
      };

      console.log(
        '[RABBIT] Création du lapin...',
      );

      const result = await createRabbit(input);

      const rabbitId = result?.id;

      if (!rabbitId) {
        throw new Error(
          'Le serveur n’a pas retourné l’identifiant du lapin.',
        );
      }

      console.log(
        '[RABBIT] Lapin créé:',
        rabbitId,
      );

      /**
       * La photo doit être envoyée APRÈS
       * la création du lapin afin d'avoir son ID.
       */
      let photoFailed = false;

      if (photo) {
        try {
          await uploadRabbitPhoto(rabbitId);
        } catch {
          // Le lapin existe déjà : on ouvre quand même sa fiche,
          // où l'éleveur peut réessayer d'ajouter la photo.
          photoFailed = true;
        }
      }

      /**
       * On va directement sur la fiche
       * du nouveau lapin.
       */
      router.push(`/rabbits/${rabbitId}${photoFailed ? '?photo=echec' : ''}`);
      router.refresh();
    } catch (submitError) {
      console.error(
        '[RABBIT] Erreur:',
        submitError,
      );
    }
  };

  const isSubmitting =
    loading || uploadingPhoto;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 pb-28">
      {/* Retour */}
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
      >
        <ArrowLeft size={18} />
        Retour
      </button>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-slate-900">
            Nouveau lapin
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Ajoutez un lapin à votre cheptel.
          </p>
        </div>

        {/* Erreur GraphQL */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error.message}
          </div>
        )}

        {/* Erreur photo */}
        {photoError && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {photoError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-7"
        >
          {/* ========================= */}
          {/* PHOTO */}
          {/* ========================= */}

          <section>
            <div className="mb-3">
              <h2 className="text-sm font-semibold text-slate-900">
                Photo du lapin
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Prenez une photo avec votre téléphone
                ou sélectionnez-la depuis la galerie.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 sm:flex-row">
              {/* Preview */}
              <div className="relative flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-200">
                {photoPreview ? (
                  <>
                    <img
                      src={photoPreview}
                      alt="Aperçu du lapin"
                      className="h-full w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700"
                      aria-label="Supprimer la photo"
                    >
                      <Trash2 size={17} />
                    </button>
                  </>
                ) : (
                  <Camera
                    size={42}
                    className="text-slate-400"
                  />
                )}
              </div>

              {/* Actions */}
              <div className="flex w-full flex-col gap-3 sm:w-auto">
                <button
                  type="button"
                  onClick={() =>
                    cameraInputRef.current?.click()
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
                >
                  <Camera size={18} />
                  Prendre une photo
                </button>

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <ImagePlus size={18} />
                  Galerie
                </button>

                <p className="text-center text-xs text-slate-400 sm:text-left">
                  JPG, PNG ou WEBP · 10 Mo max.
                </p>
              </div>
            </div>

            {/* Galerie */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoSelected}
            />

            {/* Caméra */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handlePhotoSelected}
            />
          </section>

          {/* ========================= */}
          {/* INFORMATIONS */}
          {/* ========================= */}

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Code */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Code *
              </label>

              <input
                value={form.code}
                onChange={(event) =>
                  updateField(
                    'code',
                    event.target.value,
                  )
                }
                placeholder="Ex : F03"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                required
              />
            </div>

            {/* Sexe */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Sexe *
              </label>

              <select
                value={form.sex}
                onChange={(event) =>
                  updateField(
                    'sex',
                    event.target.value as RabbitSex,
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="FEMALE">
                  Femelle
                </option>

                <option value="MALE">
                  Mâle
                </option>

                <option value="UNKNOWN">
                  Sexe inconnu
                </option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Date de naissance
              </label>

              <input
                type="date"
                value={form.birthDate ?? ''}
                onChange={(event) =>
                  updateField(
                    'birthDate',
                    event.target.value,
                  )
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            {/* Poids */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Poids (kg)
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                value={form.weight ?? ''}
                onChange={(event) =>
                  updateField(
                    'weight',
                    event.target.value
                      ? Number(event.target.value)
                      : undefined,
                  )
                }
                placeholder="Ex : 4.2"
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            {/* Couleur */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Couleur
              </label>

              <input
                value={form.color ?? ''}
                onChange={(event) =>
                  updateField(
                    'color',
                    event.target.value,
                  )
                }
                placeholder="Ex : Blanc"
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>
          </div>

          {/* Observations */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Observations
            </label>

            <textarea
              value={form.observations ?? ''}
              onChange={(event) =>
                updateField(
                  'observations',
                  event.target.value,
                )
              }
              rows={4}
              placeholder="Informations complémentaires..."
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploadingPhoto ? (
                <>
                  <Upload
                    size={18}
                    className="animate-pulse"
                  />
                  Enregistrement de la photo...
                </>
              ) : loading ? (
                <>
                  <Save size={18} />
                  Création...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Créer le lapin
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
