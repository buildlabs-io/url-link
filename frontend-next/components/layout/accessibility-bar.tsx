"use client";

import {
  ZoomIn,
  ZoomOut,
  Contrast,
  Eye,
  Link2,
  RotateCcw,
  Barcode,
  Scale,
  PersonStanding,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useRef, type ReactNode } from "react";

import { IconButton } from "@/components/ui/button";
import { localeCache } from "@/lib/config";
import { useClickOutside } from "@/lib/utils/hooks";

export const createAccessibilityButtons = (
  increaseFont: () => void,
  decreaseFont: () => void,
  reset: () => void,
  grayscale: boolean,
  setGrayscale: (v: boolean) => void,
  highContrast: boolean,
  setHighContrast: (v: boolean) => void,
  invert: boolean,
  setInvert: (v: boolean) => void,
  underlineLinks: boolean,
  setUnderlineLinks: (v: boolean) => void,
  readableFont: boolean,
  setReadableFont: (v: boolean) => void,
) => [
  {
    id: "accessibility.zoomIn",
    icon: <ZoomIn className="size-5" />,
    onClick: increaseFont,
  },
  {
    id: "accessibility.zoomOut",
    icon: <ZoomOut className="size-5" />,
    onClick: decreaseFont,
  },
  {
    id: "accessibility.grayscale",
    icon: <Barcode className="size-5" />,
    onClick: () => setGrayscale(!grayscale),
    selected: grayscale,
  },
  {
    id: "accessibility.contrast",
    icon: <Contrast className="size-5" />,
    onClick: () => setHighContrast(!highContrast),
    selected: highContrast,
  },
  {
    id: "accessibility.invert",
    icon: <Eye className="size-5" />,
    onClick: () => setInvert(!invert),
    selected: invert,
  },
  {
    id: "accessibility.underline",
    icon: <Link2 className="size-5" />,
    onClick: () => setUnderlineLinks(!underlineLinks),
    selected: underlineLinks,
  },
  {
    id: "accessibility.readableFont",
    icon: <span className="font-bold">Aa</span>,
    onClick: () => setReadableFont(!readableFont),
    selected: readableFont,
  },
  {
    id: "accessibility.reset",
    icon: <RotateCcw className="size-5" />,
    onClick: reset,
  },
  {
    id: "terms.accessibility.title",
    icon: <Scale className="size-5" />,
    onClick: () =>
      window.open(`/legal/accessibility/${localeCache.get()}`, "_blank"),
  },
];

const ActionItem = ({
  icon,
  labelId,
  onClick,
  selected = false,
}: {
  icon: ReactNode;
  labelId: string;
  onClick: () => void;
  selected?: boolean;
}) => {
  const t = useTranslations();

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className={`flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent/10 ${
        selected ? "bg-accent/10 font-bold" : "font-normal"
      }`}
    >
      <span>{t(labelId)}</span>
      {icon}
    </div>
  );
};

export default function AccessibilityBarClient() {
  const t = useTranslations();

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [invert, setInvert] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [underlineLinks, setUnderlineLinks] = useState(false);
  const [readableFont, setReadableFont] = useState(false);

  useEffect(() => {
    const sizes = Array.from(
      { length: 13 },
      (_, i) => `font-size-${80 + i * 10}`,
    );

    document.documentElement.classList.remove(...sizes);
    document.documentElement.classList.add(`font-size-${fontSize}`);

    document.documentElement.classList.toggle("grayscale", grayscale);
    document.documentElement.classList.toggle("high-contrast", highContrast);
    document.documentElement.classList.toggle("invert", invert);
    document.documentElement.classList.toggle(
      "underline-links",
      underlineLinks,
    );
    document.documentElement.classList.toggle("readable-font", readableFont);
  }, [fontSize, grayscale, highContrast, invert, underlineLinks, readableFont]);

  useClickOutside([buttonRef, panelRef], () => setOpen(false), open);

  const increaseFont = () => {
    if (fontSize < 200) setFontSize(fontSize + 10);
  };

  const decreaseFont = () => {
    if (fontSize > 80) setFontSize(fontSize - 10);
  };

  const reset = () => {
    setFontSize(100);
    setHighContrast(false);
    setInvert(false);
    setGrayscale(false);
    setUnderlineLinks(false);
    setReadableFont(false);
  };

  const accessibility_buttons = createAccessibilityButtons(
    increaseFont,
    decreaseFont,
    reset,
    grayscale,
    setGrayscale,
    highContrast,
    setHighContrast,
    invert,
    setInvert,
    underlineLinks,
    setUnderlineLinks,
    readableFont,
    setReadableFont,
  );

  return (
    <div className="fixed top-[95%] end-[-0.6rem] z-50 flex -translate-y-[93%] items-center">
      <IconButton
        ref={buttonRef}
        size="lg"
        onClick={() => setOpen(!open)}
        aria-label={t("accessibility.title")}
        className="bg-accent text-white hover:bg-accent/90 max-w-8"
      >
        <PersonStanding className="me-1 size-6" />
      </IconButton>

      {open && (
        <div
          ref={panelRef}
          className={`surface ml-2 w-50 rounded-xl border border-slate-200 bg-white p-4 shadow-lg ${
            fontSize > 140 ? "mt-50" : ""
          }`}
        >
          <h2 className="mb-2 text-base font-bold text-text">
            {t("accessibility.title")}
          </h2>

          <div className="flex flex-col gap-1">
            {accessibility_buttons.map(({ id, icon, onClick, selected }) => (
              <ActionItem
                key={id}
                labelId={id}
                icon={icon}
                onClick={onClick}
                selected={selected}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
