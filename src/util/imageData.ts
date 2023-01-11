import { ColorConverter } from '../types';

export const createXYData = (width: number, height: number, firstComponent: number, toSRGB: ColorConverter) => {
  const data = new Uint8ClampedArray(width * height * 4);

  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const index = (j * width + i) * 4;
      const [r, g, b] = toSRGB([firstComponent, i / width, 1 - j / height]);
      data[index + 0] = r;
      data[index + 1] = g;
      data[index + 2] = b;
      data[index + 3] = 255;
    }
  }

  return new ImageData(data, width);
};

export const createCheckerData = (width: number, height: number) => {
  const checkerBoardSize = 3;
  const checkerDouble = checkerBoardSize * 2;
  // TODO: Use CSS variables
  const checkerColor = 225;
  const defaultColor = 255;

  const data = new Uint8ClampedArray(width * height * 4);

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const index = (j * width + i) * 4;
      const checker =
        (i % checkerDouble < checkerBoardSize && j % checkerDouble < checkerBoardSize) ||
        ((i + checkerBoardSize) % checkerDouble < checkerBoardSize &&
          (j + checkerBoardSize) % checkerDouble < checkerBoardSize);
      const color = checker ? checkerColor : defaultColor;

      data[index + 0] = color;
      data[index + 1] = color;
      data[index + 2] = color;
      data[index + 3] = 255;
    }
  }

  return new ImageData(data, width);
};
