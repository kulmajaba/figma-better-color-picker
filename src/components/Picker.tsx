import React, { useEffect, useRef } from 'react';

import PickerCanvas from './PickerCanvas';
import PickerBall from './PickerBall';
import {
  HorizontalChangeDirection,
  ImageDataCreator,
  MouseOrTouchEventHandler,
  Size,
  VerticalChangeDirection,
  XY,
  XYChangeHandler
} from '../types';
import { clampTo0_1 } from '../util/mathUtils';

interface Props {
  getImageData: ImageDataCreator;
  value: XY;
  globalValue: XY;
  dragging: boolean;
  onChange: XYChangeHandler;
  onMouseDownOrTouchStart: MouseOrTouchEventHandler;
  onSizeChange?: (size: Size) => void;
  enabled?: boolean;
  getDisabledOverlayData?: ImageDataCreator;
  horizontalChangeDirection?: HorizontalChangeDirection;
  verticalChangeDirection?: VerticalChangeDirection;
}

const Picker: React.FC<Props> = ({
  getImageData,
  value,
  globalValue,
  dragging,
  onChange,
  onMouseDownOrTouchStart,
  onSizeChange,
  enabled,
  getDisabledOverlayData,
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

        onChange(newVal);
      }
    }
  }, [globalValue, dragging]);

  if (enabled !== undefined && getDisabledOverlayData === undefined) {
    console.warn('Picker: enabled prop is controlled but no getDisabledOverlayData prop provided');
  }

  if (enabled === false && getDisabledOverlayData !== undefined) {
    return <PickerCanvas getImageData={getDisabledOverlayData} />;
  }

  return (
    <>
      <PickerCanvas
        ref={canvasRef}
        onSizeChange={onSizeChange}
        getImageData={getImageData}
        onMouseDownOrTouchStart={onMouseDownOrTouchStart}
      />
      <PickerBall
        value={value}
        horizontalChangeDirection={horizontalChangeDirection}
        verticalChangeDirection={verticalChangeDirection}
      />
    </>
  );
};

export default Picker;
