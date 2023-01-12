import React, { useCallback } from 'react';
import { useColorSpace } from '../../hooks/useColorSpace';
import { Color, InputValue } from '../../types';
import { roundArrayTo1Decimals, roundTo1Decimals } from '../../util/mathUtils';
import { inputValueToNumber, inputValueToString } from '../../util/parsingUtils';
import { hex_to_rgb, rgb_to_hex } from '../../color/general';
import Input from '../Input';

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

  const handleComponentChange = useCallback(
    (componentIndex: number, value: InputValue) => {
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
    },
    [onColorChange, fromComponentRepresentation]
  );

  const handleFirstComponentChange = useCallback(
    (value: InputValue) => handleComponentChange(0, value),
    [handleComponentChange]
  );

  const handleSecondComponentChange = useCallback(
    (value: InputValue) => handleComponentChange(1, value),
    [handleComponentChange]
  );

  const handleThirdComponentChange = useCallback(
    (value: InputValue) => handleComponentChange(2, value),
    [handleComponentChange]
  );

  const handleHexChange = useCallback(
    (value: InputValue) => {
      try {
        const newValue = inputValueToString(value);
        onColorChange && onColorChange(fromSRGB(hex_to_rgb(newValue)));
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    },
    [onColorChange, fromSRGB]
  );

  const handleAlphaChange = useCallback(
    (value: InputValue) => {
      try {
        const newValue = inputValueToNumber(value);
        onAlphaChange && onAlphaChange(newValue / 100);
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    },
    [onAlphaChange]
  );

  if (type === 'component') {
    const componentRepr = roundArrayTo1Decimals(toComponentRepresentation(valueProp));

    return (
      <div className="color-input-container">
        <Input type="number" value={componentRepr[0]} onChange={handleFirstComponentChange} />
        <Input type="number" value={componentRepr[1]} onChange={handleSecondComponentChange} />
        <Input type="number" value={componentRepr[2]} onChange={handleThirdComponentChange} />
        <Input type="number" value={alpha} onChange={handleAlphaChange} />
      </div>
    );
  } else {
    // Hex input
    const hex = rgb_to_hex(toSRGB(valueProp));

    return (
      <div className="color-input-container">
        <Input className="hex" type="text" value={hex} onChange={handleHexChange} />
        <Input type="number" value={alpha} onChange={handleAlphaChange} />
      </div>
    );
  }
};

export default ColorInput;
