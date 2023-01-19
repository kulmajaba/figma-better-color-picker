import React, { MouseEventHandler, useCallback, useEffect, useState } from 'react';

import { useColorSpace } from '../hooks/useColorSpace';
import useWebWorker from '../hooks/useWebWorker';
import {
  ImageDataCache,
  ImageDataWorkerMessage,
  Size,
  SizeZero,
  ToSRGBFuncName,
  VerticalChangeDirection,
  WorkerStatus,
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

const XYPicker: React.FC<Props> = ({ firstComponentValues, firstComponent, value, onChange, ...otherProps }) => {
  const [canvasSize, setCanvasSize] = useState<Size>(SizeZero);
  const [xyDataCache, setXyDataCache] = useState<ImageDataCache>({});

  const { toSRGB } = useColorSpace();
  const { status, job } = useWebWorker<ImageDataWorkerMessage, ImageDataCache>({
    worker: new URL('../util/imageDataWorker.ts', import.meta.url),
    workerOptions: { type: 'module' },
    terminateOnNewJob: true
  });

  const updateXYCache = useCallback(async () => {
    if (firstComponentValues.length === 0) {
      console.log('No first component values given');
      return;
    }

    console.log('Update XY cache');
    setXyDataCache({});

    const message: ImageDataWorkerMessage = {
      width: canvasSize.width,
      height: canvasSize.height,
      firstComponentValues,
      toSRGBFuncName: toSRGB.name as ToSRGBFuncName
    };
    try {
      const cache = await job(message);
      setXyDataCache(cache);
    } catch (e) {
      console.log(e);
    }
  }, [toSRGB, firstComponentValues]);

  useEffect(() => {
    updateXYCache();
  }, [canvasSize, firstComponentValues, toSRGB]);

  const getXYData = useCallback(
    (width: number, height: number) =>
      xyDataCache[firstComponent] ?? createXYData(width, height, firstComponent, toSRGB),
    [xyDataCache, firstComponent, toSRGB]
  );

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
      {status !== WorkerStatus.Idle && (
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
