import React, { useCallback, useEffect, useState } from 'react';

import strings from '../../assets/strings';
import { useColorSpace } from '../../hooks/useColorSpace';
import { Color } from '../../types';
import { createCheckerData } from '../../util/imageData';
import { rgb_to_hex } from '../color/general';
import ColorInput from '../ColorInput/ColorInput';
import Icon from '../Icon';
import PickerCanvas from '../PickerCanvas';

import './ColorRow.css';

const createColorFill = (width: number, height: number, color: Color, alpha: number, toSRGB: (val: Color) => Color) => {
  const [r, g, b] = toSRGB(color);
  alpha = Math.round(alpha * 255);
  const data = new Uint8ClampedArray(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const index = i * 4;
    data[index + 0] = r;
    data[index + 1] = g;
    data[index + 2] = b;
    data[index + 3] = alpha;
  }

  return new ImageData(data, width);
};

interface Props {
  firstComponent: number;
  secondComponent: number;
  thirdComponent: number;
  alpha: number;
  firstComponentLocked: boolean;
  secondComponentLocked: boolean;
  thirdComponentLocked: boolean;
  alphaLocked: boolean;
  onDelete: () => void;
}

const ColorRow: React.FC<Props> = ({
  firstComponent: firstComponentProp,
  secondComponent: secondComponentProp,
  thirdComponent: thirdComponentProp,
  alpha: alphaProp,
  firstComponentLocked,
  secondComponentLocked,
  thirdComponentLocked,
  alphaLocked,
  onDelete
}) => {
  const [firstComponent, setFirstComponent] = useState(firstComponentProp);
  const [secondComponent, setSecondComponent] = useState(secondComponentProp);
  const [thirdComponent, setThirdComponent] = useState(thirdComponentProp);
  const [alpha, setAlpha] = useState(alphaProp);

  const { toSRGB } = useColorSpace();

  useEffect(() => {
    if (firstComponentLocked) {
      setFirstComponent(firstComponentProp);
    }
  }, [firstComponentProp, firstComponentLocked]);

  useEffect(() => {
    if (secondComponentLocked) {
      setSecondComponent(secondComponentProp);
    }
  }, [secondComponentProp, secondComponentLocked]);

  useEffect(() => {
    if (thirdComponentLocked) {
      setThirdComponent(thirdComponentProp);
    }
  }, [thirdComponentProp, thirdComponentLocked]);

  useEffect(() => {
    if (alphaLocked) {
      setAlpha(alphaProp);
    }
  }, [alphaProp, alphaLocked]);

  const onColorChange = useCallback(
    (color: Color) => {
      !firstComponentLocked && setFirstComponent(color[0]);
      !secondComponentLocked && setSecondComponent(color[1]);
      !thirdComponentLocked && setThirdComponent(color[2]);
    },
    [firstComponentLocked, secondComponentLocked, thirdComponentLocked]
  );

  const onAlphaChange = useCallback((alpha: number) => !alphaLocked && setAlpha(alpha), [alphaLocked]);

  const onCopy = useCallback(async () => {
    console.log('copy');
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(rgb_to_hex(toSRGB([firstComponent, secondComponent, thirdComponent])));
        console.log('copy successful');
      } catch (e) {
        console.error(e);
      }
    } else {
      console.warn('Clipboard API not available');
    }
  }, [firstComponent, secondComponent, thirdComponent]);

  const color: Color = [firstComponent, secondComponent, thirdComponent];

  return (
    <div className="color-row">
      <div className="color-row-sample">
        <PickerCanvas getImageData={(width, height) => createCheckerData(width, height)} />
        <PickerCanvas getImageData={(width, height) => createColorFill(width, height, color, alpha, toSRGB)} />
      </div>
      <ColorInput
        type="component"
        value={color}
        alpha={alpha}
        onColorChange={onColorChange}
        onAlphaChange={onAlphaChange}
      />
      <div className="color-row-buttons">
        <button className="small border-none" onClick={onCopy}>
          <Icon icon="content_copy" />
          {/* TODO: make sure these don't appear as tabbable content */}
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
