export enum PluginMessageType {
  CreateRectangles = 'createRectangles'
}

export interface PluginMessageCreateRectangles {
  type: PluginMessageType.CreateRectangles;
  count: number;
}

export type PluginMessage = PluginMessageCreateRectangles;

export enum Direction {
  Horizontal = 'HORIZONTAL',
  Vertical = 'VERTICAL'
}

export enum HorizontalChangeDirection {
  LeftToRight = 'LEFT_TO_RIGHT',
  RightToLeft = 'RIGHT_TO_LEFT'
}

export enum VerticalChangeDirection {
  TopToBottom = 'TOP_TO_BOTTOM',
  BottomToTop = 'BOTTOM_TO_TOP'
}

export enum ChangeDirections {
  HorizontalAndVertical = 'HORIZONTAL_AND_VERTICAL',
  Horizontal = 'HORIZONTAL',
  Vertical = 'VERTICAL'
}

export interface XY {
  x: number;
  y: number;
}

export const XYZero: XY = { x: 0, y: 0 };

export type XYChangeHandler = (val: XY) => void;
