import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import { Color, Size, XY, XYZero } from './types';
import HuePicker from './components/SliderPicker';
import XYPicker from './components/XYPicker';
import AlphaPicker from './components/AlphaPicker';
import { roundToFixedPrecision } from './util/mathUtils';
import ColorInput from './components/ColorInput/ColorInput';
import ColorTable from './components/ColorTable/ColorTable';
import Icon from './components/Icon';
import { useColorSpace } from './hooks/useColorSpace';
import { hex_to_rgb } from './components/color/general';

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
  const [firstComponent, setFirstComponent] = useState(0);
  const [xyComponent, setXyComponent] = useState(XYZero);
  const [alpha, setAlpha] = useState(1);

  const { fromSRGB, toSRGB } = useColorSpace();

  /* const onCreate = () => {
    const count = Number(inputRef.current?.value || 0);
    pluginPostMessage({ type: PluginMessageType.CreateRectangles, count });
  }; */

  useEffect(() => {
    window.addEventListener('message', (e) => console.log(e));
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (dragging && e.buttons === 0) {
        setDragging(false);
        return;
      }

      dragging && setMousePos({ x: e.clientX, y: e.clientY });
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
    setXyComponent(val);
  }, []);

  const onXyMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => onMouseDown(e, PickerType.XY),
    [onMouseDown]
  );

  const onFirstComponentChange = useCallback((val: number) => {
    setFirstComponent(val);
  }, []);

  const onFirstComponentMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => onMouseDown(e, PickerType.FirstComponentSlider),
    [onMouseDown]
  );

  const onAlphaChange = useCallback((val: number) => {
    setAlpha(val);
  }, []);

  const onAlphaMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => onMouseDown(e, PickerType.Alpha),
    [onMouseDown]
  );

  const onColorInputChange = useCallback((color: Color) => {
    setFirstComponent(color[0]);
    setXyComponent({ x: color[1], y: color[2] });
  }, []);

  const onEyeDropper = useCallback(async () => {
    if (EyeDropper) {
      console.log(new EyeDropper());
      try {
        const res = await new EyeDropper().open();
        console.log(res.sRGBHex);
        const color = fromSRGB(hex_to_rgb(res.sRGBHex));
        setFirstComponent(color[0]);
        setXyComponent({ x: color[1], y: color[2] });
      } catch (e) {
        console.log(e);
      }
    }
  }, []);

  const color: Color = [firstComponent, xyComponent.x, xyComponent.y];
  const rgb = toSRGB(color);

  // eslint-disable-next-line prettier/prettier
  const colorString = `Component: ${roundToFixedPrecision(color[0], 3)}, ${roundToFixedPrecision(color[1], 3)}, ${roundToFixedPrecision(color[2], 3)}, A: ${roundToFixedPrecision(alpha, 3)}<br />
  RGB: ${roundToFixedPrecision(rgb[0], 3)}, ${roundToFixedPrecision(rgb[1], 3)}, ${roundToFixedPrecision(rgb[2], 3)}`;

  return (
    <main onMouseUp={onMouseUp} onMouseMove={onMouseMove}>
      <section className="pickers">
        {/* TODO: Indicate if picker is run online or offline */}
        <XYPicker
          firstComponentValues={firstComponentValues}
          firstComponent={firstComponent}
          globalValue={mousePos}
          value={xyComponent}
          dragging={activePicker === PickerType.XY}
          onChange={onXyChange}
          onMouseDown={onXyMouseDown}
        />
        <HuePicker
          globalValue={mousePos}
          value={firstComponent}
          dragging={activePicker === PickerType.FirstComponentSlider}
          onChange={onFirstComponentChange}
          onMouseDown={onFirstComponentMouseDown}
          onSizeChange={onFirstComponentPickerSizeChange}
        />
        <AlphaPicker
          color={color}
          globalValue={mousePos}
          value={alpha}
          dragging={activePicker === PickerType.Alpha}
          onChange={onAlphaChange}
          onMouseDown={onAlphaMouseDown}
        />
        <p dangerouslySetInnerHTML={{ __html: colorString }} />
        <div className="main-inputs">
          <button onClick={onEyeDropper}>
            <Icon icon="eyedropper" />
          </button>
          <div className="main-inputs-color-inputs">
            <ColorInput
              type="component"
              value={color}
              alpha={alpha}
              onColorChange={onColorInputChange}
              onAlphaChange={onAlphaChange}
            />
            <ColorInput
              type="hex"
              value={color}
              alpha={alpha}
              onColorChange={onColorInputChange}
              onAlphaChange={onAlphaChange}
            />
          </div>
        </div>
      </section>
      <section>
        <ColorTable
          firstComponent={firstComponent}
          secondComponent={xyComponent.x}
          thirdComponent={xyComponent.y}
          alpha={alpha}
        />
      </section>
      {/* <section>
        <input id="input" type="number" min="0" ref={inputRef} />
        <label htmlFor="input">Rectangle Count</label>
      </section>
      <footer>
        <button className="brand" onClick={onCreate}>
          Create
        </button>
      </footer> */}
    </main>
  );
}

export default App;
