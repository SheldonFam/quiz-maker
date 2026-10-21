import { Outlet } from "@tanstack/react-router";

import { TopBar } from "@/components/Layout/TopBar";
import { Toaster } from "@/components/ui/toast";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <main className="mx-auto max-w-5xl px-4 pt-6 pb-16 sm:pt-10 print:max-w-none print:p-0">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
