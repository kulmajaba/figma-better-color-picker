import React from 'react';

import classNames from 'classnames';

import Icon, { IconKey } from './Icon';
import ToolTip from './ToolTip';
import { HMTLButtonProps } from '../../types';

import './Button.css';

interface Props extends HMTLButtonProps {
  icon?: IconKey;
  rotateIconDeg?: number;
  tooltip?: string;
}

const Button: React.FC<Props> = ({ className, children, icon, rotateIconDeg, tooltip, ...buttonProps }) => {
  const buttonClassNames = classNames('Button', 'u-focusBorder', className);
  const button = (
    <button className={buttonClassNames} type="button" {...buttonProps}>
      {icon && <Icon icon={icon} rotateDeg={rotateIconDeg} />}
      {children}
    </button>
  );

  return tooltip ? <ToolTip tooltip={tooltip}>{button}</ToolTip> : button;
};

export default Button;
