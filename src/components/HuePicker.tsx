import React, { useState } from 'react';
import { okhsv_to_srgb } from '../util/colorconversion';
import PickerCanvas from './PickerCanvas';

import './HuePicker.css';
import PickerBall from './PickerBall';
import { XY } from '../types';

enum Direction {
  Horizontal = 'HORIZONTAL',
  Vertical = 'VERTICAL'
}

const createHueSliderData = (width: number, height: number, direction: Direction) => {
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

const HuePicker = () => {
  const [value, setValue] = useState({ x: 0, y: 0.5 });

  const onChange = (val: XY) => {
    setValue({ x: val.x, y: 0.5 });
  };

  return (
    <div className="hue-container">
      <PickerBall value={value} />
      <PickerCanvas
        createData={(width, height) => createHueSliderData(width, height, Direction.Horizontal)}
        onChange={onChange}
      />
    </div>
  );
};

export default HuePicker;
