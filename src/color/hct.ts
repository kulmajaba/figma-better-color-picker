import { Hct } from '@material/material-color-utilities';

import { Color } from '../types';

const argbToComponents = (argb: number): Color => {
  return [(argb >> 16) & 0xff, (argb >> 8) & 0xff, argb & 0xff];
};

const floatComponentsToArgb = (components: Color): number => {
  return ((components[0] * 255) << 16) | ((components[1] * 255) << 8) | (components[2] * 255);
};

export const hct_to_srgb = (hct: Color): Color => {
  const color = Hct.from(hct[0] * 360, hct[1] * 100, hct[2] * 100).toInt();
  return argbToComponents(color);
};

export const srgb_to_hct = (srgb: Color): Color => {
  const color = Hct.fromInt(floatComponentsToArgb(srgb));
  return [color.hue / 360, color.chroma / 100, color.tone / 100];
};
