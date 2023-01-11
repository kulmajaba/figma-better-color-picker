import { ImageDataCache, ImageDataWorkerMessage } from '../types';
import * as colorSpace from '../color';
import { createXYData } from './imageData';

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
