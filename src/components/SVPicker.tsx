import React, { MouseEventHandler } from 'react';
import { okhsv_to_srgb } from '../util/colorconversion';
import { VerticalChangeDirection, XY } from '../types';
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

interface Props {
  hue: number;
  value: XY;
  globalValue: XY;
  dragging: boolean;
  onChange: (val: XY) => void;
  onMouseDown: MouseEventHandler<HTMLElement>;
}

const SVPicker: React.FC<Props> = ({ hue, value, onChange, ...otherProps }) => {
  return (
    <div className="sv-container">
      <Picker
        createData={(width, height) => createSVData(width, height, hue)}
        verticalChangeDirection={VerticalChangeDirection.BottomToTop}
        value={value}
        onChange={(val) => onChange(val)}
        {...otherProps}
      />
    </div>
  );
};

export default SVPicker;
