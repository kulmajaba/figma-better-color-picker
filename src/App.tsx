import React, { useCallback, useEffect, useState } from 'react';

import { Color, Size, XY, XYZero } from './types';
import HuePicker from './components/SliderPicker';
import XYPicker from './components/XYPicker';
import AlphaPicker from './components/AlphaPicker';
import { roundToFixedPrecision } from './util/mathUtils';
import ColorInput from './components/ColorInput/ColorInput';
import ColorTable from './components/ColorTable/ColorTable';
import { useColorSpace } from './hooks/useColorSpace';
import { hex_to_rgb } from './color/general';
import ColorSpaceDropDown from './components/ColorSpaceDropDown';
import Button from './components/Button';

import './App.css';
import ColorMatrix from './components/ColorMatrix';
import { useColorState } from './hooks/useColorState';

enum PickerType {
  FirstComponentSlider = 'FIRST_COMPONENT_SLIDER',
  XY = 'XY',
  Alpha = 'ALPHA'
}

function App() {
  const [dragging, setDragging] = useState(false);
  const [activePicker, setActivePicker] = useState<PickerType | undefined>(undefined);
  const [mousePos, setMousePos] = useState(XYZero);

  const [firstComponentValues, setFirstComponentValues] = useState<number[]>([]);

  const { mainColor, setMainColor, mainAlpha, setMainAlpha } = useColorState();

  const { fromSRGB, toSRGB, convertFromPrevious } = useColorSpace();

  useEffect(() => {
    window.addEventListener('message', (e) => !e.data.source?.includes('react-devtools') && console.log(e));
  }, []);

  useEffect(() => {
    if (convertFromPrevious) {
      const newColor = convertFromPrevious(mainColor);
      setMainColor(newColor);
    }
  }, [convertFromPrevious]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (dragging && e.buttons === 0) {
        setDragging(false);
        return;
      }

      if (dragging) {
        e.preventDefault();
        setMousePos({ x: e.clientX, y: e.clientY });
      }
    },
    [dragging]
  );

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLElement>, picker: PickerType) => {
    setActivePicker(picker);
    setDragging(true);
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const onMouseUp = useCallback(() => {
    setDragging(false);
    setActivePicker(undefined);
  }, []);

  const onFirstComponentPickerSizeChange = useCallback((size: Size) => {
    const newFirstComponentValues = new Array(size.width).fill(0).map((_, i) => i / (size.width - 1));
    setFirstComponentValues(newFirstComponentValues);
  }, []);

  const onXyChange = useCallback((val: XY) => {
    setMainColor([mainColor[0], val.x, val.y]);
  }, []);

  const onXyMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => onMouseDown(e, PickerType.XY),
    [onMouseDown]
  );

  const onFirstComponentChange = useCallback((val: number) => {
    setMainColor([val, mainColor[1], mainColor[2]]);
  }, []);

  const onFirstComponentMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => onMouseDown(e, PickerType.FirstComponentSlider),
    [onMouseDown]
  );

  const onAlphaChange = useCallback((val: number) => {
    setMainAlpha(val);
  }, []);

  const onAlphaMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => onMouseDown(e, PickerType.Alpha),
    [onMouseDown]
  );

  const onColorInputChange = useCallback((color: Color) => {
    setMainColor(color);
  }, []);

  const onEyeDropper = useCallback(async () => {
    if (EyeDropper) {
      try {
        const res = await new EyeDropper().open();
        console.log('Eyedropper color', res.sRGBHex);
        const color = fromSRGB(hex_to_rgb(res.sRGBHex));
        setMainColor(color);
      } catch (e) {
        console.log(e);
      }
    }
  }, []);

  const rgb = toSRGB(mainColor);

  const dev = import.meta.env.DEV;
  // eslint-disable-next-line prettier/prettier
  const colorString = dev ? `Component: ${roundToFixedPrecision(mainColor[0], 3)}, ${roundToFixedPrecision(mainColor[1], 3)}, ${roundToFixedPrecision(mainColor[2], 3)}, A: ${roundToFixedPrecision(mainAlpha, 3)}<br />
RGB: ${roundToFixedPrecision(rgb[0], 3)}, ${roundToFixedPrecision(rgb[1], 3)}, ${roundToFixedPrecision(rgb[2], 3)}`
    : '';

  return (
    <div id="mouse-events" onMouseUp={onMouseUp} onMouseMove={onMouseMove}>
      <main>
        <header>
          <ColorSpaceDropDown />
        </header>
        <section className="pickers">
          <XYPicker
            firstComponentValues={firstComponentValues}
            firstComponent={mainColor[0]}
            globalValue={mousePos}
            value={{ x: mainColor[1], y: mainColor[2] }}
            dragging={activePicker === PickerType.XY}
            onChange={onXyChange}
            onMouseDown={onXyMouseDown}
          />
          <HuePicker
            globalValue={mousePos}
            value={mainColor[0]}
            dragging={activePicker === PickerType.FirstComponentSlider}
            onChange={onFirstComponentChange}
            onMouseDown={onFirstComponentMouseDown}
            onSizeChange={onFirstComponentPickerSizeChange}
          />
          <AlphaPicker
            color={mainColor}
            globalValue={mousePos}
            value={mainAlpha}
            dragging={activePicker === PickerType.Alpha}
            onChange={onAlphaChange}
            onMouseDown={onAlphaMouseDown}
          />
          {dev && <p dangerouslySetInnerHTML={{ __html: colorString }} />}
          <div className="main-inputs">
            <Button icon="eyedropper" onClick={onEyeDropper} />
            <div className="main-inputs-color-inputs">
              <ColorInput
                type="component"
                value={mainColor}
                alpha={mainAlpha}
                onColorChange={onColorInputChange}
                onAlphaChange={onAlphaChange}
              />
              <ColorInput
                type="hex"
                value={mainColor}
                alpha={mainAlpha}
                onColorChange={onColorInputChange}
                onAlphaChange={onAlphaChange}
              />
            </div>
          </div>
        </section>
      </main>
      <section id="color-table">
        <ColorTable />
      </section>
      <ColorMatrix />
    </div>
  );
}

export default App;
