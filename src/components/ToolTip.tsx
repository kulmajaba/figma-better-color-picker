import React, { useCallback, useEffect, useRef, useState } from 'react';

import { XY } from '../types';

import './ToolTip.css';

interface Props {
  tooltip?: string;
  immediate?: boolean;
  children: React.ReactNode;
  /**
   * Set any props that should trigger a re-render of the tooltip
   * This is a hacky way of working around the limitation of re-rendering:
   * this component should recalculate position on any layout change, but its own re-render
   * also triggers this leading to an endless loop.
   * Instead we can at least trigger the recalculation when some props change.
   */
  triggerProps?: unknown;
}

const minOffset = 4;

/**
 * Get offset value for positioning an element between boundaries with a margin, but not
 * repositioning the element if it already falls inside the bounds without translation.
 * @param lowerBoundary Lower bound of the container, usually 0
 * @param upperBoundary Upper bound of the container
 * @param lowerValue Lower value of the element's bounding box
 * @param upperValue Upper value of the element's bounding box
 * @param currentDelta Current offset applied to the element, affecting the bounding box
 * @returns a new offset to apply to the element
 */
const getDelta = (
  lowerBoundary: number,
  upperBoundary: number,
  lowerValue: number,
  upperValue: number,
  currentDelta: number
): number => {
  // Low side of the element is too close to lower boundary
  if (lowerValue < lowerBoundary + minOffset) {
    return -lowerValue + minOffset + currentDelta;
  }

  // High side of the element is too close to the higher boundary
  if (upperValue > upperBoundary - minOffset) {
    return -(upperValue - upperBoundary) - minOffset + currentDelta;
  }

  // Low side of the element is within boundaries but offset is still applied,
  // calculate the minimum possible offset to achieve the result
  if (lowerValue > lowerBoundary + minOffset && currentDelta > 0) {
    return currentDelta - Math.min(lowerValue - (lowerBoundary + minOffset), currentDelta);
  }

  // High side of the element is within boundaries but offset is still applied,
  // calculate the minimum possible offset to achieve the result
  if (upperValue < upperBoundary - minOffset && currentDelta < 0) {
    return currentDelta + Math.min(upperBoundary - minOffset - upperValue, -currentDelta);
  }

  return 0;
};

const ToolTip: React.FC<Props> = ({ tooltip, immediate, children, triggerProps }) => {
  const [offset, setOffset] = useState<XY>({ x: 0, y: 0 });

  const tipRef = useRef<HTMLSpanElement>(null);

  const handleResize = useCallback(() => {
    if (tipRef.current) {
      const boundingRect = tipRef.current?.getBoundingClientRect();
      const { top, bottom, left, right } = boundingRect;
      const { clientWidth, clientHeight } = document.body;

      setOffset((currentOffset) => {
        return {
          x: getDelta(0, clientWidth, left, right, currentOffset.x),
          y: getDelta(0, clientHeight, top, bottom, currentOffset.y)
        };
      });
    }
  }, [tipRef.current, setOffset]);

  useEffect(() => {
    window.addEventListener('resize', () => handleResize());

    return window.removeEventListener('resize', () => handleResize());
  }, []);

  useEffect(() => {
    handleResize();
  }, [triggerProps]);

  const transform = `translate(50%) translate(${offset.x}px, ${offset.y}px)`;

  return (
    <div className="tooltip-container">
      {children}
      <span ref={tipRef} className={`tooltip${immediate ? ' tooltip-immediate' : ''}`} style={{ transform }}>
        {tooltip}
      </span>
    </div>
  );
};

export default ToolTip;
