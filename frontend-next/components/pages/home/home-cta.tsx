"use client";
import LoginButtons from "@/components/pages/home/login-buttons";
import ModelFormContainer from "@/components/panel/form";
import { ModelType } from "@/lib/types";

export default function HomeCTAClient() {
  return (
    <div className="flex w-full flex-col gap-5 [&>div]:p-0">
      <ModelFormContainer id="add" model={ModelType.link} />

      <hr className="border-slate-200" />

      <LoginButtons />
    </div>
  );
}
