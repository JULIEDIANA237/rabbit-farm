'use client';

import {
  Camera,
  ImagePlus,
  X,
} from 'lucide-react';

interface RabbitPhotoPickerProps {
  file: File | null;
  preview: string | null;
  onChange: (
    file: File | null,
  ) => void;
}

export function RabbitPhotoPicker({
  file,
  preview,
  onChange,
}: RabbitPhotoPickerProps) {
  const handleFile = (
    selectedFile?: File,
  ) => {
    if (!selectedFile) {
      return;
    }

    if (
      !selectedFile.type.startsWith(
        'image/',
      )
    ) {
      return;
    }

    onChange(selectedFile);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-800">
        Photo du lapin
      </label>

      {preview ? (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <img
            src={preview}
            alt="Aperçu du lapin"
            className="h-64 w-full object-cover sm:h-72"
          />

          <button
            type="button"
            onClick={() =>
              onChange(null)
            }
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur"
            aria-label="Supprimer la photo"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100">
            <Camera size={28} />

            <span className="text-sm font-semibold">
              Prendre une photo
            </span>

            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(event) =>
                handleFile(
                  event.target.files?.[0],
                )
              }
            />
          </label>

          <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-600 transition hover:bg-slate-100">
            <ImagePlus size={28} />

            <span className="text-sm font-semibold">
              Galerie
            </span>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) =>
                handleFile(
                  event.target.files?.[0],
                )
              }
            />
          </label>
        </div>
      )}

      <p className="text-xs text-slate-500">
        Vous pourrez modifier la photo
        plus tard depuis la fiche du lapin.
      </p>
    </div>
  );
}