import React, { useCallback, useState } from 'react';

import ColorRow from './ColorRow';
import Icon from './Icon';
import LockButton from './LockButton';

import './ColorTable.css';

interface Props {
  hue: number;
  saturation: number;
  value: number;
  alpha: number;
}

const ColorTable: React.FC<Props> = ({ hue, saturation, value, alpha }) => {
  const [hueLocked, setHueLocked] = useState(true);
  const [saturationLocked, setSaturationLocked] = useState(true);
  const [valueLocked, setValueLocked] = useState(true);
  const [alphaLocked, setAlphaLocked] = useState(true);
  const [rows, setRows] = useState([0]);

  const toggleHueLocked = useCallback(() => {
    setHueLocked(!hueLocked);
  }, [hueLocked]);

  const toggleSaturationLocked = useCallback(() => {
    setSaturationLocked(!saturationLocked);
  }, [saturationLocked]);

  const toggleValueLocked = useCallback(() => {
    setValueLocked(!valueLocked);
  }, [valueLocked]);

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
      hue={hue}
      saturation={saturation}
      value={value}
      alpha={alpha}
      hueLocked={hueLocked}
      saturationLocked={saturationLocked}
      valueLocked={valueLocked}
      alphaLocked={alphaLocked}
      onDelete={() => deleteRow(key)}
    />
  ));

  return (
    <>
      <div className="lock-button-row-container">
        <div className="lock-button-row">
          <LockButton locked={hueLocked} onClick={toggleHueLocked}>
            H
          </LockButton>
          <LockButton locked={saturationLocked} onClick={toggleSaturationLocked}>
            S
          </LockButton>
          <LockButton locked={valueLocked} onClick={toggleValueLocked}>
            V
          </LockButton>
          <LockButton locked={alphaLocked} onClick={toggleAlphaLocked}>
            A
          </LockButton>
        </div>
        <button onClick={addRow}>
          <Icon icon="add" />
        </button>
      </div>
      {colorRows}
    </>
  );
};

export default ColorTable;
