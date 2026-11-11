import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { describeNetworkError } from '../common/utils/network-error.js';

@Injectable()
export class SupabaseStorageService {
  private readonly supabase: SupabaseClient;

  private readonly bucket: string;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    this.bucket =
      process.env.SUPABASE_RABBIT_PHOTOS_BUCKET ??
      'rabbit-photos';

    if (!url) {
      throw new Error(
        'SUPABASE_URL is not configured',
      );
    }

    if (!serviceRoleKey) {
      throw new Error(
        'SUPABASE_SERVICE_ROLE_KEY is not configured',
      );
    }

    if (serviceRoleKey.startsWith('sb_publishable_')) {
      throw new Error(
        'SUPABASE_SERVICE_ROLE_KEY must be a server-side secret key; publishable keys cannot bypass Storage RLS.',
      );
    }

    if (serviceRoleKey.startsWith('eyJ')) {
      let role: string | undefined;

      try {
        const payload = serviceRoleKey.split('.')[1];
        role = payload
          ? JSON.parse(
              Buffer.from(payload, 'base64url').toString('utf8'),
            ).role
          : undefined;
      } catch {
        throw new Error(
          'SUPABASE_SERVICE_ROLE_KEY must be a valid service_role JWT or Supabase secret key.',
        );
      }

      if (role !== 'service_role') {
        throw new Error(
          'SUPABASE_SERVICE_ROLE_KEY must have the service_role role; the configured JWT is not privileged for Storage uploads.',
        );
      }
    } else if (!serviceRoleKey.startsWith('sb_secret_')) {
      throw new Error(
        'SUPABASE_SERVICE_ROLE_KEY must be a Supabase secret key or a service_role JWT.',
      );
    }

    this.supabase = createClient(
      url,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }

  async uploadRabbitPhoto(
    file: Express.Multer.File,
    farmId: string,
    rabbitId: string,
  ) {
    if (!file) {
      throw new InternalServerErrorException(
        'Aucun fichier reçu',
      );
    }

    const extension =
      this.getExtension(file.mimetype);

    const fileName =
      `${crypto.randomUUID()}.${extension}`;

    const filePath =
      `farms/${farmId}/rabbits/${rabbitId}/${fileName}`;

    const { error } =
      await this.supabase.storage
        .from(this.bucket)
        .upload(
          filePath,
          file.buffer,
          {
            contentType: file.mimetype,
            cacheControl: '31536000',
            upsert: false,
          },
        );

    if (error) {
      console.error(
        '[SUPABASE] Upload error:',
        error,
      );

      // « fetch failed » ne dit rien : on remonte la vraie cause réseau.
      const reason =
        error.message === 'fetch failed' || error.name === 'StorageUnknownError'
          ? describeNetworkError(error)
          : error.message;

      throw new InternalServerErrorException(
        `Impossible d'uploader la photo : ${reason}`,
      );
    }

    const {
      data: publicUrlData,
    } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(filePath);

    return {
      path: filePath,
      url: publicUrlData.publicUrl,
    };
  }

  async deleteFile(
    filePath: string,
  ): Promise<void> {
    const { error } =
      await this.supabase.storage
        .from(this.bucket)
        .remove([filePath]);

    if (error) {
      console.error(
        '[SUPABASE] Delete error:',
        error,
      );

      throw new InternalServerErrorException(
        `Impossible de supprimer la photo : ${error.message}`,
      );
    }
  }

  private getExtension(
    mimeType: string,
  ): string {
    switch (mimeType) {
      case 'image/jpeg':
        return 'jpg';

      case 'image/png':
        return 'png';

      case 'image/webp':
        return 'webp';

      case 'image/heic':
        return 'heic';

      case 'image/heif':
        return 'heif';

      default:
        return 'jpg';
    }
  }
}