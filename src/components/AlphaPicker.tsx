import React, { MouseEventHandler } from 'react';
import { Direction, XY } from '../types';
import Picker from './Picker';
import PickerCanvas from './PickerCanvas';
import { createCheckerData } from '../util/imageData';

import './AlphaPicker.css';

const createAlphaData = (width: number, height: number, color: RGB, direction: Direction) => {
  const [sliderLength, sliderWidth] = direction === Direction.Horizontal ? [width, height] : [height, width];

  const data = new Uint8ClampedArray(sliderLength * sliderWidth * 4);

  for (let i = 0; i < sliderLength; i++) {
    const alpha = Math.round((i / sliderLength) * 255);
    for (let j = 0; j < sliderWidth; j++) {
      const index = direction === Direction.Horizontal ? (j * sliderLength + i) * 4 : (i * sliderWidth + j) * 4;

      data[index + 0] = color.r;
      data[index + 1] = color.g;
      data[index + 2] = color.b;
      data[index + 3] = alpha;
    }
  }

  return new ImageData(data, width);
};

const createHorizontalAlphaData = (width: number, height: number, color: RGB) =>
  createAlphaData(width, height, color, Direction.Horizontal);

interface Props {
  color: RGB;
  value: number;
  globalValue: XY;
  dragging: boolean;
  onChange: (val: number) => void;
  onMouseDown: MouseEventHandler<HTMLElement>;
}

const AlphaPicker: React.FC<Props> = ({ color, value, onChange, ...otherProps }) => {
  const pickerValue = { x: value, y: 0.5 };
  return (
    <div className="alpha-container">
      <PickerCanvas getImageData={(width, height) => createCheckerData(width, height)} />
      <Picker
        getImageData={(width, height) => createHorizontalAlphaData(width, height, color)}
        value={pickerValue}
        onChange={(val) => onChange(val.x)}
        {...otherProps}
      />
    </div>
  );
};

export default AlphaPicker;
