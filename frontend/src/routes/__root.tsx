import { createRootRoute } from "@tanstack/react-router";

import { NotFound } from "@/components/Common/NotFound";
import { RootLayout } from "@/components/Layout/RootLayout";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});
