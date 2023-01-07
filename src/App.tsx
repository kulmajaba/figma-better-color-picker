import React, { useCallback, useState } from 'react';
import './App.css';
import { HSVFloat, XY, XYZero } from './types';
import HuePicker from './components/HuePicker';
import SVPicker from './components/SVPicker';
import { okhsv_to_srgb } from './util/colorconversion';
import AlphaPicker from './components/AlphaPicker';
import { roundToFixedPrecision } from './util/mathUtils';
import ColorInput from './components/ColorInput/ColorInput';
import ColorTable from './components/ColorTable/ColorTable';

enum PickerType {
  Hue = 'HUE',
  SV = 'SV',
  Alpha = 'ALPHA'
}

function App() {
  const [dragging, setDragging] = useState(false);
  const [mousePos, setMousePos] = useState(XYZero);
  const [activePicker, setActivePicker] = useState<PickerType | undefined>(undefined);
  const [hue, setHue] = useState(0);
  const [hueValues, setHueValues] = useState<number[]>([]);
  const [sv, setSv] = useState(XYZero);
  const [alpha, setAlpha] = useState(1);

  /* const onCreate = () => {
    const count = Number(inputRef.current?.value || 0);
    pluginPostMessage({ type: PluginMessageType.CreateRectangles, count });
  }; */

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

  const onSvChange = useCallback((val: XY) => setSv(val), []);
  const onSvMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => onMouseDown(e, PickerType.SV),
    [onMouseDown]
  );

  const onColorInputChange = useCallback((val: HSVFloat) => {
    setHue(val.h);
    setSv({ x: val.s, y: val.v });
  }, []);

  const hsv: HSVFloat = { h: hue, s: sv.x, v: sv.y };
  const rgb = okhsv_to_srgb(hsv);

  const hsvString = `RGB: ${roundToFixedPrecision(rgb.r, 3)}, ${roundToFixedPrecision(
    rgb.g,
    3
  )}, ${roundToFixedPrecision(rgb.b, 3)}, A: ${roundToFixedPrecision(alpha, 3)}`;

  return (
    <main onMouseUp={onMouseUp} onMouseMove={onMouseMove}>
      <section className="pickers">
        {/* TODO: Indicate if picker is run online or offline */}
        <SVPicker
          hue={hue}
          hueValues={hueValues}
          globalValue={mousePos}
          value={sv}
          dragging={activePicker === PickerType.SV}
          onChange={onSvChange}
          onMouseDown={onSvMouseDown}
        />
        <HuePicker
          globalValue={mousePos}
          value={hue}
          dragging={activePicker === PickerType.Hue}
          onChange={(val) => setHue(val)}
          onMouseDown={(e) => onMouseDown(e, PickerType.Hue)}
          onSizeChange={(size) => {
            const newHueValues = new Array(size.width).fill(0).map((_, i) => i / (size.width - 1));
            setHueValues(newHueValues);
          }}
        />
        <AlphaPicker
          color={rgb}
          globalValue={mousePos}
          value={alpha}
          dragging={activePicker === PickerType.Alpha}
          onChange={(val) => setAlpha(val)}
          onMouseDown={(e) => onMouseDown(e, PickerType.Alpha)}
        />
        <p>{hsvString}</p>
        <ColorInput
          type="hsv"
          value={hsv}
          alpha={alpha}
          onColorChange={onColorInputChange}
          onAlphaChange={(val) => setAlpha(val)}
        />
        <ColorInput
          type="hex"
          value={hsv}
          alpha={alpha}
          onColorChange={onColorInputChange}
          onAlphaChange={(val) => setAlpha(val)}
        />
      </section>
      <section>
        <ColorTable hue={hue} saturation={sv.x} value={sv.y} alpha={alpha} />
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
