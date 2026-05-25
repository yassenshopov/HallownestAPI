"use client";

import * as React from "react";
import Image, { type ImageProps } from "next/image";

type WikiImageProps = Omit<ImageProps, "onError"> & {
  /** Optional placeholder rendered in place of the image when load fails. */
  fallback?: React.ReactNode;
};

/**
 * Wraps next/image with a client-side onError fallback. If the wiki URL
 * resolves to a missing-file stub or 404 between cache regenerations, the
 * image is replaced by an unobtrusive placeholder instead of a broken icon.
 */
export function WikiImage({ fallback, alt, ...props }: WikiImageProps) {
  const [errored, setErrored] = React.useState(false);

  if (errored) {
    return (
      <>
        {fallback ?? (
          <div
            aria-hidden="true"
            className="grid h-full w-full place-items-center text-xs text-muted-foreground"
          >
            no image
          </div>
        )}
      </>
    );
  }

  return <Image {...props} alt={alt} onError={() => setErrored(true)} />;
}
