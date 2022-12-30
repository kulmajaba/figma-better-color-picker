import React, { useState } from 'react';
import './App.css';
import { pluginPostMessage } from './pluginApi';
import { ChangeDirections, PluginMessageType, XY, XYZero } from './types';
import HuePicker from './components/HuePicker';

enum PickerType {
  Hue = 'HUE'
}

function App() {
  const [dragging, setDragging] = useState(false);
  const [mousePos, setMousePos] = useState<XY>(XYZero);
  const [activePicker, setActivePicker] = useState<PickerType | undefined>(undefined);
  const [hue, setHue] = useState<XY>(XYZero);

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
        <HuePicker
          globalValue={mousePos}
          value={hue}
          dragging={activePicker === PickerType.Hue}
          activeDirections={ChangeDirections.Horizontal}
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
