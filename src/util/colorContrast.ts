import { srgb_transfer_function_inv } from '../color/srgb';

import { Color, ColorConverter } from '../types';

const relativeLuminance = (sRGB: Color) =>
  0.2126 * srgb_transfer_function_inv(sRGB[0] / 255) +
  0.7152 * srgb_transfer_function_inv(sRGB[1] / 255) +
  0.0722 * srgb_transfer_function_inv(sRGB[2] / 255);

const L_MAX = relativeLuminance([255, 255, 255]);

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

  const La = relativeLuminance(toSRGB(a)) / L_MAX + 0.05;
  const Lb = relativeLuminance(toSRGB(b)) / L_MAX + 0.05;

  return La / Lb < 1 ? Lb / La : La / Lb;
};
