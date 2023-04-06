import { FC } from 'react';

import classNames from 'classnames';

import Button from '../Lib/Button';
import Icon from '../Lib/Icon';

import './LockButton.css';

interface Props {
  children: string;
  locked?: boolean;
  onClick?: () => void;
}

const LockButton: FC<Props> = ({ children, locked, onClick }) => {
  const buttonClassNames = classNames('Button--small', 'u-borderNone', 'LockButton', { 'is-locked': locked });
  const iconClassNames = classNames('LockButton-icon', { 'is-locked': locked });

  return (
    <Button className={buttonClassNames} onClick={onClick}>
      <span className="LockButton-text">{children}</span>
      <Icon className={iconClassNames} icon={locked ? 'link' : 'link_off'} />
    </Button>
  );
};

export default LockButton;
