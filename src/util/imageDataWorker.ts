import * as colorSpace from '../color';

import { createXYData } from './imageData';

import { ImageDataCache, ImageDataWorkerMessage } from '../types';

self.onmessage = async (e: MessageEvent<ImageDataWorkerMessage>) => {
  const { width, height, firstComponentValues, toSRGBFuncName } = e.data;
  const xyData: ImageDataCache = {};
  firstComponentValues.forEach((val) => {
    // eslint-disable-next-line import/namespace
    xyData[val] = createXYData(width, height, val, colorSpace[toSRGBFuncName]);
  });
  postMessage(xyData);
};
