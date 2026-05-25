import * as React from "react";

import { cn } from "@/lib/utils";

export function HollowMark({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("inline-block", className)}
      {...props}
    >
      <path d="M12 2 L8 8 H6 L4 14 L8 22 H16 L20 14 L18 8 H16 Z" />
      <path d="M9 11.5 L9 14" />
      <path d="M15 11.5 L15 14" />
      <path d="M12 4 L12 7" />
    </svg>
  );
}
