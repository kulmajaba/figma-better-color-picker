import React from 'react';

import Icon from '../Icon';

import './LockButton.css';

interface Props {
  children: string;
  locked?: boolean;
  onClick?: () => void;
}

const LockButton: React.FC<Props> = ({ children, locked, onClick }) => {
  const buttonClassNames = 'small border-none lock-button';
  return (
    <button className={locked ? buttonClassNames + ' locked' : buttonClassNames} onClick={onClick}>
      <span>{children}</span>
      <Icon icon={locked ? 'link' : 'link_off'} />
    </button>
  );
};

export default LockButton;
