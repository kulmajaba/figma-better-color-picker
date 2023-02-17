import React from 'react';

import strings from '../assets/strings';
import { useComparisonColors } from '../hooks/useComparisonColors';
import useIsPlugin from '../hooks/useIsPlugin';
import Switch from './Lib/Switch';

const ColorComparisonSwitch: React.FC = () => {
  const { comparisonColorsVisible, toggleComparisonColorsVisible } = useComparisonColors();
  const isPlugin = useIsPlugin();

  if (isPlugin) {
    return null;
  }

  return (
    <Switch
      name="showContrastComparison"
      label={strings.label.showContrastComparison}
      value={comparisonColorsVisible}
      onClick={toggleComparisonColorsVisible}
    />
  );
};

export default ColorComparisonSwitch;
