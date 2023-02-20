import React from 'react';

import Icon, { IconKey } from './Icon';
import ToolTip from './ToolTip';

import './Button.css';

interface Props extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  icon?: IconKey;
  tooltip?: string;
  triggerProps?: unknown;
}

const Button: React.FC<Props> = ({ icon, tooltip, triggerProps, ...buttonProps }) =>
  tooltip ? (
    <ToolTip tooltip={tooltip} triggerProps={triggerProps}>
      <button {...buttonProps}>{icon && <Icon icon={icon} />}</button>
    </ToolTip>
  ) : (
    <button className="focus-border" type="button" {...buttonProps}>
      {icon && <Icon icon={icon} />}
    </button>
  );

export default Button;
