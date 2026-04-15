import "./dashboard.css";
import { Manrope, Inter } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--dash-font-primary",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--dash-font-secondary",
  weight: ["400", "500", "600"],
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`dash-page ${manrope.variable} ${inter.variable}`}>
      {children}
    </div>
  );
}
