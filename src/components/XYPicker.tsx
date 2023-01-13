import React, { MouseEventHandler, useCallback, useEffect, useState } from 'react';

import { useColorSpace } from '../hooks/useColorSpace';
import {
  ImageDataCache,
  ImageDataWorkerMessage,
  Size,
  SizeZero,
  ToSRGBFuncName,
  VerticalChangeDirection,
  XY
} from '../types';
import { createXYData } from '../util/imageData';
import Picker from './Picker';

import './XYPicker.css';

interface Props {
  firstComponentValues: number[];
  firstComponent: number;
  value: XY;
  globalValue: XY;
  dragging: boolean;
  onChange: (val: XY) => void;
  onMouseDown: MouseEventHandler<HTMLElement>;
}

const imageDataWorker = new Worker('../util/imageDataWorker.ts', {
  type: 'module'
});

const XYPicker: React.FC<Props> = ({ firstComponentValues, firstComponent, value, onChange, ...otherProps }) => {
  const [canvasSize, setCanvasSize] = useState<Size>(SizeZero);
  const [xyDataCache, setXyDataCache] = useState<ImageDataCache>({});
  const [xyDataCacheLoading, setXyDataCacheLoading] = useState(false);

  const { toSRGB } = useColorSpace();

  const updateXYCache = useCallback(async () => {
    if (xyDataCacheLoading) {
      // TODO: terminate worker job and start a new one
      // Calling imageDataWorker.terminate destroys the worker
      console.log('Cache already updating');
      return;
    }
    if (firstComponentValues.length === 0) {
      console.log('No first component values given');
      return;
    }

    console.log('Update XY cache');

    setXyDataCacheLoading(true);
    setXyDataCache({});
    const message: ImageDataWorkerMessage = {
      width: canvasSize.width,
      height: canvasSize.height,
      firstComponentValues,
      toSRGBFuncName: toSRGB.name as ToSRGBFuncName
    };
    imageDataWorker.postMessage(message);
  }, [toSRGB, firstComponentValues]);

  const getXYData = useCallback(
    (width: number, height: number) =>
      xyDataCache[firstComponent] ?? createXYData(width, height, firstComponent, toSRGB),
    [xyDataCache, firstComponent, toSRGB]
  );

  useEffect(() => {
    updateXYCache();
  }, [canvasSize, firstComponentValues, toSRGB]);

  useEffect(() => {
    imageDataWorker.onmessage = (e: MessageEvent<ImageDataCache>) => {
      if (e && e.data) {
        console.log('XY data received');
        setXyDataCache(e.data);
        setXyDataCacheLoading(false);
      }
    };

    return () => imageDataWorker.terminate();
  }, [imageDataWorker]);

  const onSizeChange = useCallback((size: Size) => {
    setCanvasSize(size);
  }, []);

  return (
    <div className="xy-container">
      <Picker
        getImageData={getXYData}
        verticalChangeDirection={VerticalChangeDirection.BottomToTop}
        value={value}
        onChange={onChange}
        onSizeChange={onSizeChange}
        {...otherProps}
      />
      {xyDataCacheLoading && (
        <div className="xy-loading-indicator">
          <p>Loading</p>
        </div>
      )}
    </div>
  );
};

const areEqual = (prevProps: Props, nextProps: Props) =>
  prevProps.firstComponentValues === nextProps.firstComponentValues &&
  prevProps.firstComponent === nextProps.firstComponent &&
  prevProps.value === nextProps.value &&
  prevProps.dragging === nextProps.dragging &&
  !prevProps.dragging &&
  prevProps.onChange === nextProps.onChange &&
  prevProps.onMouseDown === nextProps.onMouseDown;

export default React.memo(XYPicker, areEqual);
