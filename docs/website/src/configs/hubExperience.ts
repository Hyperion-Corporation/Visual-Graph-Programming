import { ExperienceQuality } from '../enums/GraphEntityKind';

/** Tunables for design-hub panels and island embeds. */
export const HUB_EXPERIENCE = {
  maxDevicePixelRatio: 1.75,
  reducedDevicePixelRatio: 1,
  defaultQuality: ExperienceQuality.Full,
  /** Default iframe height for the Astro layout force-field island. */
  layoutForceFieldHeight: '460px',
  /** Force-field grid resolution for design-hub demos (illustrative only). */
  forceFieldResolution: 14,
  forceFieldSeed: 1540,
} as const;
