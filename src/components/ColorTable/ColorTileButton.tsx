import React from 'react';

import classNames from 'classnames';

import { Color, HMTLButtonProps } from '../../types';
import ColorTile from '../ColorTile';
import Button from '../Lib/Button';

import './ColorTileButton.css';

interface Props extends Omit<HMTLButtonProps, 'color'> {
  color: Color;
  alpha?: number;
  selected: boolean;
}

const ColorTileButton: React.FC<Props> = ({ color, alpha, selected, className, ...buttonProps }) => {
  const buttonClassNames = classNames('ColorTileButton u-focusBorder', className, { 'is-active': selected });

  return (
    <Button className={buttonClassNames} {...buttonProps}>
      <ColorTile color={color} alpha={alpha} />
    </Button>
  );
};

export default ColorTileButton;
