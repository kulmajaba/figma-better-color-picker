import React, { MouseEventHandler, useEffect, useRef } from 'react';
import { okhsv_to_srgb } from '../util/colorconversion';
import PickerCanvas from './PickerCanvas';

import './HuePicker.css';
import PickerBall from './PickerBall';
import {
  ChangeDirections,
  Direction,
  HorizontalChangeDirection,
  VerticalChangeDirection,
  XY,
  XYChangeHandler
} from '../types';
import { clampTo0_1 } from '../util/mathUtils';

export const changesHorizontal = (val: ChangeDirections) =>
  val === ChangeDirections.HorizontalAndVertical || val === ChangeDirections.Horizontal;

export const changesVertical = (val: ChangeDirections) =>
  val === ChangeDirections.HorizontalAndVertical || val === ChangeDirections.Vertical;

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

interface Props {
  globalValue: XY;
  value: XY;
  dragging: boolean;
  onChange: XYChangeHandler;
  onMouseDown: MouseEventHandler<HTMLElement>;
  activeDirections?: ChangeDirections;
  horizontalChangeDirection?: HorizontalChangeDirection;
  verticalChangeDirection?: VerticalChangeDirection;
}

const HuePicker: React.FC<Props> = ({
  globalValue,
  value,
  dragging,
  onChange,
  onMouseDown,
  activeDirections = ChangeDirections.HorizontalAndVertical,
  horizontalChangeDirection = HorizontalChangeDirection.LeftToRight,
  verticalChangeDirection = VerticalChangeDirection.TopToBottom
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (dragging) {
      const canvas = canvasRef.current;
      if (canvas) {
        const boundingRect = canvas.getBoundingClientRect();
        const x = globalValue.x - boundingRect.left;
        const y = globalValue.y - boundingRect.top;
        const { width, height } = canvas;
        const scaledX =
          horizontalChangeDirection === HorizontalChangeDirection.LeftToRight
            ? clampTo0_1(x / (width - 1))
            : 1 - clampTo0_1(x / (width - 1));
        const scaledY =
          verticalChangeDirection === VerticalChangeDirection.TopToBottom
            ? clampTo0_1(y / (height - 1))
            : 1 - clampTo0_1(y / (height - 1));

        const newVal = {
          x: changesHorizontal(activeDirections) ? scaledX : 0,
          y: changesVertical(activeDirections) ? scaledY : 0
        };
        console.log(`Picker value change x: ${newVal.x} (${x}), y: ${newVal.y} (${y})`);
        onChange(newVal);
      }
    }
  }, [globalValue, dragging]);

  const valueToBall = {
    x: changesHorizontal(activeDirections) ? value.x : 0.5,
    y: changesVertical(activeDirections) ? value.y : 0.5
  };

  return (
    <div className="hue-container">
      <PickerCanvas
        ref={canvasRef}
        createData={(width, height) => createHueSliderData(width, height, Direction.Horizontal)}
        onMouseDown={onMouseDown}
      />
      <PickerBall value={valueToBall} />
    </div>
  );
};

export default HuePicker;
