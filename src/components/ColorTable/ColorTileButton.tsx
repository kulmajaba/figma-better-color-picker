import React from 'react';

import classNames from 'classnames';

import { Color, HMTLButtonProps } from '../../types';
import ColorTile from '../ColorTile';

import './ColorTileButton.css';

interface Props extends Omit<HMTLButtonProps, 'color'> {
  color: Color;
  alpha?: number;
  selected: boolean;
}

const ColorTileButton: React.FC<Props> = ({ color, alpha, selected, className, ...buttonProps }) => {
  const buttonClassNames = classNames(
    'color-tile-button focus-border',
    { 'color-tile-button--active': selected },
    className
  );

  return (
    <button className={buttonClassNames} type="button" {...buttonProps}>
      <ColorTile color={color} alpha={alpha} />
    </button>
  );
};

export default ColorTileButton;
