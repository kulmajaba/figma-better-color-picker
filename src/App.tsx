import React, { useState } from 'react';
import './App.css';
import { pluginPostMessage } from './pluginApi';
import { PluginMessageType, XYZero } from './types';
import HuePicker from './components/HuePicker';
import SVPicker from './components/SVPicker';

enum PickerType {
  Hue = 'HUE',
  SV = 'SV'
}

function App() {
  const [dragging, setDragging] = useState(false);
  const [mousePos, setMousePos] = useState(XYZero);
  const [activePicker, setActivePicker] = useState<PickerType | undefined>(undefined);
  const [hue, setHue] = useState(0);
  const [sv, setSv] = useState(XYZero);

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

  return (
    <main onMouseUp={onMouseUp} onMouseMove={onMouseMove}>
      <section>
        <SVPicker
          globalValue={mousePos}
          hue={hue}
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
