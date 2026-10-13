import "@/lib/assets/styles/globals.css";
import { Assistant, IBM_Plex_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { Toaster } from "sonner";

import Footer from "@/components/layout/footer";
import LayoutHead from "@/components/layout/head";
import { AccessibilityBar } from "@/components/shared/wrappers";
import { localeCache } from "@/lib/config";
import IntProvider from "@/lib/provider/IntProvider";
import { Language } from "@/lib/types";
import { generateMetadataLayout } from "@/lib/utils/seo";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

const assistant = Assistant({
  subsets: ["latin", "hebrew"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-assistant",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-code",
  display: "swap",
});

async function initLocale(): Promise<void> {
  const local = (await cookies()).get("NEXT_LOCALE")?.value as
    Language | undefined;

  if (local && Object.values(Language).includes(local)) {
    localeCache.set(local);
  }
}

export async function generateMetadata(): Promise<Metadata> {
  await initLocale();

  const t = await getTranslations("home.seo");

  return generateMetadataLayout({
    title: t("title"),
    description: t("description"),
    locale: t("lang"),
  });
}
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  await initLocale();

  return (
    <html
      lang={localeCache.get()}
      dir={localeCache.dir()}
      className={`${assistant.variable} ${plexMono.variable}`}
    >
      <head>
        <LayoutHead />
      </head>

      <body suppressHydrationWarning className="bg-bg text-text">
        <IntProvider>
          <div
            id="font-scale-wrapper"
            className="mx-auto flex min-h-screen max-w-[90rem] flex-col overflow-x-clip bg-bg text-text"
          >
            <main className="grow">{children}</main>

            <Footer />

            <Toaster richColors closeButton position="bottom-center" />

            <AccessibilityBar />
          </div>
        </IntProvider>
      </body>
    </html>
  );
}
