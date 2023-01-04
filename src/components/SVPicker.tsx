import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';

import { okhsv_to_srgb } from '../util/colorconversion';
import { Size, SizeZero, VerticalChangeDirection, XY } from '../types';
import Picker from './Picker';

import './SVPicker.css';

const createSVData = (width: number, height: number, hue: number) => {
  const data = new Uint8ClampedArray(width * height * 4);

  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const index = (j * width + i) * 4;
      const rgb = okhsv_to_srgb({ h: hue, s: i / width, v: 1 - j / height });
      data[index + 0] = rgb.r;
      data[index + 1] = rgb.g;
      data[index + 2] = rgb.b;
      data[index + 3] = 255;
    }
  }

  return new ImageData(data, width);
};

interface SVCache {
  [key: number]: ImageData;
}

interface Props {
  hue: number;
  hueValues: number[];
  value: XY;
  globalValue: XY;
  dragging: boolean;
  onChange: (val: XY) => void;
  onMouseDown: MouseEventHandler<HTMLElement>;
}

const SVPicker: React.FC<Props> = ({ hue, hueValues, value, onChange, ...otherProps }) => {
  const [canvasSize, setCanvasSize] = useState<Size>(SizeZero);
  const [svDataCache, setSvDataCache] = useState<SVCache>({});

  // Use ref for loading status to make sure it is updated even when the UI thread is blocked
  const svDataCacheLoading = useRef(false);

  const updateSVCache = async () => {
    if (svDataCacheLoading.current) {
      console.log('Cache already updating');
      return;
    }
    console.log('Update SV cache');

    svDataCacheLoading.current = true;
    const svData: SVCache = {};
    hueValues.forEach((hue) => {
      svData[hue] = createSVData(canvasSize.width, canvasSize.height, hue);
    });
    setSvDataCache(svData);
    svDataCacheLoading.current = false;
    console.log('SV cache updated');
  };

  const getSVData = (width: number, height: number) => {
    return svDataCache[hue] ?? createSVData(width, height, hue);
  };

  useEffect(() => {
    updateSVCache();
  }, [canvasSize, hueValues]);

  const onSizeChange = (size: Size) => {
    setCanvasSize(size);
  };

  return (
    <div className="sv-container">
      <Picker
        getImageData={getSVData}
        verticalChangeDirection={VerticalChangeDirection.BottomToTop}
        value={value}
        onChange={onChange}
        onSizeChange={onSizeChange}
        {...otherProps}
      />
      {Object.keys(svDataCache).length === 0 && (
        <div className="sv-loading-indicator">
          <p className="sv-loading-indicator-text">Loading</p>
        </div>
      )}
    </div>
  );
};

export default SVPicker;
