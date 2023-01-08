import React, { MouseEventHandler, useCallback } from 'react';
import { useColorSpace } from '../hooks/useColorSpace';
import { Color, Direction, Size, XY } from '../types';
import Picker from './Picker';

import './SliderPicker.css';

const createSliderData = (
  width: number,
  height: number,
  toSRGB: (col: Color) => Color,
  secondComponent: number,
  thirdComponent: number,
  direction: Direction
) => {
  const [sliderLength, sliderWidth] = direction === Direction.Horizontal ? [width, height] : [height, width];

  const data = new Uint8ClampedArray(sliderLength * sliderWidth * 4);

  for (let i = 0; i < sliderLength; i++) {
    const [r, g, b] = toSRGB([i / sliderLength, secondComponent, thirdComponent]);

    for (let j = 0; j < sliderWidth; j++) {
      const index = direction === Direction.Horizontal ? (j * sliderLength + i) * 4 : (i * sliderWidth + j) * 4;
      data[index + 0] = r;
      data[index + 1] = g;
      data[index + 2] = b;
      data[index + 3] = 255;
    }
  }

  return new ImageData(data, width);
};

interface Props {
  value: number;
  globalValue: XY;
  dragging: boolean;
  onChange: (val: number) => void;
  onMouseDown: MouseEventHandler<HTMLElement>;
  onSizeChange: (size: Size) => void;
}

const SliderPicker: React.FC<Props> = ({ value, onChange, ...otherProps }) => {
  const { toSRGB } = useColorSpace();

  const createHorizontalSliderData = useCallback(
    (width: number, height: number) => createSliderData(width, height, toSRGB, 0.9, 0.9, Direction.Horizontal),
    [toSRGB]
  );

  const pickerValue = { x: value, y: 0.5 };
  return (
    <div className="slider-container">
      <Picker
        getImageData={createHorizontalSliderData}
        value={pickerValue}
        onChange={(val) => onChange(val.x)}
        {...otherProps}
      />
    </div>
  );
};

export default SliderPicker;
