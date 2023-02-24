import React from 'react';

import Icon, { IconKey } from './Icon';
import ToolTip from './ToolTip';
import { HMTLButtonProps } from '../../types';

import './Button.css';

interface Props extends HMTLButtonProps {
  icon?: IconKey;
  rotateIconDeg?: number;
  tooltip?: string;
}

const Button: React.FC<Props> = ({ icon, rotateIconDeg, tooltip, ...buttonProps }) =>
  tooltip ? (
    <ToolTip tooltip={tooltip}>
      <button {...buttonProps}>{icon && <Icon icon={icon} rotateDeg={rotateIconDeg} />}</button>
    </ToolTip>
  ) : (
    <button className="focus-border" type="button" {...buttonProps}>
      {icon && <Icon icon={icon} rotateDeg={rotateIconDeg} />}
    </button>
  );

export default Button;
