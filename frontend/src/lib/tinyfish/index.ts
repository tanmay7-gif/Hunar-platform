/**
 * TinyFish Core Engine
 * Reactive client-side/edge data & indexing engine for the Hunar platform.
 */

export * from "./types";
export * from "./engine";
export * from "./matchScorer";
export * from "./hooks";
export * from "./client";

// Default export of the singleton
export { tinyFish as default } from "./engine";

