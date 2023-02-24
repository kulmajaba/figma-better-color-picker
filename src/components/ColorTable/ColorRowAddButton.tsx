import React, { useCallback } from 'react';

import strings from '../../assets/strings';
import { useColorSpace } from '../../hooks/useColorSpace';
import useIsPlugin from '../../hooks/useIsPlugin';
import { pluginPostMessage } from '../../pluginApi';
import { Color, PluginMessageType } from '../../types';
import Button from '../Lib/Button';

interface Props {
  color: Color;
  alpha: number;
}

const ColorRowAddButton: React.FC<Props> = ({ color, alpha }) => {
  const { isFigma } = useIsPlugin();
  const { toSRGB, toComponentRepresentation, name } = useColorSpace();

  // TODO: use a popup input to set the name
  const addColor = useCallback(() => {
    console.log('Add color');
    pluginPostMessage({
      type: PluginMessageType.AddColor,
      payload: {
        color: toSRGB(color),
        alpha,
        colorSpaceName: name,
        componentRepresentation: toComponentRepresentation(color)
      }
    });
  }, [color, alpha, toSRGB, toComponentRepresentation, name]);

  // Clipboard permissions have to be explicitly allowed for iframes and Figma does not currently do so
  if (!isFigma) {
    return null;
  }

  return (
    <Button className="small border-none" icon="add" tooltip={strings.tooltip.addColorToStyles} onClick={addColor} />
  );
};

export default ColorRowAddButton;
