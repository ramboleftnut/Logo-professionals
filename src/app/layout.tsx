import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://digitalnectar.space"),
  title: "Digital Nectar | Creative & Tech Studio",
  description:
    "Digital Nectar is a creative and technology studio specialising in brand identity, logo design, UI/UX, and software engineering. Built by freelance veterans with 15+ years of experience.",
  keywords: "logo design, branding, graphic design, UI/UX, web development, digital studio",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={dmSans.variable}>
        <main>{children}</main>
      </body>
    </html>
  );
}
