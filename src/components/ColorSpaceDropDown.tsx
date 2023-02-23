import React, { useMemo } from 'react';

import strings from '../assets/strings';
import { useColorSpace, colorSpaces, ColorSpaceName, ColorSpace } from '../hooks/useColorSpace';
import DropDown from './Lib/DropDown';

const ColorSpaceDropDown: React.FC = () => {
  const { name, setColorSpace } = useColorSpace();

  const options = useMemo(
    () =>
      (Object.entries(colorSpaces) as [ColorSpaceName, ColorSpace][]).map(([name, space]) => ({
        label: space.label,
        value: name
      })),
    []
  );

  return (
    <DropDown
      name="colorspace"
      label={strings.label.colorSpace}
      options={options}
      value={name}
      onChange={setColorSpace}
    />
  );
};

export default ColorSpaceDropDown;
