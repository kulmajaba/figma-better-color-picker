import { FC, useCallback, useMemo } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import classNames from 'classnames';

import { useContrastChecker } from '../../hooks/useContrastChecker';
import ColorInput from '../ColorInput';
import Button from '../Lib/Button';

import ColorRowAddButton from './ColorRowAddButton';
import ColorRowCopyButton from './ColorRowCopyButton';
import ColorTileButton from './ColorTileButton';
import ContrastCheckerCell from './ContrastCheckerCell';

import { Color, ColorWithAlpha, SetEditingColorCallback } from '../../types';

import './ColorRow.css';

interface Props {
  id: number;
  color: ColorWithAlpha;
  editingColorRow: number | undefined;
  editingContrastColumn: number | undefined;
  contrastColors: Color[];
  onColorChange: (id: number, color: ColorWithAlpha) => void;
  onDelete: (id: number) => void;
  onSetEditing: SetEditingColorCallback;
}

const ColorRow: FC<Props> = ({
  id,
  color,
  editingColorRow,
  editingContrastColumn,
  contrastColors,
  onColorChange: onColorChangeProp,
  onDelete: onDeleteProp,
  onSetEditing: onSetEditingProp
}) => {
  const { contrastCheckerVisible } = useContrastChecker();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const editing = useMemo(() => editingColorRow === id, [editingColorRow, id]);

  const onColorChange = useCallback(
    (newColor: ColorWithAlpha) => {
      onColorChangeProp(id, newColor);
    },
    [onColorChangeProp, id]
  );

  const onSetEditing = useCallback(() => {
    onSetEditingProp(id, undefined, color);
  }, [onSetEditingProp, id, color]);

  const onDelete = useCallback(() => {
    onDeleteProp(id);
  }, [onDeleteProp, id]);

  const contrastRowClassNames = classNames('ColorRow-contrastRow', {
    'is-selected': editing
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <>
      <div className="ColorRow" style={style} {...attributes} ref={setNodeRef}>
        <ColorTileButton color={color} selected={editing} onClick={onSetEditing} {...listeners} />
        <ColorInput type="component" value={color} onColorChange={onColorChange} />
        <div className="ColorRow-buttons">
          <ColorRowCopyButton color={color} />
          <ColorRowAddButton color={color} />
          <Button className="Button--small u-borderNone" icon="delete" onClick={onDelete} />
        </div>
      </div>
      {contrastCheckerVisible && contrastColors.length > 0 && (
        <div className={contrastRowClassNames}>
          {contrastColors.map((contrastColor, i) => (
            <ContrastCheckerCell
              key={i}
              color={color}
              contrastColor={contrastColor}
              editing={editingContrastColumn === i}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ColorRow;
