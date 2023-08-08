import { FC, useCallback, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import { XY } from '../../types';

import './ToolTip.css';

interface Props {
  tooltip?: string;
  className?: string;
  children: React.ReactNode;
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
  if (lowerValue >= lowerBoundary + minOffset && currentDelta > 0) {
    return currentDelta - Math.min(lowerValue - (lowerBoundary + minOffset), currentDelta);
  }

  // High side of the element is within boundaries but offset is still applied,
  // calculate the minimum possible offset to achieve the result
  if (upperValue <= upperBoundary - minOffset && currentDelta < 0) {
    return currentDelta + Math.min(upperBoundary - minOffset - upperValue, -currentDelta);
  }

  return 0;
};

const ToolTip: FC<Props> = ({ tooltip, children, className }) => {
  const [offset, setOffset] = useState<XY>({ x: 0, y: 0 });
  const [display, setDisplay] = useState(false);
  const [visible, setVisible] = useState(false);

  const tipRef = useRef<HTMLSpanElement>(null);

  const reposition = useCallback(() => {
    if (tipRef.current) {
      const boundingRect = tipRef.current?.getBoundingClientRect();
      const { top, bottom, left, right } = boundingRect;
      const { clientWidth, clientHeight } = document.body;

      setOffset((currentOffset) => ({
        x: getDelta(0, clientWidth, left, right, currentOffset.x),
        y: getDelta(0, clientHeight, top, bottom, currentOffset.y)
      }));
    }
  }, []);

  /**
   * CSS-WG has agreed to adopt display animations into the standard,
   * and at that point this component can be refactored to use pure CSS animations.
   * https://github.com/w3c/csswg-drafts/issues/6429#issuecomment-1332439874
   */
  useEffect(() => {
    if (display) {
      reposition();
      setVisible(true);
    }
  }, [display, reposition]);

  const onFocus = useCallback(() => {
    setDisplay(true);
  }, []);

  const onBlur = useCallback(() => {
    setVisible(false);
    setDisplay(false);
  }, []);

  const transform = `translate(50%) translate(${offset.x}px, ${offset.y}px)`;

  const spanClassNames = classNames('ToolTip-text', { 'is-display': display, 'is-visible': visible }, className);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className="ToolTip"
      onClick={onBlur}
      onMouseEnter={onFocus}
      onFocus={onFocus}
      onMouseLeave={onBlur}
      onBlur={onBlur}
    >
      {children}
      <span ref={tipRef} className={spanClassNames} style={{ transform }}>
        {tooltip}
      </span>
    </div>
  );
};

export default ToolTip;
