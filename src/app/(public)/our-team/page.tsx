import { getTeam } from "@/lib/content";
import OurTeamPage from "@/featured/OurTeamPage";

export const metadata = {
  title: "Our Team | Digital Nectar",
  description: "Meet the hummingbirds behind Digital Nectar — designers, developers, and branding specialists with 15+ years of real experience.",
};

export default async function OurTeamRoute() {
  const team = await getTeam();
  return <OurTeamPage team={team} />;
}
