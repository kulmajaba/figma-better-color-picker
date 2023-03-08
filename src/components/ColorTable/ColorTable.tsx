import React, { useCallback, useEffect, useState } from 'react';

import ColorRow from './ColorRow';
import LockButton from './LockButton';
import { useColorSpace } from '../../hooks/useColorSpace';
import Button from '../Lib/Button';
import { useContrastChecker } from '../../hooks/useContrastChecker';
import strings from '../../assets/strings';
import ToolTip from '../Lib/ToolTip';
import { rgb_to_hex } from '../../color/general';
import { Color } from '../../types';
import ColorTileButton from './ColorTileButton';

import './ColorTable.css';

enum EditingTarget {
  Rows = 0,
  ContrastColors
}

interface Props {
  firstComponent: number;
  secondComponent: number;
  thirdComponent: number;
  alpha: number;
  onSetEditing: (color: Color, alpha: number, enableAlpha: boolean) => void;
}

const ColorTable: React.FC<Props> = ({
  firstComponent: firstComponentProp,
  secondComponent: secondComponentProp,
  thirdComponent: thirdComponentProp,
  alpha: alphaProp,
  onSetEditing: onSetEditingProp
}) => {
  const [firstComponentLocked, setFirstComponentLocked] = useState(true);
  const [secondComponentLocked, setSecondComponentLocked] = useState(true);
  const [thirdComponentLocked, setThirdComponentLocked] = useState(true);
  const [alphaLocked, setAlphaLocked] = useState(true);
  const [firstComponent, setFirstComponent] = useState(firstComponentProp);
  const [secondComponent, setSecondComponent] = useState(secondComponentProp);
  const [thirdComponent, setThirdComponent] = useState(thirdComponentProp);
  const [alpha, setAlpha] = useState(alphaProp);

  const [rows, setRows] = useState([0]);
  const [contrastColors, setContrastColors] = useState<Color[]>([[0, 0, 0]]);
  const [[editingRow, editingTarget], setEditingRow] = useState([0, EditingTarget.Rows]);

  const { componentShortNames, toSRGB, convertFromPrevious } = useColorSpace();
  const { contrastCheckerVisible } = useContrastChecker();

  useEffect(() => {
    if (editingTarget === EditingTarget.ContrastColors) {
      setContrastColors((colors) => {
        const newColors = colors.slice();
        newColors[editingRow] = [firstComponentProp, secondComponentProp, thirdComponentProp];
        return newColors;
      });
    } else {
      setFirstComponent(firstComponentProp);
      setSecondComponent(secondComponentProp);
      setThirdComponent(thirdComponentProp);
      setAlpha(alphaProp);
    }
  }, [firstComponentProp, secondComponentProp, thirdComponentProp, alphaProp, editingRow, editingTarget]);

  useEffect(() => {
    if (convertFromPrevious) {
      setContrastColors((colors) => colors.map(convertFromPrevious));
    }
  }, [convertFromPrevious]);

  const toggleFirstComponentLocked = useCallback(() => setFirstComponentLocked((locked) => !locked), []);

  const toggleSecondComponentLocked = useCallback(() => setSecondComponentLocked((locked) => !locked), []);

  const toggleThirdComponentLocked = useCallback(() => setThirdComponentLocked((locked) => !locked), []);

  const toggleAlphaLocked = useCallback(() => setAlphaLocked((locked) => !locked), []);

  const addRow = useCallback(() => setRows((rows) => rows.concat(rows.length > 0 ? Math.max(...rows) + 1 : 0)), []);

  const deleteRow = useCallback((key: number) => setRows((rows) => rows.filter((k) => k !== key)), []);

  const onSetEditing = useCallback(
    (key: number, editingTarget: EditingTarget, color: Color, alpha: number) => {
      setEditingRow([key, editingTarget]);
      onSetEditingProp(color, alpha, editingTarget === EditingTarget.Rows);
    },
    [onSetEditingProp]
  );

  const addContrastColor = useCallback(
    () => setContrastColors((colors) => colors.concat([[firstComponentProp, secondComponentProp, thirdComponentProp]])),
    [firstComponentProp, secondComponentProp, thirdComponentProp]
  );

  const deleteContrastColor = useCallback(
    (index: number) => setContrastColors((colors) => colors.filter((_, i) => i !== index)),
    []
  );

  const colorRows = rows.map((key) => (
    <ColorRow
      key={key}
      firstComponent={firstComponent}
      secondComponent={secondComponent}
      thirdComponent={thirdComponent}
      alpha={alpha}
      firstComponentLocked={firstComponentLocked}
      secondComponentLocked={secondComponentLocked}
      thirdComponentLocked={thirdComponentLocked}
      alphaLocked={alphaLocked}
      editing={key === editingRow && editingTarget === EditingTarget.Rows}
      contrastColors={contrastColors}
      onDelete={() => deleteRow(key)}
      onSetEditing={(color, alpha) => onSetEditing(key, EditingTarget.Rows, color, alpha)}
    />
  ));

  return (
    <section id="color-table">
      <div className="lock-button-row-container">
        <div className="lock-button-row">
          <LockButton locked={firstComponentLocked} onClick={toggleFirstComponentLocked}>
            {componentShortNames[0]}
          </LockButton>
          <LockButton locked={secondComponentLocked} onClick={toggleSecondComponentLocked}>
            {componentShortNames[1]}
          </LockButton>
          <LockButton locked={thirdComponentLocked} onClick={toggleThirdComponentLocked}>
            {componentShortNames[2]}
          </LockButton>
          <LockButton locked={alphaLocked} onClick={toggleAlphaLocked}>
            A
          </LockButton>
        </div>
        <div className="lock-button-row-end">
          <Button icon="double_arrow" rotateIconDeg={90} onClick={addRow} tooltip={strings.tooltip.addColorRow} />
          {contrastCheckerVisible && (
            <Button icon="double_arrow" onClick={addContrastColor} tooltip={strings.tooltip.addColorToChecker} />
          )}
        </div>
      </div>
      {contrastCheckerVisible && contrastColors.length > 0 && (
        <div className="color-comparison-header">
          {contrastColors.map((contrastColor, i) => (
            <div key={i}>
              <Button
                className="small border-none"
                icon="delete"
                tooltip={strings.tooltip.deleteColorFromChecker}
                onClick={() => deleteContrastColor(i)}
              />
              <ToolTip className="tooltip-immediate" tooltip={rgb_to_hex(toSRGB(contrastColor))}>
                <ColorTileButton
                  color={contrastColor}
                  selected={i === editingRow && editingTarget === EditingTarget.ContrastColors}
                  onClick={() => onSetEditing(i, EditingTarget.ContrastColors, contrastColor, 1)}
                />
              </ToolTip>
            </div>
          ))}
        </div>
      )}
      {colorRows}
    </section>
  );
};

export default ColorTable;
