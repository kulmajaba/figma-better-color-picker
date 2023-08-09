import { srgb_transfer_function_inv } from '../color/srgb';

import { Color, ColorConverter } from '../types';

/**
 * Calculates the luminance (Y or L) for an sRGB color
 * @param sRGB color, values in range 0..255
 */
const luminance = (sRGB: Color) =>
  0.2126 * srgb_transfer_function_inv(sRGB[0] / 255) +
  0.7152 * srgb_transfer_function_inv(sRGB[1] / 255) +
  0.0722 * srgb_transfer_function_inv(sRGB[2] / 255);

const L_MAX = luminance([255, 255, 255]);

/**
 * Returns perceived lightness (L*) for luminance (L or Y)
 * @param L Luminance, in range 0..1
 */
const perceivedLightness = (L: number) => {
  // The CIE standard states 0.008856 but 216/24389 is the intent for 0.008856451679036
  if (L <= 216 / 24389) {
    return L * (24389 / 27); // The CIE standard states 903.3, but 24389/27 is the intent, making 903.296296296296296
  } else {
    return Math.pow(L, 1 / 3) * 116 - 16;
  }
};

export const getPerceivedLightness = (color: Color, toSRGB: ColorConverter) => {
  return perceivedLightness(luminance(toSRGB(color)));
};

/**
 * Calculate the contrast of colours based on WCAG 2.1:
 * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio.
 * The WCAG contrast values should be treated as threshold values,
 * so the result should be floored, not rounded
 */
export const getColorContrast = (a: Color, b: Color, toSRGB: ColorConverter) => {
  if (JSON.stringify(a) === JSON.stringify(b)) {
    return 1;
  }

  const La = luminance(toSRGB(a)) / L_MAX + 0.05;
  const Lb = luminance(toSRGB(b)) / L_MAX + 0.05;

  return La / Lb < 1 ? Lb / La : La / Lb;
};
