import React from 'react';

import strings from '../assets/strings';

import { useColorSpace, colorSpaceNames } from '../hooks/useColorSpace';
import DropDown from './Lib/DropDown';

const ColorSpaceDropDown: React.FC = () => {
  const { name, setColorSpace } = useColorSpace();

  return (
    <DropDown
      name="colorspace"
      label={strings.label.colorSpace}
      options={colorSpaceNames}
      value={name}
      onChange={setColorSpace}
    />
  );
};

export default ColorSpaceDropDown;
