import React, { useCallback, useEffect, useState } from 'react';

import strings from '../../assets/strings';
import { useColorSpace } from '../../hooks/useColorSpace';
import { Color } from '../../types';
import { rgb_to_hex } from '../../color/general';
import ColorInput from '../ColorInput/ColorInput';
import ColorRowAddButton from './ColorRowAddButton';
import Button from '../Lib/Button';
import ColorTile from '../ColorTile';
import { useComparisonColors } from '../../hooks/useComparisonColors';
import ColorComparisonCell from './ColorComparisonCell';

import './ColorRow.css';

interface Props {
  firstComponent: number;
  secondComponent: number;
  thirdComponent: number;
  alpha: number;
  firstComponentLocked: boolean;
  secondComponentLocked: boolean;
  thirdComponentLocked: boolean;
  alphaLocked: boolean;
  onDelete: () => void;
}

const ColorRow: React.FC<Props> = ({
  firstComponent: firstComponentProp,
  secondComponent: secondComponentProp,
  thirdComponent: thirdComponentProp,
  alpha: alphaProp,
  firstComponentLocked,
  secondComponentLocked,
  thirdComponentLocked,
  alphaLocked,
  onDelete
}) => {
  const [firstComponent, setFirstComponent] = useState(firstComponentProp);
  const [secondComponent, setSecondComponent] = useState(secondComponentProp);
  const [thirdComponent, setThirdComponent] = useState(thirdComponentProp);
  const [alpha, setAlpha] = useState(alphaProp);

  const { toSRGB, convertFromPrevious } = useColorSpace();
  const { comparisonColors, addComparisonColor } = useComparisonColors();

  useEffect(() => {
    if (convertFromPrevious) {
      const prevColor: Color = [firstComponent, secondComponent, thirdComponent];
      const [first, second, third] = convertFromPrevious(prevColor);
      !firstComponentLocked && setFirstComponent(first);
      !secondComponentLocked && setSecondComponent(second);
      !thirdComponentLocked && setThirdComponent(third);
    }
  }, [convertFromPrevious]);

  useEffect(() => {
    if (firstComponentLocked) {
      setFirstComponent(firstComponentProp);
    }
  }, [firstComponentProp, firstComponentLocked]);

  useEffect(() => {
    if (secondComponentLocked) {
      setSecondComponent(secondComponentProp);
    }
  }, [secondComponentProp, secondComponentLocked]);

  useEffect(() => {
    if (thirdComponentLocked) {
      setThirdComponent(thirdComponentProp);
    }
  }, [thirdComponentProp, thirdComponentLocked]);

  useEffect(() => {
    if (alphaLocked) {
      setAlpha(alphaProp);
    }
  }, [alphaProp, alphaLocked]);

  const onColorChange = useCallback(
    (color: Color) => {
      const shouldChangeFirst = !firstComponentLocked && color[0] !== firstComponent;
      const shouldChangeSecond = !secondComponentLocked && color[1] !== secondComponent;
      const shouldChangeThird = !thirdComponentLocked && color[2] !== thirdComponent;

      shouldChangeFirst && setFirstComponent(color[0]);
      shouldChangeSecond && setSecondComponent(color[1]);
      shouldChangeThird && setThirdComponent(color[2]);

      if (shouldChangeFirst || shouldChangeSecond || shouldChangeThird) {
        return true;
      }
      return false;
    },
    [firstComponentLocked, secondComponentLocked, thirdComponentLocked, firstComponent, secondComponent, thirdComponent]
  );

  const onAlphaChange = useCallback(
    (newAlpha: number) => {
      if (!alphaLocked && alpha !== newAlpha) {
        setAlpha(newAlpha);
        return true;
      } else {
        return false;
      }
    },
    [alphaLocked]
  );

  const color: Color = [firstComponent, secondComponent, thirdComponent];

  const onCopy = useCallback(async () => {
    console.log('copy');
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(rgb_to_hex(toSRGB(color)));
        console.log('copy successful');
      } catch (e) {
        console.error(e);
      }
    } else {
      console.warn('Clipboard API not available');
    }
  }, [color]);

  const onPushToComparison = useCallback(() => {
    addComparisonColor(color);
  }, [color]);

  return (
    <>
      <div className="color-row-main">
        <ColorTile color={color} alpha={alpha} />
        <ColorInput
          type="component"
          value={color}
          alpha={alpha}
          onColorChange={onColorChange}
          onAlphaChange={onAlphaChange}
        />
        <div className="color-row-buttons">
          <Button
            className="small border-none"
            icon="content_copy"
            tooltip={strings.tooltip.copyColor}
            onClick={onCopy}
          />
          <ColorRowAddButton
            firstComponent={firstComponent}
            secondComponent={secondComponent}
            thirdComponent={thirdComponent}
            alpha={alpha}
          />
          <Button className="small border-none" icon="delete" onClick={onDelete} />
          <Button
            className="small border-none"
            icon="double_arrow"
            onClick={onPushToComparison}
            tooltip={strings.tooltip.addColorToComparison}
            triggerProps={comparisonColors}
          />
        </div>
      </div>
      {comparisonColors.length > 0 && (
        <div className="color-row-comparison">
          {comparisonColors.map((comparisonColor, i) => (
            <ColorComparisonCell key={i} color={color} comparisonColor={comparisonColor} />
          ))}
        </div>
      )}
    </>
  );
};

export default ColorRow;
