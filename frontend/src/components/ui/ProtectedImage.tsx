"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1561055657-b9e0bf0fa360?w=800&auto=format&fit=crop&q=80";

export interface ProtectedImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "draggable" | "onContextMenu" | "src"> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  wrapperClassName?: string;
  shieldClassName?: string;
  fill?: boolean;
  priority?: boolean;
  quality?: number | `${number}`;
  unoptimized?: boolean;
  useNextImage?: boolean;
  width?: number;
  height?: number;
}

/**
 * ProtectedImage: Dual-layer client-side asset theft deterrence component.
 * Combines underlying disabled pointer-events/drag-disabled media with an absolute
 * transparent drag-shield overlay that captures drag and right-click interactions.
 * Also includes automatic fallback protection if an external CDN image fails or 404s.
 */
export function ProtectedImage({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK_IMAGE,
  wrapperClassName = "",
  shieldClassName = "",
  className = "",
  fill,
  priority,
  quality,
  unoptimized = true,
  useNextImage,
  width,
  height,
  ...rest
}: ProtectedImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  const shouldRenderNextImage =
    useNextImage ?? (fill || (width !== undefined && height !== undefined));

  return (
    <div
      className={`relative select-none overflow-hidden ${wrapperClassName}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* 1. Underlying Media Component */}
      {shouldRenderNextImage ? (
        <Image
          src={imgSrc}
          alt={alt}
          fill={fill}
          width={width}
          height={height}
          priority={priority}
          quality={quality}
          unoptimized={unoptimized}
          className={`pointer-events-none select-none ${className}`}
          draggable={false}
          onError={handleError}
          {...rest}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgSrc}
          alt={alt}
          width={width}
          height={height}
          className={`pointer-events-none select-none ${className}`}
          draggable={false}
          onError={handleError}
          {...rest}
        />
      )}

      {/* 2. Transparent Drag Shield Overlay */}
      <div
        className={`absolute inset-0 z-10 bg-transparent select-none cursor-default ${shieldClassName}`}
        aria-hidden="true"
        draggable={true}
        onDragStart={(e) => {
          // Allow dragging the transparent overlay as a dummy target,
          // ensuring the real image underneath is never grabbed or downloaded.
          e.dataTransfer.setData("text/plain", "");
        }}
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
}
