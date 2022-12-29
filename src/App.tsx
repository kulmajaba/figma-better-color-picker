import React, { useRef } from 'react';
import './App.css';
import { pluginPostMessage } from './pluginApi';
import { PluginMessageType } from './types';
import HuePicker from './components/HuePicker';

function App() {
  const inputRef = useRef<HTMLInputElement>(null);

  console.log('apua');

  const onCreate = () => {
    const count = Number(inputRef.current?.value || 0);
    pluginPostMessage({ type: PluginMessageType.CreateRectangles, count });
  };

  return (
    <main>
      <section>
        <HuePicker />
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
