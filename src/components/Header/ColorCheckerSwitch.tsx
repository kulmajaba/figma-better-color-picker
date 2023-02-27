import React from 'react';

import strings from '../../assets/strings';
import { useContrastChecker } from '../../hooks/useContrastChecker';
import useIsPlugin from '../../hooks/useIsPlugin';
import Switch from '../Lib/Switch';

const ContrastCheckerSwitch: React.FC = () => {
  const { contrastCheckerVisible, toggleContrastCheckerVisible } = useContrastChecker();
  const { isPlugin } = useIsPlugin();

  if (isPlugin) {
    return null;
  }

  return (
    <Switch
      name="showContrastChecker"
      label={strings.label.contrastChecker}
      value={contrastCheckerVisible}
      onClick={toggleContrastCheckerVisible}
    />
  );
};

export default ContrastCheckerSwitch;
