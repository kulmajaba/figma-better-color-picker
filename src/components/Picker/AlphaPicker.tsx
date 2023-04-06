import { FC, useCallback } from 'react';

import { useColorSpace } from '../../hooks/useColorSpace';
import { createAlphaData, createCheckerData, createOverlay } from '../../util/imageData';

import Picker from './Picker';
import PickerCanvas from './PickerCanvas';

import { Color, ColorConverter, Direction, MouseOrTouchEventHandler, XY } from '../../types';

import './AlphaPicker.css';

const createHorizontalAlphaData = (width: number, height: number, toSRGB: ColorConverter, color: Color) =>
  createAlphaData(width, height, toSRGB, color, Direction.Horizontal);

const getDisabledOverlayData = (width: number, height: number) => createOverlay(width, height, [128, 128, 128], 0.5);

interface Props {
  color: Color;
  value: number;
  globalValue: XY;
  dragging: boolean;
  onChange: (val: number) => void;
  onMouseDownOrTouchStart: MouseOrTouchEventHandler;
  enabled?: boolean;
}

const AlphaPicker: FC<Props> = ({ color, value, onChange, ...otherProps }) => {
  const { toSRGB } = useColorSpace();
  const pickerValue = { x: value, y: 0.5 };

  const getAlphaData = useCallback(
    (width: number, height: number) => createHorizontalAlphaData(width, height, toSRGB, color),
    [toSRGB, color]
  );

  return (
    <div className="AlphaPicker">
      <PickerCanvas getImageData={createCheckerData} />
      <Picker
        getImageData={getAlphaData}
        value={pickerValue}
        onChange={(val) => onChange(val.x)}
        getDisabledOverlayData={getDisabledOverlayData}
        {...otherProps}
      />
    </div>
  );
};

export default AlphaPicker;
