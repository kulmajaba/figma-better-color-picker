import React, { useEffect, useState } from 'react';
import strings from '../assets/strings';
import { HSVFloat } from '../types';
import { okhsv_to_srgb } from '../util/colorconversion';
import { createCheckerData } from '../util/imageData';
import ColorInput from './ColorInput/ColorInput';

import './ColorRow.css';
import Icon from './Icon';
import PickerCanvas from './PickerCanvas';

const createColorFill = (width: number, height: number, color: HSVFloat, alpha: number) => {
  const rgb = okhsv_to_srgb(color);
  alpha = Math.round(alpha * 255);
  const data = new Uint8ClampedArray(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const index = i * 4;
    data[index + 0] = rgb.r;
    data[index + 1] = rgb.g;
    data[index + 2] = rgb.b;
    data[index + 3] = alpha;
  }

  return new ImageData(data, width);
};

interface Props {
  hue: number;
  saturation: number;
  value: number;
  alpha: number;
  hueLocked: boolean;
  saturationLocked: boolean;
  valueLocked: boolean;
  alphaLocked: boolean;
  onDelete: () => void;
}

const ColorRow: React.FC<Props> = ({
  hue: hueProp,
  saturation: saturationProp,
  value: valueProp,
  alpha: alphaProp,
  hueLocked,
  saturationLocked,
  valueLocked,
  alphaLocked,
  onDelete
}) => {
  const [hue, setHue] = useState(hueProp);
  const [saturation, setSaturation] = useState(saturationProp);
  const [value, setValue] = useState(valueProp);
  const [alpha, setAlpha] = useState(alphaProp);

  useEffect(() => {
    if (hueLocked) {
      setHue(hueProp);
    }
  }, [hueProp, hueLocked]);

  useEffect(() => {
    if (saturationLocked) {
      setSaturation(saturationProp);
    }
  }, [saturationProp, saturationLocked]);

  useEffect(() => {
    if (valueLocked) {
      setValue(valueProp);
    }
  }, [valueProp, valueLocked]);

  useEffect(() => {
    if (alphaLocked) {
      setAlpha(alphaProp);
    }
  }, [alphaProp, alphaLocked]);

  const hsv: HSVFloat = { h: hue, s: saturation, v: value };

  return (
    <div className="color-row">
      <div className="color-row-sample">
        <PickerCanvas getImageData={(width, height) => createCheckerData(width, height)} />
        <PickerCanvas getImageData={(width, height) => createColorFill(width, height, hsv, alpha)} />
      </div>
      <ColorInput type="hsv" value={hsv} alpha={alpha} />
      <div className="color-row-buttons">
        <button className="small border-none">
          <Icon icon="content_copy" />
          <span className="tooltip">{strings.tooltip.copyColor}</span>
        </button>
        <button className="small border-none">
          <Icon icon="add" />
          <span className="tooltip">{strings.tooltip.addColor}</span>
        </button>
        <button className="small border-none" onClick={onDelete}>
          <Icon icon="delete" />
        </button>
      </div>
    </div>
  );
};

export default ColorRow;
