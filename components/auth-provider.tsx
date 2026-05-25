import * as React from "react";
import { ClerkProvider } from "@clerk/nextjs";

const clerkPublishable = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (!clerkPublishable) {
    return <>{children}</>;
  }

  return <ClerkProvider publishableKey={clerkPublishable}>{children}</ClerkProvider>;
}

export const isAuthEnabled = Boolean(clerkPublishable);
