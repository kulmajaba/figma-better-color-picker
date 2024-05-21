import { FC, useCallback, useEffect, useRef, useState } from 'react';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';

import strings from '../../assets/strings';
import { rgb_to_hex, rgb_to_rgba, rgba_to_rgb } from '../../color/general';
import { useUndoHistory } from '../../hooks/undoHistory';
import { useColorSpace } from '../../hooks/useColorSpace';
import { useContrastChecker } from '../../hooks/useContrastChecker';
import useMountedEffect from '../../hooks/useMountedEffect';
import Button from '../Lib/Button';
import ToolTip from '../Lib/ToolTip';

import ColorRow from './ColorRow';
import ColorTileButton from './ColorTileButton';
import LockButton from './LockButton';

import { Color, ColorWithAlpha, RowColor, SetEditingColorCallback } from '../../types';

import './ColorTable.css';

interface Props {
  firstComponent: number;
  secondComponent: number;
  thirdComponent: number;
  alpha: number;
  dragging: boolean;
  onSetEditing: (color: ColorWithAlpha, enableAlpha: boolean) => void;
  onResizeFigmaPlugin: (width: number) => void;
}

const updateColor = (
  color: ColorWithAlpha,
  updateTo: ColorWithAlpha,
  firstComponentLocked: boolean,
  secondComponentLocked: boolean,
  thirdComponentLocked: boolean,
  alphaLocked: boolean
): ColorWithAlpha => {
  const newColor = color.slice() as ColorWithAlpha;
  if (firstComponentLocked) {
    newColor[0] = updateTo[0];
  }
  if (secondComponentLocked) {
    newColor[1] = updateTo[1];
  }
  if (thirdComponentLocked) {
    newColor[2] = updateTo[2];
  }
  if (alphaLocked) {
    newColor[3] = updateTo[3];
  }
  return newColor;
};

const updateRowColors = (
  rowColors: RowColor[],
  editingKey: number | undefined,
  color: ColorWithAlpha,
  firstComponentLocked: boolean,
  secondComponentLocked: boolean,
  thirdComponentLocked: boolean,
  alphaLocked: boolean
): RowColor[] => {
  if (firstComponentLocked || secondComponentLocked || thirdComponentLocked || alphaLocked) {
    // Update all colors in rowColors according to locks
    const newColors = rowColors.map((row) => {
      const newColor = updateColor(
        row.color,
        color,
        firstComponentLocked,
        secondComponentLocked,
        thirdComponentLocked,
        alphaLocked
      );
      return { id: row.id, color: newColor };
    });
    // Update entire color for the selected row
    editingKey !== undefined &&
      (newColors[newColors.findIndex((row) => row.id === editingKey)].color = color.slice() as ColorWithAlpha);

    return newColors;
  } else if (editingKey !== undefined) {
    // Update single row in rowColors
    const newColors = rowColors.slice();
    newColors[newColors.findIndex((row) => row.id === editingKey)].color = color.slice() as ColorWithAlpha;
    return newColors;
  } else {
    return rowColors;
  }
};

