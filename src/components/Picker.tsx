import React, { MouseEventHandler, useEffect, useRef } from 'react';
import PickerCanvas from './PickerCanvas';
import PickerBall from './PickerBall';
import { HorizontalChangeDirection, ImageDataCreator, VerticalChangeDirection, XY, XYChangeHandler } from '../types';
import { clampTo0_1 } from '../util/mathUtils';

interface Props {
  createData: ImageDataCreator;
  value: XY;
  globalValue: XY;
  dragging: boolean;
  onChange: XYChangeHandler;
  onMouseDown: MouseEventHandler<HTMLElement>;
  horizontalChangeDirection?: HorizontalChangeDirection;
  verticalChangeDirection?: VerticalChangeDirection;
}

const Picker: React.FC<Props> = ({
  createData,
  value,
  globalValue,
  dragging,
  onChange,
  onMouseDown,
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

        const newVal = { x: scaledX, y: scaledY };
        // console.log(`Picker value change x: ${newVal.x} (${x}), y: ${newVal.y} (${y})`);
        onChange(newVal);
      }
    }
  }, [globalValue, dragging]);

  return (
    <>
      <PickerCanvas ref={canvasRef} createData={createData} onMouseDown={onMouseDown} />
      <PickerBall value={value} />
    </>
  );
};

export default Picker;
