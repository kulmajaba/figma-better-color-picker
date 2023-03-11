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
  const switchClassNames = classNames('Switch-track', value ? 'Switch-track--switchOn' : 'Switch-track--switchOff');

  return (
    <div className="Switch">
      <label htmlFor={name}>{label}</label>
      <button name={name} className="Switch-button u-focusBorder" type="button" aria-pressed={value} onClick={onClick}>
        <div className={switchClassNames}>
          <div className="Switch-nub"></div>
        </div>
      </button>
    </div>
  );
};

export default Switch;
