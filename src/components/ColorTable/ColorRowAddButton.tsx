import React from 'react';

import strings from '../../assets/strings';
import { useColorSpace } from '../../hooks/useColorSpace';
import useIsPlugin from '../../hooks/useIsPlugin';
import { pluginPostMessage } from '../../pluginApi';
import { Color, PluginMessageType } from '../../types';
import Button from '../Button';

interface Props {
  color: Color;
  alpha: number;
}

const ColorRowAddButton: React.FC<Props> = ({ color, alpha }) => {
  const isPlugin = useIsPlugin();
  const { toSRGB, toComponentRepresentation, name } = useColorSpace();

  // TODO: use a popup input to set the name
  const addColor = () => {
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
  };

  if (isPlugin) {
    return <Button className="small border-none" icon="add" tooltip={strings.tooltip.addColor} onClick={addColor} />;
  } else {
    return null;
  }
};

export default ColorRowAddButton;
