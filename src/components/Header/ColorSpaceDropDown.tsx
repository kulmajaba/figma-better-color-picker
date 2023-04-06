import { FC, useMemo } from 'react';

import strings from '../../assets/strings';
import { useColorSpace, colorSpaces, ColorSpaceName, ColorSpace } from '../../hooks/useColorSpace';
import DropDown from '../Lib/DropDown';

const ColorSpaceDropDown: FC = () => {
  const { name, setColorSpace } = useColorSpace();

  const options = useMemo(
    () =>
      (Object.entries(colorSpaces) as [ColorSpaceName, ColorSpace][]).map(([spaceName, space]) => ({
        label: space.label,
        value: spaceName
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
