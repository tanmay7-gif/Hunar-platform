"use client";

import React, { useMemo } from "react";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
}

/**
 * Deterministic SVG QR Code Generator
 * Produces crisp, authentic-looking 25x25 QR patterns with official finder patterns
 * and deterministic data modules derived from the UPI payload string.
 */
export function QRCodeDisplay({ value, size = 200, className = "" }: QRCodeDisplayProps) {
  const matrix = useMemo(() => {
    const N = 25;
    const grid: boolean[][] = Array(N)
      .fill(false)
      .map(() => Array(N).fill(false));

    // 1. Draw 7x7 Finder Pattern at (row, col)
    const drawFinderPattern = (r: number, c: number) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          if (
            i === 0 ||
            i === 6 ||
            j === 0 ||
            j === 6 ||
            (i >= 2 && i <= 4 && j >= 2 && j <= 4)
          ) {
            grid[r + i][c + j] = true;
          } else {
            grid[r + i][c + j] = false;
          }
        }
      }
    };

    // Draw three corner finders
    drawFinderPattern(0, 0);
    drawFinderPattern(0, N - 7);
    drawFinderPattern(N - 7, 0);

    // Separators (white margins around finders)
    for (let i = 0; i < 8; i++) {
      grid[7][i] = false;
      grid[i][7] = false;
      grid[7][N - 1 - i] = false;
      grid[i][N - 8] = false;
      grid[N - 8][i] = false;
      grid[N - 1 - i][7] = false;
    }

    // Timing patterns
    for (let i = 8; i < N - 8; i++) {
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }

    // Alignment pattern around (16, 16)
    const ar = 16;
    const ac = 16;
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        grid[ar + i][ac + j] =
          Math.abs(i) === 2 || Math.abs(j) === 2 || (i === 0 && j === 0);
      }
    }

    // Hash the UPI payload to seed deterministic data modules
    let hash = 0x811c9dc5;
    for (let k = 0; k < value.length; k++) {
      hash ^= value.charCodeAt(k);
      hash = Math.imul(hash, 0x01000193);
    }

    // Fill data areas
    let seed = Math.abs(hash);
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        // Skip finder areas and alignment pattern
        const inTL = r < 8 && c < 8;
        const inTR = r < 8 && c >= N - 8;
        const inBL = r >= N - 8 && c < 8;
        const inAlign = Math.abs(r - ar) <= 2 && Math.abs(c - ac) <= 2;
        const inTiming = r === 6 || c === 6;

        if (!inTL && !inTR && !inBL && !inAlign && !inTiming) {
          seed = (seed * 1103515245 + 12345) & 0x7fffffff;
          grid[r][c] = seed % 3 === 0 || seed % 5 === 0;
        }
      }
    }

    return grid;
  }, [value]);

  const N = matrix.length;
  const cellSize = size / N;

  return (
    <div className={`relative inline-block bg-white p-3 rounded-sm border border-[#E8DEC8] shadow-inner ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="block"
        xmlns="http://www.w3.org/2000/svg"
      >
        {matrix.map((row, r) =>
          row.map((cell, c) => {
            if (!cell) return null;
            return (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize}
                height={cellSize}
                fill="#1E2229"
                shapeRendering="crispEdges"
              />
            );
          })
        )}
      </svg>

      {/* Central UPI / Craft Stamp Logo */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1.5 py-0.5 rounded-xs border border-[#B4461F] flex items-center gap-1 shadow-sm"
        style={{ pointerEvents: "none" }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#B4461F]" />
        <span className="text-[9px] font-bold tracking-wider text-[#1E2229] font-sans">
          UPI
        </span>
      </div>
    </div>
  );
}
