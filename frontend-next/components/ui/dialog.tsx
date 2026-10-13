"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { useClickOutside } from "@/lib/utils/hooks";

import type { ReactNode } from "react";

export default function Dialog({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useClickOutside([panelRef], onClose, open);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className="surface w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
