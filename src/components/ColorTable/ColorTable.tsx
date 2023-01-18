import React, { useCallback, useState } from 'react';

import ColorRow from './ColorRow';
import LockButton from './LockButton';
import { useColorSpace } from '../../hooks/useColorSpace';
import Button from '../Button';

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

  const toggleFirstComponentLocked = useCallback(() => {
    setFirstComponentLocked(!firstComponentLocked);
  }, [firstComponentLocked]);

  const toggleSecondComponentLocked = useCallback(() => {
    setSecondComponentLocked(!secondComponentLocked);
  }, [secondComponentLocked]);

  const toggleThirdComponentLocked = useCallback(() => {
    setThirdComponentLocked(!thirdComponentLocked);
  }, [thirdComponentLocked]);

  const toggleAlphaLocked = useCallback(() => {
    setAlphaLocked(!alphaLocked);
  }, [alphaLocked]);

  const addRow = useCallback(() => {
    const newRows = rows.concat(Math.max(...rows) + 1);
    setRows(newRows);
  }, [rows]);

  const deleteRow = useCallback(
    (key: number) => {
      const newRows = rows.filter((k) => k !== key);
      setRows(newRows);
    },
    [rows]
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
        <Button icon="add" onClick={addRow} />
      </div>
      {colorRows}
    </>
  );
};

export default ColorTable;
