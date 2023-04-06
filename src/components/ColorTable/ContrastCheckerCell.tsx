import { FC } from 'react';

import classNames from 'classnames';

import { useColorSpace } from '../../hooks/useColorSpace';
import { getColorContrast } from '../../util/colorContrast';
import { floorTo2Decimals } from '../../util/mathUtils';

import { Color } from '../../types';

import './ContrastCheckerCell.css';

interface Props {
  color: Color;
  contrastColor: Color;
  editing: boolean;
}

const ContrastCheckerCell: FC<Props> = ({ color, contrastColor, editing }) => {
  const { toSRGB } = useColorSpace();

  const cellClassNames = classNames('ContrastCheckerCell', { 'ContrastCheckerCell--selected': editing });

  return <div className={cellClassNames}>{floorTo2Decimals(getColorContrast(color, contrastColor, toSRGB))} : 1</div>;
};

export default ContrastCheckerCell;
