import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { MouseOrTouchEventHandler, Size } from '../types';

import './PickerCanvas.css';

interface Props {
  getImageData: (width: number, height: number) => ImageData;
  onMouseDownOrTouchStart?: MouseOrTouchEventHandler;
  onSizeChange?: (size: Size) => void;
}

const PickerCanvas = React.forwardRef<HTMLCanvasElement, Props>(
  ({ getImageData, onMouseDownOrTouchStart, onSizeChange }, ref) => {
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    const canvasRef = useRef<HTMLCanvasElement>(null);
    useImperativeHandle<HTMLCanvasElement | null, HTMLCanvasElement | null>(ref, () => canvasRef.current);

    const draw = useCallback(
      (ctx: CanvasRenderingContext2D) => {
        const { width, height } = ctx.canvas;
        const data = getImageData(width, height);
        ctx.putImageData(data, 0, 0);
      },
      [getImageData]
    );

    useEffect(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const { offsetWidth, offsetHeight } = canvas;
        if (canvasSize.width !== offsetWidth || canvasSize.height !== offsetHeight) {
          const newSize = { width: offsetWidth, height: offsetHeight };
          onSizeChange?.(newSize);
          setCanvasSize(newSize);
          canvas.width = offsetWidth;
          canvas.height = offsetHeight;
          const context = canvas.getContext('2d');
          context && draw(context);
        }
      }
    }, []);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        context && draw(context);
      }
    }, [getImageData]);

    return (
      <canvas
        ref={canvasRef}
        className="PickerCanvas"
        onMouseDown={onMouseDownOrTouchStart}
        onTouchStart={onMouseDownOrTouchStart}
      />
    );
  }
);

export default PickerCanvas;
