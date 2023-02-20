import React from 'react';

import { Color } from '../../types';
import { floorTo2Decimals } from '../../util/mathUtils';
import { useColorSpace } from '../../hooks/useColorSpace';
import { getColorContrast } from '../../util/colorContrast';

interface Props {
  color: Color;
  comparisonColor: Color;
}

const ColorComparisonCell: React.FC<Props> = ({ color, comparisonColor }) => {
  const { toSRGB } = useColorSpace();

  return <div>{floorTo2Decimals(getColorContrast(color, comparisonColor, toSRGB))} : 1</div>;
};

export default ColorComparisonCell;
