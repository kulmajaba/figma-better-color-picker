import React, { useMemo } from 'react';

import strings from '../../assets/strings';
import { CopyFormat, CopyFormatName, copyFormats, useCopyFormat } from '../../hooks/useCopyFormat';
import useIsPlugin from '../../hooks/useIsPlugin';
import DropDown from '../Lib/DropDown';

const CopyFormatDropDown: React.FC = () => {
  const { name, setCopyFormat } = useCopyFormat();
  const { isFigma } = useIsPlugin();

  const options = useMemo(
    () =>
      (Object.entries(copyFormats) as [CopyFormatName, CopyFormat][]).map(([name, format]) => ({
        label: format.label,
        value: name
      })),
    []
  );

  // Figma does not allow clipboard write currently
  if (isFigma) {
    return null;
  }

  return (
    <DropDown
      name="copyformat"
      label={strings.label.copyFormat}
      options={options}
      value={name}
      onChange={setCopyFormat}
    />
  );
};

export default CopyFormatDropDown;