const ColorTable: FC<Props> = ({
  firstComponent,
  secondComponent,
  thirdComponent,
  alpha,
  dragging,
  onSetEditing: onSetEditingProp,
  onResizeFigmaPlugin
}) => {
  const [firstComponentLocked, setFirstComponentLocked] = useState(true);
  const [secondComponentLocked, setSecondComponentLocked] = useState(true);
  const [thirdComponentLocked, setThirdComponentLocked] = useState(true);
  const [alphaLocked, setAlphaLocked] = useState(true);

  // dndkit will not work for an item whose id is 0
  const [rowColors, setRowColors] = useState<RowColor[]>([{ id: 1, color: [0, 0, 0, 1] }]);
  const [contrastColors, setContrastColors] = useState<Color[]>([[0, 0, 0]]);
  const [[editingRowKey, editingContrastKey], setEditingRow] = useState<[number | undefined, number | undefined]>([
    1,
    undefined
  ]);
  const [awaitingHistoryCommit, setAwaitingHistoryCommit] = useState(false);

  const { name: colorSpaceName, componentShortNames, toSRGB, convertFromPrevious } = useColorSpace();
  const { contrastCheckerVisible } = useContrastChecker();
  const { commitHistory } = useUndoHistory();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editingContrastKey !== undefined) {
      setContrastColors((colors) => {
        const newColors = colors.slice();
        newColors[editingContrastKey] = [firstComponent, secondComponent, thirdComponent];
        return newColors;
      });
    } else {
      setRowColors((prevRowColors) =>
        updateRowColors(
          prevRowColors,
          editingRowKey,
          [firstComponent, secondComponent, thirdComponent, alpha],
          firstComponentLocked,
          secondComponentLocked,
          thirdComponentLocked,
          alphaLocked
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    firstComponent,
    secondComponent,
    thirdComponent,
    alpha,
    firstComponentLocked,
    secondComponentLocked,
    thirdComponentLocked,
    alphaLocked
  ]);

  useEffect(() => {
    console.log('dragging', dragging);
    if (!dragging) {
      setAwaitingHistoryCommit(true);
    }
  }, [dragging]);

  useEffect(() => {
    if (awaitingHistoryCommit) {
      commitHistory(rowColors, contrastColors, colorSpaceName);
      setAwaitingHistoryCommit(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [awaitingHistoryCommit]);

  useEffect(() => {
    if (convertFromPrevious) {
      setRowColors((colors) =>
        colors.map((row) => ({ id: row.id, color: [...convertFromPrevious(rgba_to_rgb(row.color)), row.color[3]] }))
      );
      setContrastColors((colors) => colors.map(convertFromPrevious));
      setAwaitingHistoryCommit(true);
    }
  }, [convertFromPrevious]);

  useMountedEffect(() => {
    containerRef.current && onResizeFigmaPlugin(containerRef.current.scrollWidth);
  }, [contrastColors.length, contrastCheckerVisible, rowColors.length]);

  const toggleFirstComponentLocked = useCallback(() => setFirstComponentLocked((locked) => !locked), []);

  const toggleSecondComponentLocked = useCallback(() => setSecondComponentLocked((locked) => !locked), []);

  const toggleThirdComponentLocked = useCallback(() => setThirdComponentLocked((locked) => !locked), []);

  const toggleAlphaLocked = useCallback(() => setAlphaLocked((locked) => !locked), []);

  const addRow = useCallback(() => {
    setRowColors((prevRowColors) =>
      prevRowColors.concat({
        id: prevRowColors.length > 0 ? Math.max(...prevRowColors.map((row) => row.id)) + 1 : 0,
        color: [firstComponent, secondComponent, thirdComponent, alpha]
      })
    );
    setAwaitingHistoryCommit(true);
  }, [alpha, firstComponent, secondComponent, thirdComponent]);

  // TODO: Pick the next available row and set as editingRow
  const deleteRow = useCallback((id: number) => {
    setRowColors((prevRowColors) => prevRowColors.filter((k) => k.id !== id));
    setAwaitingHistoryCommit(true);
  }, []);

  const onSetEditing: SetEditingColorCallback = useCallback(
    (colorRow, contrastColumn, newColor) => {
      setEditingRow([colorRow, contrastColumn]);
      onSetEditingProp(newColor, colorRow !== undefined);
    },
    [onSetEditingProp]
  );

  const addContrastColor = useCallback(() => {
    // TODO: what happens after color space change?
    setContrastColors((colors) => colors.concat([[firstComponent, secondComponent, thirdComponent]]));
    setAwaitingHistoryCommit(true);
  }, [firstComponent, secondComponent, thirdComponent]);

  const deleteContrastColor = useCallback((index: number) => {
    setContrastColors((colors) => colors.filter((_, i) => i !== index));
    // TODO: make sure color changes correctly if this is done
    // setEditingRow(([rowKey, contrastKey]) => [rowKey, contrastKey === index ? undefined : contrastKey]);
    setAwaitingHistoryCommit(true);
  }, []);

  const onDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over === null) {
      return;
    }

    if (active.id !== over.id) {
      setRowColors((prevRowColors) => {
        const oldIndex = prevRowColors.findIndex((row) => row.id === active.id);
        const newIndex = prevRowColors.findIndex((row) => row.id === over.id);

        return arrayMove(prevRowColors, oldIndex, newIndex);
      });
      setAwaitingHistoryCommit(true);
    }
  }, []);

  const onColorChange = (id: number, color: ColorWithAlpha) => {
    setRowColors((prevRowColors) => {
      const newColors = prevRowColors.slice();
      newColors[newColors.findIndex((row) => row.id === id)].color = color;
      return newColors;
    });
    setAwaitingHistoryCommit(true);
  };

  const colorRows = rowColors.map((row) => (
    <ColorRow
      key={row.id}
      id={row.id}
      color={row.color}
      editingColorRow={editingRowKey}
      editingContrastColumn={editingContrastKey}
      contrastColors={contrastColors}
      onColorChange={onColorChange}
      onDelete={deleteRow}
      onSetEditing={onSetEditing}
    />
  ));

  return (
    <section className="ColorTable" ref={containerRef}>
      <div className="ColorTable-header">
        <div className="ColorTable-lockButtonRow">
          <LockButton locked={firstComponentLocked} onClick={toggleFirstComponentLocked}>
            {componentShortNames[0]}
          </LockButton>
          <LockButton locked={secondComponentLocked} onClick={toggleSecondComponentLocked}>
            {componentShortNames[1]}
          </LockButton>
          <LockButton locked={thirdComponentLocked} onClick={toggleThirdComponentLocked}>
            {componentShortNames[2]}
          </LockButton>
          <LockButton locked={alphaLocked} onClick={toggleAlphaLocked}>
            A
          </LockButton>
        </div>
        <div className="ColorTable-headerRight">
          <Button icon="double_arrow" rotateIconDeg={90} onClick={addRow} tooltip={strings.tooltip.addColorRow} />
          {contrastCheckerVisible && (
            <Button icon="double_arrow" onClick={addContrastColor} tooltip={strings.tooltip.addColorToChecker} />
          )}
        </div>
      </div>
      {contrastCheckerVisible && contrastColors.length > 0 && (
        <div className="ColorTable-contrastHeader">
          {contrastColors.map((contrastColor, i) => (
            <div className="ColorTable-contrastHeaderCell" key={i}>
              <Button
                className="Button--small u-borderNone"
                icon="delete"
                tooltip={strings.tooltip.deleteColorFromChecker}
                onClick={() => deleteContrastColor(i)}
              />
              <ToolTip className="ToolTip--immediate" tooltip={rgb_to_hex(toSRGB(contrastColor))}>
                <ColorTileButton
                  color={contrastColor}
                  selected={i === editingContrastKey}
                  onClick={() => onSetEditing(undefined, i, rgb_to_rgba(contrastColor, 1))}
                />
              </ToolTip>
            </div>
          ))}
        </div>
      )}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={[]} strategy={verticalListSortingStrategy}>
          {colorRows}
        </SortableContext>
      </DndContext>
    </section>
  );
};

export default ColorTable;
