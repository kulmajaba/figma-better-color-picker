import { FC, useCallback } from 'react';

import strings from '../../assets/strings';
import { useColorSpace } from '../../hooks/useColorSpace';
import { useCopyFormat } from '../../hooks/useCopyFormat';
import useIsPlugin from '../../hooks/useIsPlugin';
import Button from '../Lib/Button';

import { Color } from '../../types';

interface Props {
  color: Color;
  alpha: number;
}

const ColorRowCopyButton: FC<Props> = ({ color, alpha }) => {
  const { isFigma } = useIsPlugin();

  const { toSRGB } = useColorSpace();
  const { toCopyFormat } = useCopyFormat();

  const onCopy = useCallback(async () => {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(toCopyFormat([...toSRGB(color), alpha]));
      } catch (e) {
        console.error(e);
      }
    } else {
      console.warn('Clipboard API not available');
    }
  }, [color, alpha, toSRGB, toCopyFormat]);

  // Figma does not allow clipboard write currently
  if (isFigma) {
    return null;
  }

  return (
    <Button
      className="Button--small u-borderNone"
      icon="content_copy"
      tooltip={strings.tooltip.copyColor}
      onClick={onCopy}
    />
  );
};

export default ColorRowCopyButton;
