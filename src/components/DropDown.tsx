import React, { useCallback } from 'react';

import './DropDown.css';

interface Props<T> {
  name: string;
  label: string;
  options: T[];
  value: T;
  onChange: (val: T) => void;
}

const DropDown = <T extends string>({ name, label, options, value, onChange: onChangeProp }: Props<T>) => {
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChangeProp(e.target.value as T);
    },
    [onChangeProp]
  );

  return (
    <div className="dropdown">
      <label htmlFor={name}>{label}:</label>
      <select name={name} value={value} onChange={onChange}>
        {options.map((o) => (
          <option>{o}</option>
        ))}
      </select>
    </div>
  );
};

export default DropDown;
