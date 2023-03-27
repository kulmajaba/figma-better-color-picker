import React from 'react';

import classNames from 'classnames';

import { Color } from '../../types';
import { floorTo2Decimals } from '../../util/mathUtils';
import { useColorSpace } from '../../hooks/useColorSpace';
import { getColorContrast } from '../../util/colorContrast';

import './ContrastCheckerCell.css';

interface Props {
  color: Color;
  contrastColor: Color;
  editing: boolean;
}

const ContrastCheckerCell: React.FC<Props> = ({ color, contrastColor, editing }) => {
  const { toSRGB } = useColorSpace();

  const cellClassNames = classNames('ContrastCheckerCell', { 'ContrastCheckerCell--selected': editing });

  return <div className={cellClassNames}>{floorTo2Decimals(getColorContrast(color, contrastColor, toSRGB))} : 1</div>;
};

export default ContrastCheckerCell;
