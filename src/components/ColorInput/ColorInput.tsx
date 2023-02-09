import React, { useCallback } from 'react';

import { useColorSpace } from '../../hooks/useColorSpace';
import { Color, InputValue } from '../../types';
import { clampTo0_1, roundArrayTo1Decimals, roundTo1Decimals } from '../../util/mathUtils';
import { inputValueToNumber, inputValueToString } from '../../util/parsingUtils';
import { hex_to_rgb, rgb_to_hex } from '../../color/general';
import Input from '../Input';

import './ColorInput.css';

interface Props {
  value: Color;
  alpha: number;
  type?: 'hex' | 'component';
  onColorChange: (val: Color) => boolean | void;
  onAlphaChange: (val: number) => boolean | void;
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
        const newComponentColor: Color = [0, 0, 0];
        newComponentColor[componentIndex] = inputValueToNumber(value);
        const newComponent = clampTo0_1(fromComponentRepresentation(newComponentColor)[componentIndex]);

        if (newComponent !== valueProp[componentIndex]) {
          const newValue = valueProp;
          newValue[componentIndex] = newComponent;

          return onColorChange(newValue) ?? true;
        }
        return false;
      } catch (e) {
        console.error(e);
        return false;
      }
    },
    [valueProp, onColorChange, fromComponentRepresentation]
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
        return onColorChange(fromSRGB(hex_to_rgb(newValue))) ?? true;
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
        return onAlphaChange(clampTo0_1(newValue / 100)) ?? true;
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
        <Input type="number" required value={componentRepr[0]} onChange={handleFirstComponentChange} />
        <Input type="number" required value={componentRepr[1]} onChange={handleSecondComponentChange} />
        <Input type="number" required value={componentRepr[2]} onChange={handleThirdComponentChange} />
        <Input type="number" required value={alpha} onChange={handleAlphaChange} />
      </div>
    );
  } else {
    // Hex input
    const hex = rgb_to_hex(toSRGB(valueProp));

    return (
      <div className="color-input-container">
        <Input className="hex" type="text" required value={hex} onChange={handleHexChange} />
        <Input type="number" required value={alpha} onChange={handleAlphaChange} />
      </div>
    );
  }
};

export default ColorInput;
