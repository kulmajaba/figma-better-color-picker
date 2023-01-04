export enum PluginMessageType {
  EyeDropper = 'EyeDropper'
}

interface PluginMessageBase {
  type: PluginMessageType;
  fromFigma: boolean;
}

export interface OpenEyeDropper extends PluginMessageBase {
  type: PluginMessageType.EyeDropper;
  fromFigma: false;
}

export interface EyeDropperResult extends PluginMessageBase {
  type: PluginMessageType.EyeDropper;
  value: string;
  fromFigma: true;
}

// Union types for all accepted messages
export type PluginMessage = OpenEyeDropper;
export type PluginReturnMessage = EyeDropperResult;

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

export interface XY {
  x: number;
  y: number;
}

export const XYZero: Readonly<XY> = { x: 0, y: 0 };

export interface Size {
  width: number;
  height: number;
}

export const SizeZero: Readonly<Size> = { width: 0, height: 0 };

export type XYChangeHandler = (val: XY) => void;

export type ImageDataCreator = (width: number, height: number) => ImageData;
