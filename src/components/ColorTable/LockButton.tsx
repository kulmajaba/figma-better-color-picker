import React from 'react';

import classNames from 'classnames';

import Icon from '../Lib/Icon';

import './LockButton.css';

interface Props {
  children: string;
  locked?: boolean;
  onClick?: () => void;
}

const LockButton: React.FC<Props> = ({ children, locked, onClick }) => {
  const buttonClassNames = classNames('small', 'border-none', 'lock-button', { locked });

  return (
    <button className={buttonClassNames} onClick={onClick}>
      <span>{children}</span>
      <Icon icon={locked ? 'link' : 'link_off'} />
    </button>
  );
};

export default LockButton;
