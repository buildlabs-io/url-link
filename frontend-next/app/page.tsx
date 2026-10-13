import { HomeView } from "@/components/pages/home";
import { localeCache } from "@/lib/config";
import { Language } from "@/lib/types";

export const dynamic = "force-static";
export const revalidate = false;

export default async function HomePage() {
  localeCache.set(Language.HE);
  return <HomeView />;
}
