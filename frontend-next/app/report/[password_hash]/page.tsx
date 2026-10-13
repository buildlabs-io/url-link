"use client";

import { use } from "react";

import Report from "@/components/pages/report";
import SwrProvider from "@/lib/provider/swrProvider";
export default function ReportPage({
  params,
}: {
  params: Promise<{ password_hash: string }>;
}) {
  const { password_hash } = use(params);
  return (
    <SwrProvider>
      <Report password_hash={password_hash} isPublic />
    </SwrProvider>
  );
}
