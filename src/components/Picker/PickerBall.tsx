import { FC, useCallback, useEffect, useRef, useState } from 'react';

import { useTheme } from '../../hooks/useTheme';

import { HorizontalChangeDirection, VerticalChangeDirection } from '../../types';

import './PickerBall.css';

interface Props {
  value: { x: number; y: number };
  horizontalChangeDirection: HorizontalChangeDirection;
  verticalChangeDirection: VerticalChangeDirection;
}

const PickerBall: FC<Props> = ({ value, horizontalChangeDirection, verticalChangeDirection }) => {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const { theme } = useTheme();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const { width, height } = ctx.canvas;
      const strokeWidth = 1;
      // TODO: use CSS variable
      const r = 6;
      const x =
        horizontalChangeDirection === HorizontalChangeDirection.LeftToRight
          ? Math.round(value.x * (width - 2 * r) + r)
          : Math.round((1 - value.x) * (width - 2 * r) + r);
      const y =
        verticalChangeDirection === VerticalChangeDirection.TopToBottom
          ? Math.round(value.y * (height - 2 * r) + r)
          : Math.round((1 - value.y) * (height - 2 * r) + r);

      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = theme['--color-text'];
      ctx.beginPath();
      ctx.arc(x, y, r - strokeWidth, 0, Math.PI * 2);
      ctx.stroke();
    },
    [horizontalChangeDirection, theme, value, verticalChangeDirection]
  );

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
  }, [value, canvasSize, draw, theme]);

  return <canvas ref={canvasRef} className="PickerBall" />;
};

export default PickerBall;
