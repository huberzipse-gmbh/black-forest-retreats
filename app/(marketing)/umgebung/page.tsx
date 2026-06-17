import type { Metadata } from "next";
import { getStrings } from "@/lib/i18n/server";
import { UmgebungHubView } from "@/components/sections/umgebung/UmgebungHubView";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getStrings();
  return {
    title: "Umgebung · Black Forest Retreats",
    description: t.surroundings.hub.text,
  };
}

export default function UmgebungHubPage() {
  return <UmgebungHubView />;
}
