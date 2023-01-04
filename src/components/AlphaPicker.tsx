import React, { MouseEventHandler } from 'react';
import { Direction, XY } from '../types';
import Picker from './Picker';

import './AlphaPicker.css';

const createAlphaData = (width: number, height: number, color: RGB, direction: Direction) => {
  const [sliderLength, sliderWidth] = direction === Direction.Horizontal ? [width, height] : [height, width];

  const checkerBoardSize = 3;
  const checkerDouble = checkerBoardSize * 2;
  const checkerColor = 225;
  const defaultColor = 255;

  const data = new Uint8ClampedArray(sliderLength * sliderWidth * 4);

  for (let i = 0; i < sliderLength; i++) {
    for (let j = 0; j < sliderWidth; j++) {
      const index = direction === Direction.Horizontal ? (j * sliderLength + i) * 4 : (i * sliderWidth + j) * 4;
      const alpha = i / sliderLength;
      const checker =
        (i % checkerDouble < checkerBoardSize && j % checkerDouble < checkerBoardSize) ||
        ((i + checkerBoardSize) % checkerDouble < checkerBoardSize &&
          (j + checkerBoardSize) % checkerDouble < checkerBoardSize);
      const bgColor = checker ? checkerColor : defaultColor;

      data[index + 0] = alpha * color.r + (1 - alpha) * bgColor;
      data[index + 1] = alpha * color.g + (1 - alpha) * bgColor;
      data[index + 2] = alpha * color.b + (1 - alpha) * bgColor;
      data[index + 3] = 255;
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
