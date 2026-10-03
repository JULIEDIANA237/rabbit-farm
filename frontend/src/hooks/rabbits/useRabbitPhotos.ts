'use client';

import { useState } from 'react';

import {
  deleteRabbitPhoto,
  setRabbitPrimaryPhoto,
  uploadRabbitPhoto,
} from '@/lib/rabbits/rabbit-photo-api';

export function useRabbitPhotos(
  rabbitId: string,
  onChanged?: () => Promise<void> | void,
) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [settingPrimary, setSettingPrimary] = useState(false);

  const uploadPhoto = async (file: File) => {
    setUploading(true);

    try {
      await uploadRabbitPhoto(rabbitId, file);

      await onChanged?.();
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto = async (photoId: string) => {
    setDeleting(true);

    try {
      await deleteRabbitPhoto(
        rabbitId,
        photoId,
      );

      await onChanged?.();
    } finally {
      setDeleting(false);
    }
  };

  const setPrimaryPhoto = async (
    photoId: string,
  ) => {
    setSettingPrimary(true);

    try {
      await setRabbitPrimaryPhoto(
        rabbitId,
        photoId,
      );

      await onChanged?.();
    } finally {
      setSettingPrimary(false);
    }
  };

  return {
    uploadPhoto,
    deletePhoto,
    setPrimaryPhoto,
    uploading,
    deleting,
    settingPrimary,
  };
}