import React, { useCallback, useEffect, useState } from 'react';

import strings from '../../assets/strings';
import { useColorSpace } from '../../hooks/useColorSpace';
import { Color } from '../../types';
import { rgb_to_hex } from '../../color/general';
import ColorInput from '../ColorInput/ColorInput';
import ColorRowAddButton from './ColorRowAddButton';
import Button from '../Lib/Button';
import { useComparisonColors } from '../../hooks/useComparisonColors';
import ColorComparisonCell from './ColorComparisonCell';
import ColorTileButton from './ColorTileButton';

import './ColorRow.css';
import ColorRowCopyButton from './ColorRowCopyButton';

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
  comparisonColors: Color[];
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
  comparisonColors,
  onDelete,
  onSetEditing: onSetEditingProp
}) => {
  const [firstComponent, setFirstComponent] = useState(firstComponentProp);
  const [secondComponent, setSecondComponent] = useState(secondComponentProp);
  const [thirdComponent, setThirdComponent] = useState(thirdComponentProp);
  const [alpha, setAlpha] = useState(alphaProp);

  const { convertFromPrevious } = useColorSpace();
  const { comparisonColorsVisible } = useComparisonColors();

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

  const onSetEditing = useCallback(() => {
    onSetEditingProp(color, alpha);
  }, [color, alpha]);

  return (
    <>
      <div className="color-row-main">
        <ColorTileButton color={color} alpha={alpha} selected={editing} onClick={onSetEditing} />
        <ColorInput
          type="component"
          value={color}
          alpha={alpha}
          onColorChange={onColorChange}
          onAlphaChange={onAlphaChange}
        />
        <div className="color-row-buttons">
          <ColorRowCopyButton color={color} alpha={alpha} />
          <ColorRowAddButton color={color} alpha={alpha} />
          <Button className="small border-none" icon="delete" onClick={onDelete} />
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
