import { ColorConverter, ImageDataCache, ImageDataWorkerMessage } from '../types';
import * as colorSpace from '../color';

const createXYData = (width: number, height: number, firstComponent: number, toSRGB: ColorConverter) => {
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

self.onmessage = async (e: MessageEvent<ImageDataWorkerMessage>) => {
  const { width, height, firstComponentValues, toSRGBFuncName } = e.data;
  console.log('Start xy data calc', e.data);
  const xyData: ImageDataCache = {};
  firstComponentValues.forEach((val) => {
    xyData[val] = createXYData(width, height, val, colorSpace[toSRGBFuncName]);
  });
  console.log('xyData calculated');
  postMessage(xyData);
};
