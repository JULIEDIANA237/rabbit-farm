'use client';

import Image from 'next/image';
import { Rabbit as RabbitIcon } from 'lucide-react';

import type { RabbitPhoto } from '@/types/rabbit';

interface RabbitPhotoProps {
  photo?: RabbitPhoto | null;
  alt?: string;
  size?: number;
  className?: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:3001';

export function RabbitPhoto({
  photo,
  alt = 'Lapin',
  size = 160,
  className = '',
}: RabbitPhotoProps) {
  if (!photo) {
    return (
      <div
        className={`flex items-center justify-center overflow-hidden rounded-2xl bg-emerald-50 text-emerald-600 ${className}`}
        style={{
          width: size,
          height: size,
        }}
      >
        <RabbitIcon size={size * 0.35} />
      </div>
    );
  }

  const src = photo.url.startsWith('http')
    ? photo.url
    : `${API_URL}${photo.url}`;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-slate-100 ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${size}px`}
        className="object-cover"
      />
    </div>
  );
}