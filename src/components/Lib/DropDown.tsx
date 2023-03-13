import React, { useCallback } from 'react';

import './DropDown.css';

interface Props<T> {
  name: string;
  label: string;
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}

const DropDown = <T extends string>({ name, label, options, value, onChange: onChangeProp }: Props<T>) => {
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChangeProp(e.target.value as T);
    },
    [onChangeProp]
  );

  return (
    <div className="DropDown">
      <label htmlFor={name}>{label}</label>
      <select className="DropDown-select u-focusBorder" name={name} value={value} onChange={onChange}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropDown;
