"use client";

import { Loader2 } from "lucide-react";
import { forwardRef } from "react";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "solid" | "outline" | "ghost" | "danger";
type Size = "sm" | "md";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variantClasses: Record<Variant, string> = {
  solid: "bg-accent text-white hover:bg-accent/90",
  outline:
    "border-2 border-slate-300 bg-white text-text hover:border-accent hover:text-accent",
  ghost: "bg-slate-100 text-text hover:bg-slate-200",
  danger: "bg-danger text-white hover:bg-danger/90",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-11 px-5 text-sm",
};

export const buttonClassName = (opts: {
  variant?: Variant;
  size?: Size;
  className?: string;
}) =>
  [
    "cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
    focusRing,
    variantClasses[opts.variant ?? "solid"],
    sizeClasses[opts.size ?? "md"],
    opts.className ?? "",
  ].join(" ");

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      size,
      loading = false,
      icon,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={buttonClassName({ variant, size, className })}
      {...props}
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : icon}
      {children}
    </button>
  ),
);
Button.displayName = "Button";

type IconVariant = "default" | "accent" | "success" | "danger";
type IconSize = "sm" | "md" | "lg";

const iconVariantClasses: Record<IconVariant, string> = {
  default: "text-slate-500 hover:bg-slate-100 hover:text-text",
  accent: "text-accent hover:bg-accent/10",
  success: "text-success hover:bg-success/10",
  danger: "text-danger hover:bg-danger/10",
};

const iconSizeClasses: Record<IconSize, string> = {
  sm: "size-8 [&_svg]:size-4",
  md: "size-9 [&_svg]:size-[1.125rem]",
  lg: "size-12 [&_svg]:size-6",
};

export const iconButtonClassName = (opts: {
  variant?: IconVariant;
  size?: IconSize;
  className?: string;
}) =>
  [
    "cursor-pointer inline-flex shrink-0 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50",
    focusRing,
    iconVariantClasses[opts.variant ?? "default"],
    iconSizeClasses[opts.size ?? "md"],
    opts.className ?? "",
  ].join(" ");

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconVariant;
  size?: IconSize;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant, size, className, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={iconButtonClassName({ variant, size, className })}
      {...props}
    />
  ),
);
IconButton.displayName = "IconButton";
