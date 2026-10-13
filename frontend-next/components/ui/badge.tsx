import type { ReactNode } from "react";

type Tone = "success" | "danger" | "neutral";

const toneClasses: Record<Tone, string> = {
  success: "bg-success/10 text-success",
  danger: "bg-danger/10 text-danger",
  neutral: "bg-slate-100 text-slate-600",
};

export default function Badge({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-4 py-1.5 text-md font-semibold ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
