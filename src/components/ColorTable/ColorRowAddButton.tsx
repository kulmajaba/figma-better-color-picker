import React, { useCallback, useEffect, useRef, useState } from 'react';

import strings from '../../assets/strings';
import { useColorSpace } from '../../hooks/useColorSpace';
import useIsPlugin from '../../hooks/useIsPlugin';
import { pluginPostMessage } from '../../pluginApi';
import { Color, InputValue, PluginMessageType } from '../../types';
import ColorTile from '../ColorTile';
import Button from '../Lib/Button';
import Input from '../Lib/Input';
import Modal from '../Lib/Modal';
import Switch from '../Lib/Switch';

import './ColorRowAddButton.css';

interface Props {
  color: Color;
  alpha: number;
}

const ColorRowAddButton: React.FC<Props> = ({ color, alpha }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [colorName, setColorName] = useState('');
  const [updateExistingStyle, setUpdateExistingStyle] = useState(true);

  const { isFigma } = useIsPlugin();
  const { toSRGB, toComponentRepresentation, name: colorSpaceName } = useColorSpace();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (modalVisible) {
      // TODO: does not work with CSS animation
      inputRef.current?.focus();
    }
  }, [modalVisible]);

  const addColor = useCallback(() => {
    console.log('Add color', colorName);
    pluginPostMessage({
      type: PluginMessageType.AddColor,
      payload: {
        color: toSRGB(color),
        alpha,
        colorSpaceName,
        componentRepresentation: toComponentRepresentation(color),
        colorName: colorName !== '' ? colorName : undefined,
        updateExistingStyle
      }
    });
    setModalVisible(false);
  }, [color, alpha, toSRGB, toComponentRepresentation, colorSpaceName, colorName, updateExistingStyle]);

  const onModalOpen = useCallback(() => setModalVisible(true), []);
  const onModalClose = useCallback(() => setModalVisible(false), []);

  const onChange = useCallback((name: InputValue) => {
    setColorName(name !== undefined ? String(name) : '');
  }, []);

  const toggleUpdateExisting = useCallback(() => setUpdateExistingStyle((update) => !update), []);

  if (!isFigma) {
    return null;
  }

  return (
    <>
      <Button
        className="Button--small u-borderNone"
        icon="add"
        tooltip={strings.tooltip.addColorToStyles}
        onClick={onModalOpen}
      />
      <Modal title={strings.figma.addColorModalTitle} visible={modalVisible} onClose={onModalClose}>
        <div className="ColorRowAddButton-modal">
          <div className="ColorRowAddButton-inputRow">
            <ColorTile color={color} alpha={alpha} />
            <Input
              ref={inputRef}
              className="u-textAlignStart"
              onChange={onChange}
              onSubmit={addColor}
              value={colorName}
              selectAllOnFocus
              required={false}
              placeholder={strings.figma.colorNamePlaceholder}
            />
          </div>
          <Switch
            name="updateExistingColor"
            label={strings.figma.updateExistingColor}
            value={updateExistingStyle}
            onClick={toggleUpdateExisting}
          />
          <Button className="Button--primary" onClick={addColor}>
            {strings.figma.createStyle}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ColorRowAddButton;
