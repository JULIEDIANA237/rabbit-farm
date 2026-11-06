'use client';

import Image from 'next/image';
import { Rabbit as RabbitIcon } from 'lucide-react';

import type { RabbitPhoto } from '@/types/rabbit';

interface RabbitAvatarProps {
  photos?: RabbitPhoto[];
  size?: 'sm' | 'md' | 'lg';
}

export function RabbitAvatar({
  photos,
  size = 'md',
}: RabbitAvatarProps) {
  const primaryPhoto =
    photos?.find(
      (photo) => photo.isPrimary,
    ) ?? photos?.[0];

  const sizeClass = {
    sm: 'h-10 w-10',
    md: 'h-14 w-14',
    lg: 'h-20 w-20',
  }[size];

  if (!primaryPhoto) {
    return (
      <div
        className={`${sizeClass} flex shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600`}
      >
        <RabbitIcon
          size={
            size === 'lg'
              ? 32
              : size === 'md'
                ? 24
                : 18
          }
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} relative shrink-0 overflow-hidden rounded-2xl bg-slate-100`}
    >
      <Image
        src={primaryPhoto.url}
        alt="Photo du lapin"
        fill
        className="object-cover"
        unoptimized
      />
    </div>
  );
}