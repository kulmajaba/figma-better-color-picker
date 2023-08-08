import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import classNames from 'classnames';

import { useColorSpace } from '../../hooks/useColorSpace';
import { useContrastChecker } from '../../hooks/useContrastChecker';
import ColorInput from '../ColorInput';
import Button from '../Lib/Button';

import ColorRowAddButton from './ColorRowAddButton';
import ColorRowCopyButton from './ColorRowCopyButton';
import ColorTileButton from './ColorTileButton';
import ContrastCheckerCell from './ContrastCheckerCell';

import { Color, SetEditingColorCallback } from '../../types';

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

const ColorRow: FC<Props> = ({
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

  const color: Color = useMemo(
    () => [firstComponent, secondComponent, thirdComponent],
    [firstComponent, secondComponent, thirdComponent]
  );

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

  const onColorChange = useCallback(
    (newColor: Color) => {
      if (editing) {
        onSetEditingProp(id, undefined, newColor, alpha);
      }

      const shouldChangeFirst = !firstComponentLocked && newColor[0] !== firstComponent;
      const shouldChangeSecond = !secondComponentLocked && newColor[1] !== secondComponent;
      const shouldChangeThird = !thirdComponentLocked && newColor[2] !== thirdComponent;

      shouldChangeFirst && setFirstComponent(newColor[0]);
      shouldChangeSecond && setSecondComponent(newColor[1]);
      shouldChangeThird && setThirdComponent(newColor[2]);

      if (shouldChangeFirst || shouldChangeSecond || shouldChangeThird) {
        return true;
      }

      return false;
    },
    [
      firstComponentLocked,
      firstComponent,
      secondComponentLocked,
      secondComponent,
      thirdComponentLocked,
      thirdComponent,
      editing,
      onSetEditingProp,
      id,
      alpha
    ]
  );

  const onAlphaChange = useCallback(
    (newAlpha: number) => {
      if (editing) {
        onSetEditingProp(id, undefined, color, newAlpha);
      }

      if (!alphaLocked && alpha !== newAlpha) {
        setAlpha(newAlpha);
        return true;
      }

      return false;
    },
    [alpha, alphaLocked, color, editing, id, onSetEditingProp]
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
