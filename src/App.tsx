import React, { useState } from 'react';
import './App.css';
import { HSVFloat, XYZero } from './types';
import HuePicker from './components/HuePicker';
import SVPicker from './components/SVPicker';
import { okhsv_to_srgb } from './util/colorconversion';
import AlphaPicker from './components/AlphaPicker';
import { roundTo2Decimals } from './util/mathUtils';
import ColorInput from './components/ColorInput';

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

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (dragging && e.buttons === 0) {
      setDragging(false);
      return;
    }

    dragging && setMousePos({ x: e.clientX, y: e.clientY });
  };

  const onMouseDown = (e: React.MouseEvent<HTMLElement>, picker: PickerType) => {
    setActivePicker(picker);
    setDragging(true);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const onMouseUp = () => {
    setDragging(false);
    setActivePicker(undefined);
  };

  const onColorInputChange = (val: HSVFloat) => {
    setHue(val.h);
    setSv({ x: val.s, y: val.v });
  };

  const hsv: HSVFloat = { h: hue, s: sv.x, v: sv.y };
  const rgb = okhsv_to_srgb(hsv);

  return (
    <main onMouseUp={onMouseUp} onMouseMove={onMouseMove}>
      <section className="pickers">
        <SVPicker
          hue={hue}
          hueValues={hueValues}
          globalValue={mousePos}
          value={sv}
          dragging={activePicker === PickerType.SV}
          onChange={(val) => setSv(val)}
          onMouseDown={(e) => onMouseDown(e, PickerType.SV)}
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
        <p>{`HSV: ${hsv.h}, ${hsv.s}, ${hsv.v}, A: ${roundTo2Decimals(alpha)}`}</p>
      </section>
      <form>
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
      </form>
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
