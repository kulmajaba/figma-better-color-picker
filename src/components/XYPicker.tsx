import React, { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { useColorSpace } from '../hooks/useColorSpace';

import { ColorConverter, Size, SizeZero, VerticalChangeDirection, XY } from '../types';
import Picker from './Picker';

import './XYPicker.css';

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

interface SVCache {
  [key: number]: ImageData;
}

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
  const [xyDataCache, setXyDataCache] = useState<SVCache>({});

  // Use ref for loading status to make sure it is updated even when the UI thread is blocked
  const svDataCacheLoading = useRef(false);

  const { toSRGB } = useColorSpace();

  const updateXYCache = async () => {
    if (svDataCacheLoading.current) {
      console.log('Cache already updating');
      return;
    }
    console.log('Update XY cache');

    svDataCacheLoading.current = true;
    const svData: SVCache = {};
    firstComponentValues.forEach((val) => {
      svData[val] = createXYData(canvasSize.width, canvasSize.height, val, toSRGB);
    });
    setXyDataCache(svData);
    svDataCacheLoading.current = false;
    console.log('XY cache updated');
  };

  const getXYData = useCallback(
    (width: number, height: number) =>
      xyDataCache[firstComponent] ?? createXYData(width, height, firstComponent, toSRGB),
    [xyDataCache, createXYData, firstComponent]
  );

  useEffect(() => {
    // updateXYCache();
  }, [canvasSize, firstComponentValues]);

  const onSizeChange = useCallback(
    (size: Size) => {
      setCanvasSize(size);
    },
    [setCanvasSize]
  );

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
      {Object.keys(xyDataCache).length === 0 && (
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
