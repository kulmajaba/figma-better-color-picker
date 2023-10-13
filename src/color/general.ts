// Copyright (c) 2021 Björn Ottosson
// Copyright (c) 2022 Mika Kuitunen

import { InvalidArgumentError } from '../util/errors';
import { roundTo2Decimals } from '../util/mathUtils';

import { Color, ColorWithAlpha } from '../types';

/**
 * Convert a HSL/HSV value with ranges 0..360, 0..100, 0..100 to range 0..1
 */
export const hslv_to_hslvfloat = (hslv: Color): Color => [hslv[0] / 360, hslv[1] / 100, hslv[2] / 100];

/**
 * Convert a HSL/HSV value with range 0--100 to ranges 0..360, 0..100, 0..100
 */
export const hslvfloat_to_hslv = (hslv: Color): Color => [hslv[0] * 360, hslv[1] * 100, hslv[2] * 100];

export const rgb_to_hsl = (rgb: Color): Color => {
  let [r, g, b] = rgb;

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h, s, l];
};

export const hsl_to_rgb = (hsl: Color): Color => {
  const [h, s, l] = hsl;

  let r, g, b;

  const hue_to_rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  if (s == 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue_to_rgb(p, q, h + 1 / 3);
    g = hue_to_rgb(p, q, h);
    b = hue_to_rgb(p, q, h - 1 / 3);
  }

  return [r * 255, g * 255, b * 255];
};

export const rgb_to_hsv = (rgb: Color): Color => {
  let [r, g, b] = rgb;

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const v = max;

  const d = max - min;
  const s = max == 0 ? 0 : d / max;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h, s, v];
};

export const hsv_to_rgb = (hsv: Color): Color => {
  const [h, s, v] = hsv;

  let r = 0;
  let g = 0;
  let b = 0;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }

  return [r * 255, g * 255, b * 255];
};

export const hex_to_rgb = (hex: string): Color => {
  if (hex.substring(0, 1) == '#') hex = hex.substring(1);

  if (hex.match(/^([0-9a-f]{3})$/i)) {
    const r = (parseInt(hex.charAt(0), 16) / 15) * 255;
    const g = (parseInt(hex.charAt(1), 16) / 15) * 255;
    const b = (parseInt(hex.charAt(2), 16) / 15) * 255;
    return [r, g, b];
  }
  if (hex.match(/^([0-9a-f]{6})$/i)) {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b];
  }
  if (hex.match(/^([0-9a-f]{1})$/i)) {
    const a = (parseInt(hex.charAt(0), 16) / 15) * 255;
    return [a, a, a];
  }
  if (hex.match(/^([0-9a-f]{2})$/i)) {
    const a = parseInt(hex.substring(0, 2), 16);
    return [a, a, a];
  }

  throw new InvalidArgumentError(`hex_to_rgb: ${hex} does not match a hexadecimal color representation`);
};

const componentToHex = (x: number): string => {
  const hex = Math.round(x).toString(16);
  return hex.length == 1 ? '0' + hex : hex;
};

export const rgb_to_hex = (rgb: Color | ColorWithAlpha): string => {
  const [r, g, b] = rgb;

  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

export const fillHex = (hex: string): string => rgb_to_hex(hex_to_rgb(hex));

export const rgba_to_hex = (rgba: ColorWithAlpha): string => {
  const [r, g, b, a] = rgba;

  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b) + componentToHex(a * 255);
};

export const rgba_to_rgba_string = (rgba: ColorWithAlpha): string => {
  const [r, g, b, a] = rgba;
  return `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)} / ${roundTo2Decimals(a)})`;
};
