export const srgb_transfer_function = (a: number) => {
  return 0.0031308 >= a ? 12.92 * a : 1.055 * Math.pow(a, 0.4166666666666667) - 0.055;
};

export const srgb_transfer_function_inv = (a: number) => {
  return 0.04045 < a ? Math.pow((a + 0.055) / 1.055, 2.4) : a / 12.92;
};
