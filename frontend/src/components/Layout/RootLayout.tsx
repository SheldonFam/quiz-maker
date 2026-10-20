import { Outlet } from "@tanstack/react-router";

import { TopBar } from "@/components/Layout/TopBar";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <TopBar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
