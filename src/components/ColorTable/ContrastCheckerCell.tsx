import React from 'react';

import { Color } from '../../types';
import { floorTo2Decimals } from '../../util/mathUtils';
import { useColorSpace } from '../../hooks/useColorSpace';
import { getColorContrast } from '../../util/colorContrast';

interface Props {
  color: Color;
  contrastColor: Color;
}

const ContrastCheckerCell: React.FC<Props> = ({ color, contrastColor }) => {
  const { toSRGB } = useColorSpace();

  return <div>{floorTo2Decimals(getColorContrast(color, contrastColor, toSRGB))} : 1</div>;
};

export default ContrastCheckerCell;
