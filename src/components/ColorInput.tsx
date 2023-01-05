import React from 'react';
import { HSV, HSVFloat, InputValue } from '../types';
import {
  hex_to_rgb,
  hsvfloat_to_hsv,
  hsv_to_hsvfloat,
  okhsv_to_srgb,
  rgb_to_hex,
  srgb_to_okhsv
} from '../util/colorconversion';
import { roundObjectValuesTo1Decimals, roundTo1Decimals } from '../util/mathUtils';
import { inputValueToNumber, inputValueToString } from '../util/parsingUtils';
import Input from './Input';

interface Props {
  value: HSVFloat;
  alpha: number;
  type?: 'hex' | 'hsv';
  onColorChange?: (val: HSVFloat) => void;
  onAlphaChange?: (val: number) => void;
}

const ColorInput: React.FC<Props> = ({
  value: valueProp,
  alpha: alphaProp,
  type = 'hsv',
  onColorChange,
  onAlphaChange
}) => {
  const hsv: HSV = roundObjectValuesTo1Decimals(hsvfloat_to_hsv(valueProp));
  const hex = rgb_to_hex(okhsv_to_srgb(valueProp));
  const alpha = roundTo1Decimals(alphaProp * 100);

  const handleHsvChange = (component: keyof HSVFloat, value: InputValue) => {
    try {
      const newValue = inputValueToNumber(value);
      onColorChange && onColorChange(hsv_to_hsvfloat({ ...hsvfloat_to_hsv(valueProp), [component]: newValue }));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const handleHexChange = (value: InputValue) => {
    try {
      const newValue = inputValueToString(value);
      onColorChange && onColorChange(srgb_to_okhsv(hex_to_rgb(newValue)));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const handleAlphaChange = (value: InputValue) => {
    try {
      const newValue = inputValueToNumber(value);
      onAlphaChange && onAlphaChange(newValue / 100);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const HSVComponentInput: React.FC<{ component: keyof HSVFloat }> = ({ component }) => (
    <Input
      name={component}
      type="number"
      value={hsv[component]}
      onChange={(value) => handleHsvChange(component, value)}
    />
  );

  const HexInput: React.FC = () => <Input name="hex" type="text" value={hex} onChange={handleHexChange} />;

  const AlphaInput: React.FC = () => <Input name="alpha" type="number" value={alpha} onChange={handleAlphaChange} />;

  if (type === 'hsv') {
    return (
      <div className="input-container">
        <HSVComponentInput component="h" />
        <HSVComponentInput component="s" />
        <HSVComponentInput component="v" />
        <AlphaInput />
      </div>
    );
  } else {
    // Hex input
    return (
      <div className="input-container">
        <HexInput />
        <AlphaInput />
      </div>
    );
  }
};

export default ColorInput;
