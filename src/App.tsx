import React, { MouseEvent, TouchEvent, useCallback, useEffect, useState } from 'react';

import classNames from 'classnames';

import { Color, isMouseEvent, MouseOrTouchEventHandler, PluginMessageType, Size, XY, XYZero } from './types';
import HuePicker from './components/Picker/SliderPicker';
import XYPicker from './components/Picker/XYPicker';
import AlphaPicker from './components/Picker/AlphaPicker';
import { roundToFixedPrecision } from './util/mathUtils';
import ColorInput from './components/ColorInput';
import ColorTable from './components/ColorTable/ColorTable';
import { useColorSpace } from './hooks/useColorSpace';
import { hex_to_rgb } from './color/general';
import ColorSpaceDropDown from './components/Header/ColorSpaceDropDown';
import Button from './components/Lib/Button';
import ContrastCheckerSwitch from './components/Header/ColorCheckerSwitch';
import InfoModal from './components/InfoModal';
import CopyFormatDropDown from './components/Header/CopyFormatDropDown';
import strings from './assets/strings';
import useIsPlugin from './hooks/useIsPlugin';
import { pluginPostMessage } from './pluginApi';

import './App.css';

enum PickerType {
  FirstComponentSlider = 'FIRST_COMPONENT_SLIDER',
  XY = 'XY',
  Alpha = 'ALPHA'
}

