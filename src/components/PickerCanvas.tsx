import React, { useEffect, useRef, useState } from 'react';
import { HorizontalChangeDirection, VerticalChangeDirection, XY } from '../types';

import './PickerCanvas.css';

interface Props {
  createData: (width: number, height: number) => ImageData;
  /**
   * Callback for value change, x and y values in range 0..1
   */
  onChange?: (val: XY) => void;
  horizontalChangeDirection?: HorizontalChangeDirection;
  verticalChangeDirection?: VerticalChangeDirection;
}

const PickerCanvas: React.FC<Props> = ({
  createData,
  onChange,
  horizontalChangeDirection = HorizontalChangeDirection.LeftToRight,
  verticalChangeDirection = VerticalChangeDirection.TopToBottom
}) => {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [dragging, setDragging] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = (ctx: CanvasRenderingContext2D) => {
    const { width, height } = ctx.canvas;
    const data = createData(width, height);
    ctx.putImageData(data, 0, 0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const { offsetWidth, offsetHeight } = canvas;
      if (canvasSize.width !== offsetWidth || canvasSize.height !== offsetHeight) {
        setCanvasSize({ width: offsetWidth, height: offsetHeight });
        canvas.width = offsetWidth;
        canvas.height = offsetHeight;
        const context = canvas.getContext('2d');
        context && draw(context);
      }
    }
  });

  const handleChange = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const boundingRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - boundingRect.left;
    const y = e.clientY - boundingRect.top;
    const { width, height } = e.currentTarget;
    const scaledX =
      horizontalChangeDirection === HorizontalChangeDirection.LeftToRight
        ? Math.max(x / (width - 1), 0)
        : 1 - Math.max(x / (width - 1), 0);
    const scaledY =
      verticalChangeDirection === VerticalChangeDirection.TopToBottom
        ? Math.max(y / (height - 1), 0)
        : 1 - Math.max(y / (height - 1), 0);
    console.log(`Picker value change x: ${scaledX} (${x}), y: ${scaledY} (${y})`);
    onChange && onChange({ x: scaledX, y: scaledY });
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    handleChange(e);
    setDragging(true);
  };

  const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    handleChange(e);
    setDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (dragging && e.buttons === 0) {
      setDragging(false);
      return;
    }
    dragging && handleChange(e);
  };

  return (
    <canvas
      ref={canvasRef}
      className="picker-canvas"
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    />
  );
};

export default PickerCanvas;
