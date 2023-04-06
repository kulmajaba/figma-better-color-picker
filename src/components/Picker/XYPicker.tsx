import { FC, memo, useCallback, useEffect, useState } from 'react';

import { useColorSpace } from '../../hooks/useColorSpace';
import useWebWorker from '../../hooks/useWebWorker';
import { createXYData } from '../../util/imageData';
import imageDataWorkerUrl from '../../util/imageDataWorker?worker&url';

import Picker from './Picker';

import {
  ImageDataCache,
  ImageDataWorkerMessage,
  MouseOrTouchEventHandler,
  Size,
  SizeZero,
  ToSRGBFuncName,
  VerticalChangeDirection,
  WorkerStatus,
  XY
} from '../../types';

import './XYPicker.css';

interface Props {
  firstComponentValues: number[];
  firstComponent: number;
  value: XY;
  globalValue: XY;
  dragging: boolean;
  onChange: (val: XY) => void;
  onMouseDownOrTouchStart: MouseOrTouchEventHandler;
}

const XYPicker: FC<Props> = ({ firstComponentValues, firstComponent, value, onChange, ...otherProps }) => {
  const [canvasSize, setCanvasSize] = useState<Size>(SizeZero);
  const [xyDataCache, setXyDataCache] = useState<ImageDataCache>({});

  const { toSRGB } = useColorSpace();
  const { status, job } = useWebWorker<ImageDataWorkerMessage, ImageDataCache>({
    worker: imageDataWorkerUrl,
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
      console.error(e);
    }
  }, [firstComponentValues, canvasSize, toSRGB, job]);

  useEffect(() => {
    updateXYCache();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="XYPicker">
      <Picker
        getImageData={getXYData}
        verticalChangeDirection={VerticalChangeDirection.BottomToTop}
        value={value}
        onChange={onChange}
        onSizeChange={onSizeChange}
        {...otherProps}
      />
      {status !== WorkerStatus.Idle && (
        <div className="XYPicker-loadingIndicator">
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
  prevProps.onMouseDownOrTouchStart === nextProps.onMouseDownOrTouchStart;

export default memo(XYPicker, areEqual);
