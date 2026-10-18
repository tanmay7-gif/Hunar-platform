/**
 * TinyFish Core Engine
 * Reactive client-side/edge data & indexing engine for the Hunar platform.
 */

export * from "./types";
export * from "./engine";
export * from "./matchScorer";
export * from "./hooks";

// Default export of the singleton
export { tinyFish as default } from "./engine";
