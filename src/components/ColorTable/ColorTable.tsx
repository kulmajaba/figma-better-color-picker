import { FC, useCallback, useEffect, useRef, useState } from 'react';

import strings from '../../assets/strings';
import { rgb_to_hex } from '../../color/general';
import { useColorSpace } from '../../hooks/useColorSpace';
import { useContrastChecker } from '../../hooks/useContrastChecker';
import useMountedEffect from '../../hooks/useMountedEffect';
import Button from '../Lib/Button';
import ToolTip from '../Lib/ToolTip';

import ColorRow from './ColorRow';
import ColorTileButton from './ColorTileButton';
import LockButton from './LockButton';

import { Color, SetEditingColorCallback } from '../../types';

import './ColorTable.css';

interface Props {
  firstComponent: number;
  secondComponent: number;
  thirdComponent: number;
  alpha: number;
  onSetEditing: (color: Color, alpha: number, enableAlpha: boolean) => void;
  onResizeFigmaPlugin: (width: number) => void;
}

const ColorTable: FC<Props> = ({
  firstComponent: firstComponentProp,
  secondComponent: secondComponentProp,
  thirdComponent: thirdComponentProp,
  alpha: alphaProp,
  onSetEditing: onSetEditingProp,
  onResizeFigmaPlugin
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
  const [[editingRowKey, editingContrastKey], setEditingRow] = useState<[number | undefined, number | undefined]>([
    0,
    undefined
  ]);

  const { componentShortNames, toSRGB, convertFromPrevious } = useColorSpace();
  const { contrastCheckerVisible } = useContrastChecker();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editingContrastKey !== undefined) {
      setContrastColors((colors) => {
        const newColors = colors.slice();
        newColors[editingContrastKey] = [firstComponentProp, secondComponentProp, thirdComponentProp];
        return newColors;
      });
    } else {
      setFirstComponent(firstComponentProp);
      setSecondComponent(secondComponentProp);
      setThirdComponent(thirdComponentProp);
      setAlpha(alphaProp);
    }
  }, [firstComponentProp, secondComponentProp, thirdComponentProp, alphaProp, editingContrastKey]);

  useEffect(() => {
    if (convertFromPrevious) {
      setContrastColors((colors) => colors.map(convertFromPrevious));
    }
  }, [convertFromPrevious]);

  useMountedEffect(() => {
    containerRef.current && onResizeFigmaPlugin(containerRef.current.scrollWidth);
  }, [contrastColors.length, contrastCheckerVisible, rows.length]);

  const toggleFirstComponentLocked = useCallback(() => setFirstComponentLocked((locked) => !locked), []);

  const toggleSecondComponentLocked = useCallback(() => setSecondComponentLocked((locked) => !locked), []);

  const toggleThirdComponentLocked = useCallback(() => setThirdComponentLocked((locked) => !locked), []);

  const toggleAlphaLocked = useCallback(() => setAlphaLocked((locked) => !locked), []);

  const addRow = useCallback(
    () => setRows((prevRows) => prevRows.concat(prevRows.length > 0 ? Math.max(...prevRows) + 1 : 0)),
    []
  );

  const deleteRow = useCallback((key: number) => setRows((prevRows) => prevRows.filter((k) => k !== key)), []);

  const onSetEditing: SetEditingColorCallback = useCallback(
    (colorRow, contrastColumn, newColor, newAlpha) => {
      setEditingRow([colorRow, contrastColumn]);
      onSetEditingProp(newColor, newAlpha ?? 1, colorRow !== undefined);
    },
    [onSetEditingProp]
  );

  const addContrastColor = useCallback(
    // TODO: what happens after color space change?
    () => setContrastColors((colors) => colors.concat([[firstComponentProp, secondComponentProp, thirdComponentProp]])),
    [firstComponentProp, secondComponentProp, thirdComponentProp]
  );

  const deleteContrastColor = useCallback((index: number) => {
    setContrastColors((colors) => colors.filter((_, i) => i !== index));
    // TODO: make sure color changes correctly if this is done
    // setEditingRow(([rowKey, contrastKey]) => [rowKey, contrastKey === index ? undefined : contrastKey]);
  }, []);

  const colorRows = rows.map((key) => (
    <ColorRow
      key={key}
      id={key}
      firstComponent={firstComponent}
      secondComponent={secondComponent}
      thirdComponent={thirdComponent}
      alpha={alpha}
      firstComponentLocked={firstComponentLocked}
      secondComponentLocked={secondComponentLocked}
      thirdComponentLocked={thirdComponentLocked}
      alphaLocked={alphaLocked}
      editingColorRow={editingRowKey}
      editingContrastColumn={editingContrastKey}
      contrastColors={contrastColors}
      onDelete={() => deleteRow(key)}
      onSetEditing={onSetEditing}
    />
  ));

  return (
    <section className="ColorTable" ref={containerRef}>
      <div className="ColorTable-header">
        <div className="ColorTable-lockButtonRow">
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
        <div className="ColorTable-headerRight">
          <Button icon="double_arrow" rotateIconDeg={90} onClick={addRow} tooltip={strings.tooltip.addColorRow} />
          {contrastCheckerVisible && (
            <Button icon="double_arrow" onClick={addContrastColor} tooltip={strings.tooltip.addColorToChecker} />
          )}
        </div>
      </div>
      {contrastCheckerVisible && contrastColors.length > 0 && (
        <div className="ColorTable-contrastHeader">
          {contrastColors.map((contrastColor, i) => (
            <div className="ColorTable-contrastHeaderCell" key={i}>
              <Button
                className="Button--small u-borderNone"
                icon="delete"
                tooltip={strings.tooltip.deleteColorFromChecker}
                onClick={() => deleteContrastColor(i)}
              />
              <ToolTip className="ToolTip--immediate" tooltip={rgb_to_hex(toSRGB(contrastColor))}>
                <ColorTileButton
                  color={contrastColor}
                  selected={i === editingContrastKey}
                  onClick={() => onSetEditing(undefined, i, contrastColor, 1)}
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