const App = () => {
  const [dragging, setDragging] = useState(false);
  const [activePicker, setActivePicker] = useState<PickerType | undefined>(undefined);
  const [mousePos, setMousePos] = useState(XYZero);

  const [firstComponentValues, setFirstComponentValues] = useState<number[]>([]);
  const [firstComponent, setFirstComponent] = useState(0);
  const [xyComponent, setXyComponent] = useState(XYZero);
  const [alpha, setAlpha] = useState(1);
  const [alphaEnabled, setAlphaEnabled] = useState(true);

  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const { fromSRGB, toSRGB, convertFromPrevious, inputLabel } = useColorSpace();
  const { isFigma, isPlugin } = useIsPlugin();

  useEffect(() => {
    window.addEventListener('message', (e) => !e.data.source?.includes('react-devtools') && console.log(e));
  }, []);

  useEffect(() => {
    if (convertFromPrevious) {
      const prevColor: Color = [firstComponent, xyComponent.x, xyComponent.y];
      const [first, x, y] = convertFromPrevious(prevColor);
      setFirstComponent(first);
      setXyComponent({ x, y });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convertFromPrevious]);

  const onMouseMoveOrTouchMove: MouseOrTouchEventHandler = useCallback(
    (e) => {
      if (isMouseEvent(e) && dragging && e.buttons === 0) {
        setDragging(false);
        return;
      }

      if (dragging) {
        isMouseEvent(e) && e.preventDefault();
        // Touch screen support is very rudimentary, multi touch is not handled
        const clientPos = isMouseEvent(e) ? e : e.touches[0];
        setMousePos({ x: clientPos.clientX, y: clientPos.clientY });
      }
    },
    [dragging]
  );

  const onMouseDownOrTouchStart = useCallback((e: MouseEvent | TouchEvent, picker: PickerType) => {
    setActivePicker(picker);
    setDragging(true);
    // Touch screen support is very rudimentary, multi touch is not handled
    const clientPos = isMouseEvent(e) ? e : e.touches[0];
    setMousePos({ x: clientPos.clientX, y: clientPos.clientY });
  }, []);

  const onMouseUpOrTouchEnd = useCallback(() => {
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

  const onXyMouseDownOrTouchStart: MouseOrTouchEventHandler = useCallback(
    (e) => onMouseDownOrTouchStart(e, PickerType.XY),
    [onMouseDownOrTouchStart]
  );

  const onFirstComponentChange = useCallback((val: number) => {
    setFirstComponent(val);
  }, []);

  const onFirstComponentMouseDownOrTouchStart: MouseOrTouchEventHandler = useCallback(
    (e) => onMouseDownOrTouchStart(e, PickerType.FirstComponentSlider),
    [onMouseDownOrTouchStart]
  );

  const onAlphaChange = useCallback((val: number) => {
    setAlpha(val);
  }, []);

  const onAlphaMouseDownOrTouchStart: MouseOrTouchEventHandler = useCallback(
    (e) => onMouseDownOrTouchStart(e, PickerType.Alpha),
    [onMouseDownOrTouchStart]
  );

  const onColorInputChange = useCallback((color: Color) => {
    setFirstComponent(color[0]);
    setXyComponent({ x: color[1], y: color[2] });
  }, []);

  const onEyeDropper = useCallback(async () => {
    if (EyeDropper) {
      try {
        const res = await new EyeDropper().open();
        const color = fromSRGB(hex_to_rgb(res.sRGBHex));
        setFirstComponent(color[0]);
        setXyComponent({ x: color[1], y: color[2] });
      } catch (e) {
        console.log(e);
      }
    }
  }, [fromSRGB]);

  const onSetEditing = useCallback((color: Color, alpha: number, enableAlpha: boolean) => {
    setFirstComponent(color[0]);
    setXyComponent({ x: color[1], y: color[2] });
    setAlpha(alpha);
    setAlphaEnabled(enableAlpha);
  }, []);

  const onShowInfoModal = useCallback(() => setInfoModalVisible(true), []);
  const onCloseInfoModal = useCallback(() => setInfoModalVisible(false), []);

  const onResizeFigmaPlugin = useCallback(
    (width: number) => {
      if (isFigma) {
        pluginPostMessage({ type: PluginMessageType.Resize, payload: { width } });
      }
    },
    [isFigma]
  );

  const color: Color = [firstComponent, xyComponent.x, xyComponent.y];
  const rgb = toSRGB(color);

  const dev = import.meta.env.DEV;
  // prettier-ignore
  const colorString = dev
    ? `Component: ${roundToFixedPrecision(color[0], 3)}, ${roundToFixedPrecision(color[1], 3)}, ${roundToFixedPrecision(color[2], 3)}, A: ${roundToFixedPrecision(alpha, 3)}<br />
RGB: ${roundToFixedPrecision(rgb[0], 3)}, ${roundToFixedPrecision(rgb[1], 3)}, ${roundToFixedPrecision(rgb[2], 3)}`
    : '';

  const containerClassNames = classNames('App', { 'is-plugin': isPlugin });

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={containerClassNames}
      onMouseUp={onMouseUpOrTouchEnd}
      onTouchEnd={onMouseUpOrTouchEnd}
      onTouchCancel={onMouseUpOrTouchEnd}
      onMouseMove={onMouseMoveOrTouchMove}
      onTouchMove={onMouseMoveOrTouchMove}
    >
      <main className="App-main">
        <header className="App-header">
          <div className="App-headerLeft">
            <ColorSpaceDropDown />
            <CopyFormatDropDown />
          </div>
          <div className="App-headerRight">
            <ContrastCheckerSwitch />
            <Button className="Button--borderless" icon="help_outline" onClick={onShowInfoModal} />
          </div>
        </header>
        <section className="App-pickers">
          <XYPicker
            firstComponentValues={firstComponentValues}
            firstComponent={firstComponent}
            globalValue={mousePos}
            value={xyComponent}
            dragging={activePicker === PickerType.XY}
            onChange={onXyChange}
            onMouseDownOrTouchStart={onXyMouseDownOrTouchStart}
          />
          <HuePicker
            globalValue={mousePos}
            value={firstComponent}
            dragging={activePicker === PickerType.FirstComponentSlider}
            onChange={onFirstComponentChange}
            onMouseDownOrTouchStart={onFirstComponentMouseDownOrTouchStart}
            onSizeChange={onFirstComponentPickerSizeChange}
          />
          <AlphaPicker
            color={color}
            globalValue={mousePos}
            value={alpha}
            dragging={activePicker === PickerType.Alpha}
            onChange={onAlphaChange}
            onMouseDownOrTouchStart={onAlphaMouseDownOrTouchStart}
            enabled={alphaEnabled}
          />
          {dev && <div dangerouslySetInnerHTML={{ __html: colorString }} />}
          <div className="App-mainInputs">
            <Button icon="eyedropper" onClick={onEyeDropper} />
            <div className="App-textInputs">
              <label>{strings.label[inputLabel]}</label>
              <ColorInput
                type="component"
                value={color}
                alpha={alpha}
                onColorChange={onColorInputChange}
                onAlphaChange={onAlphaChange}
              />
              <label>{strings.label.hex}</label>
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
      </main>
      <ColorTable
        firstComponent={firstComponent}
        secondComponent={xyComponent.x}
        thirdComponent={xyComponent.y}
        alpha={alpha}
        onSetEditing={onSetEditing}
        onResizeFigmaPlugin={onResizeFigmaPlugin}
      />
      <InfoModal visible={infoModalVisible} onClose={onCloseInfoModal} />
    </div>
  );
};

export default App;
