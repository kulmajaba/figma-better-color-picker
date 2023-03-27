import React, { useCallback, useEffect, useMemo, useState } from 'react';

import classNames from 'classnames';

import { useColorSpace } from '../../hooks/useColorSpace';
import { Color, SetEditingColorCallback } from '../../types';
import ColorInput from '../ColorInput';
import ColorRowAddButton from './ColorRowAddButton';
import Button from '../Lib/Button';
import { useContrastChecker } from '../../hooks/useContrastChecker';
import ContrastCheckerCell from './ContrastCheckerCell';
import ColorTileButton from './ColorTileButton';
import ColorRowCopyButton from './ColorRowCopyButton';

import './ColorRow.css';

interface Props {
  id: number;
  firstComponent: number;
  secondComponent: number;
  thirdComponent: number;
  alpha: number;
  firstComponentLocked: boolean;
  secondComponentLocked: boolean;
  thirdComponentLocked: boolean;
  alphaLocked: boolean;
  editingColorRow: number | undefined;
  editingContrastColumn: number | undefined;
  contrastColors: Color[];
  onDelete: () => void;
  onSetEditing: SetEditingColorCallback;
}

const ColorRow: React.FC<Props> = ({
  id,
  firstComponent: firstComponentProp,
  secondComponent: secondComponentProp,
  thirdComponent: thirdComponentProp,
  alpha: alphaProp,
  firstComponentLocked,
  secondComponentLocked,
  thirdComponentLocked,
  alphaLocked,
  editingColorRow,
  editingContrastColumn,
  contrastColors,
  onDelete,
  onSetEditing: onSetEditingProp
}) => {
  const [firstComponent, setFirstComponent] = useState(firstComponentProp);
  const [secondComponent, setSecondComponent] = useState(secondComponentProp);
  const [thirdComponent, setThirdComponent] = useState(thirdComponentProp);
  const [alpha, setAlpha] = useState(alphaProp);

  const { convertFromPrevious } = useColorSpace();
  const { contrastCheckerVisible } = useContrastChecker();

  useEffect(() => {
    if (convertFromPrevious) {
      const prevColor: Color = [firstComponent, secondComponent, thirdComponent];
      const [first, second, third] = convertFromPrevious(prevColor);
      setFirstComponent(first);
      setSecondComponent(second);
      setThirdComponent(third);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convertFromPrevious]);

  const editing = useMemo(() => editingColorRow === id, [editingColorRow, id]);

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
    [alpha, alphaLocked]
  );

  const color: Color = useMemo(
    () => [firstComponent, secondComponent, thirdComponent],
    [firstComponent, secondComponent, thirdComponent]
  );

  const onSetEditing = useCallback(() => {
    onSetEditingProp(id, undefined, color, alpha);
  }, [onSetEditingProp, id, color, alpha]);

  const contrastRowClassNames = classNames('ColorRow-contrastRow', { 'ColorRow-contrastRow--selected': editing });

  return (
    <>
      <div className="ColorRow">
        <ColorTileButton color={color} alpha={alpha} selected={editing} onClick={onSetEditing} />
        <ColorInput
          type="component"
          value={color}
          alpha={alpha}
          onColorChange={onColorChange}
          onAlphaChange={onAlphaChange}
        />
        <div className="ColorRow-buttons">
          <ColorRowCopyButton color={color} alpha={alpha} />
          <ColorRowAddButton color={color} alpha={alpha} />
          <Button className="Button--small u-borderNone" icon="delete" onClick={onDelete} />
        </div>
      </div>
      {contrastCheckerVisible && contrastColors.length > 0 && (
        <div className={contrastRowClassNames}>
          {contrastColors.map((contrastColor, i) => (
            <ContrastCheckerCell
              key={i}
              color={color}
              contrastColor={contrastColor}
              editing={editingContrastColumn === i}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ColorRow;
