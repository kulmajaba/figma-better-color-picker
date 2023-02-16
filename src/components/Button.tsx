import React from 'react';

import Icon, { IconKey } from './Icon';
import ToolTip from './ToolTip';

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
    <button {...buttonProps}>{icon && <Icon icon={icon} />}</button>
  );

export default Button;
