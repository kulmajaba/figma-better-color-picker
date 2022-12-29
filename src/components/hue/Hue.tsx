import React, { useEffect, useRef, useState } from 'react';
import { okhsv_to_srgb } from '../../util/colorconversion';

import './Hue.css';

enum Direction {
  Horizontal = 'HORIZONTAL',
  Vertical = 'VERTICAL'
}

const createHueSliderData = (ctx: CanvasRenderingContext2D, direction: Direction) => {
  const { width, height } = ctx.canvas;
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

const Hue = () => {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [dragging, setDragging] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = (ctx: CanvasRenderingContext2D) => {
    const imageData = createHueSliderData(ctx, Direction.Horizontal);
    ctx.putImageData(imageData, 0, 0);
  };

  const updateCanvas = () => {
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
  };

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    context && draw(context);
  }, []);

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    // console.log(`Hue mouse down x: ${e.clientX}, y: ${e.clientY}`);
    setDragging(true);
  };

  const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    // console.log(`Hue mouse up x: ${e.clientX}, y: ${e.clientY}`);
    setDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (dragging && e.buttons === 0) {
      setDragging(false);
      return;
    }
    // dragging && console.log(`Hue drag x: ${e.clientX}, y: ${e.clientY}`);
  };

  return (
    <div className="hue-container">
      <canvas
        ref={canvasRef}
        className="hue-canvas"
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      />
    </div>
  );
};

export default Hue;
