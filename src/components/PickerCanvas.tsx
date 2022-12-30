import React, { MouseEventHandler, useEffect, useImperativeHandle, useRef, useState } from 'react';

import './PickerCanvas.css';

interface Props {
  createData: (width: number, height: number) => ImageData;
  /**
   * Callback for value change, x and y values in range 0..1
   */
  onMouseDown?: MouseEventHandler<HTMLElement>;
}

const PickerCanvas = React.forwardRef<HTMLCanvasElement, Props>(({ createData, onMouseDown }, ref) => {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  useImperativeHandle<HTMLCanvasElement | null, HTMLCanvasElement | null>(ref, () => canvasRef.current);

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

  return <canvas ref={canvasRef} className="picker-canvas" id="hue-picker" onMouseDown={onMouseDown} />;
});

export default PickerCanvas;
