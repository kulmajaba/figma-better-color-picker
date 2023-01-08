import React, { useCallback } from 'react';
import { useColorSpace } from '../../hooks/useColorSpace';
import { Color, InputValue } from '../../types';
import { roundArrayTo1Decimals, roundTo1Decimals } from '../../util/mathUtils';
import { inputValueToNumber, inputValueToString } from '../../util/parsingUtils';
import { hex_to_rgb, rgb_to_hex } from '../color/general';
import ColorComponentInput from './ColorComponentInput';

import './ColorInput.css';

interface Props {
  value: Color;
  alpha: number;
  type?: 'hex' | 'component';
  onColorChange?: (val: Color) => void;
  onAlphaChange?: (val: number) => void;
}

const ColorInput: React.FC<Props> = ({
  value: valueProp,
  alpha: alphaProp,
  type = 'component',
  onColorChange,
  onAlphaChange
}) => {
  const { fromSRGB, toSRGB, fromComponentRepresentation, toComponentRepresentation } = useColorSpace();

  const alpha = roundTo1Decimals(alphaProp * 100);

  const handleComponentChange = useCallback((componentIndex: number, value: InputValue) => {
    try {
      const newComponent = inputValueToNumber(value);
      const newValue = valueProp;
      newValue[componentIndex] = newComponent;
      onColorChange && onColorChange(fromComponentRepresentation(newValue));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, []);

  const handleHexChange = (_: number, value: InputValue) => {
    try {
      const newValue = inputValueToString(value);
      onColorChange && onColorChange(fromSRGB(hex_to_rgb(newValue)));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const handleAlphaChange = (_: number, value: InputValue) => {
    try {
      const newValue = inputValueToNumber(value);
      onAlphaChange && onAlphaChange(newValue / 100);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  if (type === 'component') {
    const hsv = roundArrayTo1Decimals(toComponentRepresentation(valueProp));

    return (
      <div className="color-input-container">
        <ColorComponentInput componentIndex={0} type="number" value={hsv[0]} onChange={handleComponentChange} />
        <ColorComponentInput componentIndex={1} type="number" value={hsv[1]} onChange={handleComponentChange} />
        <ColorComponentInput componentIndex={2} type="number" value={hsv[2]} onChange={handleComponentChange} />
        <ColorComponentInput componentIndex={3} type="number" value={alpha} onChange={handleAlphaChange} />
      </div>
    );
  } else {
    // Hex input
    const hex = rgb_to_hex(toSRGB(valueProp));

    return (
      <div className="color-input-container">
        <ColorComponentInput className="hex" componentIndex={0} type="text" value={hex} onChange={handleHexChange} />
        <ColorComponentInput componentIndex={1} type="number" value={alpha} onChange={handleAlphaChange} />
      </div>
    );
  }
};

export default ColorInput;
