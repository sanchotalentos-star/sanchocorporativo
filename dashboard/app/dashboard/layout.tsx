import type { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Dashboard Comercial — Sancho Gestão de Carreiras",
  description: "Acompanhamento de pipeline, metas e KPIs do time comercial da Sancho.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster
        richColors
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "Inter, ui-sans-serif, system-ui",
          },
        }}
      />
    </>
  );
}
