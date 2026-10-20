import { Outlet } from "@tanstack/react-router";

import { TopBar } from "@/components/Layout/TopBar";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <main className="mx-auto max-w-5xl px-4 pt-6 pb-16 sm:pt-10">
        <Outlet />
      </main>
    </div>
  );
}
