import type { Metadata } from "next";
import SidebarWrapper from "@/components/SidebarWrapper";

export const metadata: Metadata = {
  title: "Portal Socio | Mi Padre Hurtado",
  description: "Gestión de beneficios para comercios adheridos",
};

export default function SocioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarWrapper>
      {children}
    </SidebarWrapper>
  );
}
