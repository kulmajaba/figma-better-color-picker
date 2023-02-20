import React, { useCallback, useState } from 'react';

import ColorRow from './ColorRow';
import LockButton from './LockButton';
import { useColorSpace } from '../../hooks/useColorSpace';
import Button from '../Lib/Button';
import { useComparisonColors } from '../../hooks/useComparisonColors';
import ColorTile from '../ColorTile';
import strings from '../../assets/strings';
import ToolTip from '../Lib/ToolTip';
import { rgb_to_hex } from '../../color/general';

import './ColorTable.css';

interface Props {
  firstComponent: number;
  secondComponent: number;
  thirdComponent: number;
  alpha: number;
}

const ColorTable: React.FC<Props> = ({ firstComponent, secondComponent, thirdComponent, alpha }) => {
  const [firstComponentLocked, setFirstComponentLocked] = useState(true);
  const [secondComponentLocked, setSecondComponentLocked] = useState(true);
  const [thirdComponentLocked, setThirdComponentLocked] = useState(true);
  const [alphaLocked, setAlphaLocked] = useState(true);
  const [rows, setRows] = useState([0]);

  const { componentShortNames, toSRGB } = useColorSpace();
  const { comparisonColors, comparisonColorsVisible, deleteComparisonColor } = useComparisonColors();

  const toggleFirstComponentLocked = useCallback(() => setFirstComponentLocked((locked) => !locked), []);

  const toggleSecondComponentLocked = useCallback(() => setSecondComponentLocked((locked) => !locked), []);

  const toggleThirdComponentLocked = useCallback(() => setThirdComponentLocked((locked) => !locked), []);

  const toggleAlphaLocked = useCallback(() => setAlphaLocked((locked) => !locked), []);

  const addRow = useCallback(() => setRows((rows) => rows.concat(Math.max(...rows) + 1)), []);

  const deleteRow = useCallback((key: number) => setRows((rows) => rows.filter((k) => k !== key)), []);

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
      onDelete={() => deleteRow(key)}
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
          <Button icon="add" onClick={addRow} />
        </div>
      </div>
      {comparisonColorsVisible && comparisonColors.length > 0 && (
        <div className="color-comparison-header">
          {comparisonColors.map((comparisonColor, i) => (
            <div key={i}>
              <Button
                className="small border-none"
                icon="delete"
                tooltip={strings.tooltip.deleteColorFromComparison}
                onClick={() => deleteComparisonColor(i)}
              />
              <ToolTip className="tooltip-immediate" tooltip={rgb_to_hex(toSRGB(comparisonColor))}>
                <ColorTile color={comparisonColor} />
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
