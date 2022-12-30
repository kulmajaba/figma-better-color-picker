import React, { useEffect, useRef, useState } from 'react';
import { HorizontalChangeDirection, VerticalChangeDirection } from '../types';

import './PickerBall.css';

interface Props {
  value: { x: number; y: number };
  horizontalChangeDirection: HorizontalChangeDirection;
  verticalChangeDirection: VerticalChangeDirection;
}

const PickerBall: React.FC<Props> = ({ value, horizontalChangeDirection, verticalChangeDirection }) => {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = (ctx: CanvasRenderingContext2D) => {
    const { width, height } = ctx.canvas;
    const strokeWidth = 1;
    const r = 6;
    const x =
      horizontalChangeDirection === HorizontalChangeDirection.LeftToRight
        ? Math.round(value.x * width)
        : Math.round((1 - value.x) * width);
    const y =
      verticalChangeDirection === VerticalChangeDirection.TopToBottom
        ? Math.round(value.y * height)
        : Math.round((1 - value.y) * height);
    // console.log(`Ball coordinates x: ${x}, y: ${y}`);

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, r - strokeWidth, 0, Math.PI * 2);
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const { offsetWidth, offsetHeight } = canvas;
      if (canvasSize.width !== offsetWidth || canvasSize.height !== offsetHeight) {
        setCanvasSize({ width: offsetWidth, height: offsetHeight });
        canvas.width = offsetWidth;
        canvas.height = offsetHeight;
      }
      const context = canvas.getContext('2d');
      context && draw(context);
    }
  });

  return <canvas ref={canvasRef} className="picker-ball" />;
};

export default PickerBall;
