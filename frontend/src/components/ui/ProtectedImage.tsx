"use client";

import React from "react";
import Image, { ImageProps } from "next/image";

export interface ProtectedImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "draggable" | "onContextMenu" | "src"> {
  src: string;
  alt: string;
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
 */
export function ProtectedImage({
  src,
  alt,
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
          src={src}
          alt={alt}
          fill={fill}
          width={width}
          height={height}
          priority={priority}
          quality={quality}
          unoptimized={unoptimized}
          className={`pointer-events-none select-none ${className}`}
          draggable={false}
          {...rest}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`pointer-events-none select-none ${className}`}
          draggable={false}
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
