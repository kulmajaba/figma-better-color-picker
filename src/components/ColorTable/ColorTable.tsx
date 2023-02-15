import React, { useCallback, useState } from 'react';

import ColorRow from './ColorRow';
import LockButton from './LockButton';
import { useColorSpace } from '../../hooks/useColorSpace';
import Button from '../Button';
import { useComparisonColors } from '../../hooks/useComparisonColors';
import ColorTile from '../ColorTile';

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

  const { componentShortNames } = useColorSpace();
  const { comparisonColors } = useComparisonColors();

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
    <>
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
          <Button icon="double_arrow" onClick={() => console.log('press')} />
        </div>
      </div>
      {comparisonColors.length > 0 && (
        <div className="color-comparison-header">
          {comparisonColors.map((comparisonColor) => (
            <ColorTile color={comparisonColor} />
          ))}
        </div>
      )}
      {colorRows}
    </>
  );
};

export default ColorTable;
