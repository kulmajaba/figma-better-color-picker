import { FC } from 'react';

import strings from '../../assets/strings';
import { useContrastChecker } from '../../hooks/useContrastChecker';
import Switch from '../Lib/Switch';

const ContrastCheckerSwitch: FC = () => {
  const { contrastCheckerVisible, toggleContrastCheckerVisible } = useContrastChecker();

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
