import type { ComponentProps } from "react";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

function BackLinkAnchor({ children, ...props }: ComponentProps<"a">) {
  return (
    <a
      {...props}
      className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-foreground"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      {children}
    </a>
  );
}

const CreatedBackLink = createLink(BackLinkAnchor);

export const BackLink: LinkComponent<typeof BackLinkAnchor> = (props) => {
  return <CreatedBackLink {...props} />;
};
