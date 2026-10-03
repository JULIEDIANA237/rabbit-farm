'use client';

import { useEffect, useRef, useState } from 'react';

interface ActionMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

export function ActionMenu({
  onEdit,
  onDelete,
  onView,
}: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-label="Actions"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="
          flex h-9 w-9
          items-center justify-center
          rounded-lg
          text-slate-500
          hover:bg-slate-100
          hover:text-slate-900
          active:bg-slate-200
        "
      >
        <span className="text-xl leading-none">⋮</span>
      </button>

      {open && (
        <div
          className="
            absolute right-0 top-11 z-50
            min-w-40
            overflow-hidden
            rounded-xl
            border border-slate-200
            bg-white
            py-1
            shadow-xl
          "
        >
          {onView && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onView();
              }}
              className="
                block w-full px-4 py-2.5
                text-left text-sm
                hover:bg-slate-50
              "
            >
              Voir
            </button>
          )}

          {onEdit && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
              className="
                block w-full px-4 py-2.5
                text-left text-sm
                hover:bg-slate-50
              "
            >
              Modifier
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onDelete();
              }}
              className="
                block w-full px-4 py-2.5
                text-left text-sm
                text-red-600
                hover:bg-red-50
              "
            >
              Supprimer
            </button>
          )}
        </div>
      )}
    </div>
  );
}