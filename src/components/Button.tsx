import React from 'react';

import Icon, { IconKey } from './Icon';

interface Props extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  icon?: IconKey;
  tooltip?: string;
}

const Button: React.FC<Props> = ({ icon, tooltip, ...buttonProps }) => (
  <button {...buttonProps}>
    {icon && <Icon icon={icon} />}
    {/* TODO: make sure these don't appear as tabbable content */}
    {tooltip && <span className="tooltip">{tooltip}</span>}
  </button>
);

export default Button;
