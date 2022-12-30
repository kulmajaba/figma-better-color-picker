import React, { MouseEventHandler } from 'react';
import { okhsv_to_srgb } from '../util/colorconversion';
import { Direction, HorizontalChangeDirection, XY } from '../types';
import Picker from './Picker';

import './HuePicker.css';

const createHueData = (width: number, height: number, direction: Direction) => {
  const [sliderLength, sliderWidth] = direction === Direction.Horizontal ? [width, height] : [height, width];

  const data = new Uint8ClampedArray(sliderLength * sliderWidth * 4);

  for (let i = 0; i < sliderLength; i++) {
    const rgb = okhsv_to_srgb({ h: i / sliderLength, s: 0.9, v: 0.9 });

    for (let j = 0; j < sliderWidth; j++) {
      const index = direction === Direction.Horizontal ? (j * sliderLength + i) * 4 : (i * sliderWidth + j) * 4;
      data[index + 0] = rgb.r;
      data[index + 1] = rgb.g;
      data[index + 2] = rgb.b;
      data[index + 3] = 255;
    }
  }

  return new ImageData(data, width);
};

const createHorizontalHueData = (width: number, height: number) => createHueData(width, height, Direction.Horizontal);

interface Props {
  value: number;
  globalValue: XY;
  dragging: boolean;
  onChange: (val: number) => void;
  onMouseDown: MouseEventHandler<HTMLElement>;
}

const HuePicker: React.FC<Props> = ({ value, onChange, ...otherProps }) => {
  const pickerValue = { x: value, y: 0.5 };
  return (
    <div className="hue-container">
      <Picker
        createData={createHorizontalHueData}
        horizontalChangeDirection={HorizontalChangeDirection.RightToLeft}
        value={pickerValue}
        onChange={(val) => onChange(val.x)}
        {...otherProps}
      />
    </div>
  );
};

export default HuePicker;
