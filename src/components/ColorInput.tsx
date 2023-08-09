import { FC, useCallback } from 'react';

import { hex_to_rgb, rgb_to_hex } from '../color/general';
import { useColorSpace } from '../hooks/useColorSpace';
import { arraysCloseEnough, clampTo0_1, roundArrayTo1Decimals, roundTo1Decimals } from '../util/mathUtils';
import { inputValueToNumber, inputValueToString } from '../util/parsingUtils';

import Input from './Lib/Input';

import { Color, InputValue } from '../types';

import './ColorInput.css';

interface Props {
  value: Color;
  alpha: number;
  type?: 'hex' | 'component';
  onColorChange: (val: Color) => boolean | void;
  onAlphaChange: (val: number) => boolean | void;
}

const ColorInput: FC<Props> = ({
  value: valueProp,
  alpha: alphaProp,
  type = 'component',
  onColorChange,
  onAlphaChange
}) => {
  const {
    fromSRGB,
    toSRGB,
    fromComponentRepresentation,
    toComponentRepresentation,
    firstComponentAgnostic,
    secondComponentAgnostic,
    thirdComponentAgnostic
  } = useColorSpace();

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
        const newValue = fromSRGB(hex_to_rgb(inputValueToString(value)));
        const aggregateValue = newValue;
        firstComponentAgnostic(newValue) && (aggregateValue[0] = valueProp[0]);
        secondComponentAgnostic(newValue) && (aggregateValue[1] = valueProp[1]);
        thirdComponentAgnostic(newValue) && (aggregateValue[2] = valueProp[2]);

        if (arraysCloseEnough(aggregateValue, valueProp)) {
          return false;
        }

        return onColorChange(aggregateValue) ?? true;
      } catch (e) {
        console.error(e);
        return false;
      }
    },
    [fromSRGB, firstComponentAgnostic, valueProp, secondComponentAgnostic, thirdComponentAgnostic, onColorChange]
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
      <div className="ColorInput">
        <Input
          className="ColorInput-input"
          type="text"
          required
          value={componentRepr[0]}
          onBlur={handleFirstComponentChange}
        />
        <Input
          className="ColorInput-input"
          type="text"
          required
          value={componentRepr[1]}
          onBlur={handleSecondComponentChange}
        />
        <Input
          className="ColorInput-input"
          type="text"
          required
          value={componentRepr[2]}
          onBlur={handleThirdComponentChange}
        />
        <Input className="ColorInput-input" type="number" required value={alpha} onBlur={handleAlphaChange} />
      </div>
    );
  } else {
    // Hex input
    const hex = rgb_to_hex(toSRGB(valueProp));

    return (
      <div className="ColorInput">
        <Input
          className="ColorInput-input ColorInput-input--hex"
          type="text"
          required
          value={hex}
          onBlur={handleHexChange}
        />
        <Input className="ColorInput-input" type="number" required value={alpha} onBlur={handleAlphaChange} />
      </div>
    );
  }
};

export default ColorInput;
