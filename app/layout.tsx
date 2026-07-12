import type { Metadata } from "next";
import { Playfair_Display, Montserrat, Alex_Brush } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import { CardNav } from "@/components/card-nav";
import { MakerCredit } from "@/components/maker-credit";
import { Curtain } from "@/components/transition/curtain";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});
const alexBrush = Alex_Brush({
  variable: "--font-alex-brush",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Varsheni — Tech UGC Creator",
  description:
    "Honest reviews of the apps and businesses worth your tap, from tech UGC creator Varsheni.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${montserrat.variable} ${alexBrush.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CardNav />
        <SmoothScroll>
          {children}
          <MakerCredit />
        </SmoothScroll>
        <Curtain />
      </body>
    </html>
  );
}
