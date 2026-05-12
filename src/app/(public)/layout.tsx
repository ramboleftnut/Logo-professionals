import NavBar from "@/components/sections/NavBar";
import Footer from "@/components/sections/Footer";
import { getTeam } from "@/lib/content";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const team = await getTeam();
  const navTeam = team.map((m) => ({ name: m.name, slug: m.slug }));

  return (
    <>
      <NavBar team={navTeam} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
