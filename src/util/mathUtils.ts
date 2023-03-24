export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const clampTo0_1 = (value: number) => clamp(value, 0, 1);

export const clampArray = (arr: number[], min: number, max: number) => arr.map((val) => clamp(val, min, max));

export const clampArrayTo0_1 = (arr: number[]) => clampArray(arr, 0, 1);

export const roundToFixedPrecision = (value: number, decimals: number) => {
  return Math.round((value + Number.EPSILON) * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

export const roundTo2Decimals = (value: number) => roundToFixedPrecision(value, 2);
export const roundTo1Decimals = (value: number) => roundToFixedPrecision(value, 1);

export const roundArrayToPrecision = (arr: number[], decimals: number) =>
  arr.map((val) => roundToFixedPrecision(val, decimals));

export const roundArrayTo1Decimals = (arr: number[]) => roundArrayToPrecision(arr, 1);

export const floor = (value: number, decimals: number) =>
  Math.floor(value * Math.pow(10, decimals)) / Math.pow(10, decimals);

export const floorTo2Decimals = (value: number) => floor(value, 2);

export const closeEnough = (a: number, b: number) => Math.abs(a - b) < 0.001;
