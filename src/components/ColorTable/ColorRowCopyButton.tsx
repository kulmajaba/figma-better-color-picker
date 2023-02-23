import React, { useCallback } from 'react';
import strings from '../../assets/strings';
import { rgb_to_hex } from '../../color/general';
import { useColorSpace } from '../../hooks/useColorSpace';
import useIsPlugin from '../../hooks/useIsPlugin';
import { Color } from '../../types';
import Button from '../Lib/Button';

interface Props {
  color: Color;
  alpha: number;
}

const ColorRowCopyButton: React.FC<Props> = ({ color, alpha }) => {
  const { isFigma } = useIsPlugin();

  const { toSRGB } = useColorSpace();

  // TODO: format from context
  const onCopy = useCallback(async () => {
    console.log('copy');
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(rgb_to_hex(toSRGB(color)));
        console.log('copy successful');
      } catch (e) {
        console.error(e);
      }
    } else {
      console.warn('Clipboard API not available');
    }
  }, [color, alpha, toSRGB]);

  if (isFigma) {
    return null;
  }

  return (
    <Button className="small border-none" icon="content_copy" tooltip={strings.tooltip.copyColor} onClick={onCopy} />
  );
};

export default ColorRowCopyButton;
