"use client";

import { Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { memo, useEffect, useRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import Dialog from "@/components/ui/dialog";
import { ModelType } from "@/lib/types";

export const DeleteConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}) => {
  const t = useTranslations();

  return (
    <Dialog open={open} onClose={onClose}>
      <h2 className="text-lg font-bold text-text">
        {t("delete.title", { title })}
      </h2>

      <div className="mt-2 text-sm text-slate-600">
        {t("delete.description")}

        <p className="mt-2 font-medium text-danger">
          {t("delete.cascadeWarning")}
        </p>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onClose}>
          {t("delete.cancel")}
        </Button>

        <Button
          variant="danger"
          size="sm"
          onClick={onConfirm}
          data-testid="confirm-delete-button"
        >
          {t("delete.confirm")}
        </Button>
      </div>
    </Dialog>
  );
};

const FormFieldErrorBase = ({ fieldError }: { fieldError: string }) => {
  const t = useTranslations();
  const lastShown = useRef<string>("");
  const isUnique = fieldError.includes("unique:");

  useEffect(() => {
    if (!fieldError || fieldError === lastShown.current) return;
    lastShown.current = fieldError;

    toast.error(t("form.error.general"), {
      description: isUnique ? t("form.error.unique") : t(fieldError),
    });
  }, [fieldError, isUnique, t]);

  if (!fieldError) return null;

  return (
    <p className="text-center text-xl font-bold text-danger">
      {isUnique ? t("form.error.unique") : t(fieldError)}
    </p>
  );
};

export const FormFieldError = memo(FormFieldErrorBase);

export const HomeButtonClient = () => {
  const router = useRouter();
  const t = useTranslations();

  return (
    <div className="my-1 flex items-center justify-center">
      <Button
        variant="outline"
        size="sm"
        icon={<Home className="size-4" />}
        onClick={() =>
          router.push(
            localStorage.getItem("token") ? `/panel/${ModelType.link}` : "/",
          )
        }
      >
        {t("button.home")}
      </Button>
    </div>
  );
};
