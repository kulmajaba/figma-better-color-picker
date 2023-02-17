import React from 'react';

import classNames from 'classnames';

import './Switch.css';

interface Props {
  value?: boolean;
  onClick?: () => void;
  name: string;
  label: string;
}

const Switch: React.FC<Props> = ({ value, onClick, name, label }) => {
  const switchClassNames = classNames('switch', value ? 'switch--switchOn' : 'switch--switchOff');

  return (
    <div className="label-container">
      <label htmlFor={name}>{label}</label>
      <button
        name={name}
        className="switch-container focus-border"
        type="button"
        aria-pressed={value}
        onClick={onClick}
      >
        <div className={switchClassNames}>
          <div className="switch-nub"></div>
        </div>
      </button>
    </div>
  );
};

export default Switch;
