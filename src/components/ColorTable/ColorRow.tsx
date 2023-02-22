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
import classNames from 'classnames';

interface Props {
  firstComponent: number;
  secondComponent: number;
  thirdComponent: number;
  alpha: number;
  firstComponentLocked: boolean;
  secondComponentLocked: boolean;
  thirdComponentLocked: boolean;
  alphaLocked: boolean;
  editing: boolean;
  onDelete: () => void;
  onSetEditing: (color: Color, alpha: number) => void;
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
  editing,
  onDelete,
  onSetEditing: onSetEditingProp
}) => {
  const [firstComponent, setFirstComponent] = useState(firstComponentProp);
  const [secondComponent, setSecondComponent] = useState(secondComponentProp);
  const [thirdComponent, setThirdComponent] = useState(thirdComponentProp);
  const [alpha, setAlpha] = useState(alphaProp);

  const { toSRGB, convertFromPrevious } = useColorSpace();
  const { comparisonColors, comparisonColorsVisible, addComparisonColor } = useComparisonColors();

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
    if (firstComponentLocked || editing) {
      setFirstComponent(firstComponentProp);
    }
  }, [firstComponentProp, firstComponentLocked, editing]);

  useEffect(() => {
    if (secondComponentLocked || editing) {
      setSecondComponent(secondComponentProp);
    }
  }, [secondComponentProp, secondComponentLocked, editing]);

  useEffect(() => {
    if (thirdComponentLocked || editing) {
      setThirdComponent(thirdComponentProp);
    }
  }, [thirdComponentProp, thirdComponentLocked, editing]);

  useEffect(() => {
    if (alphaLocked || editing) {
      setAlpha(alphaProp);
    }
  }, [alphaProp, alphaLocked, editing]);

  // TODO: call onSetEditing if needed
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

  const onSetEditing = useCallback(() => {
    onSetEditingProp(color, alpha);
  }, [color, alpha]);

  const buttonClassNames = classNames('color-tile-button focus-border', { 'color-tile-button--active': editing });

  return (
    <>
      <div className="color-row-main">
        <button className={buttonClassNames} type="button" onClick={onSetEditing}>
          <ColorTile color={color} alpha={alpha} />
        </button>
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
          {comparisonColorsVisible && (
            <Button
              className="small border-none"
              icon="double_arrow"
              onClick={onPushToComparison}
              tooltip={strings.tooltip.addColorToComparison}
              triggerProps={comparisonColors}
            />
          )}
        </div>
      </div>
      {comparisonColorsVisible && comparisonColors.length > 0 && (
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
