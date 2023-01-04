export enum PluginMessageType {
  ClientStorageGet = 'ClientStorageGet'
}

export enum ClientStorageKey {
  SvData = 'SV_DATA'
}

interface PluginMessageBase {
  type: PluginMessageType;
  fromFigma: boolean;
}

export interface PluginMessageGetLocal extends PluginMessageBase {
  type: PluginMessageType.ClientStorageGet;
  key: ClientStorageKey;
}

// Union type for all accepted messages
export type PluginMessage = PluginMessageGetLocal;

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

export const XYZero: XY = { x: 0, y: 0 };

export interface Size {
  width: number;
  height: number;
}

export const SizeZero: Readonly<Size> = { width: 0, height: 0 };

export type XYChangeHandler = (val: XY) => void;

export type ImageDataCreator = (width: number, height: number) => ImageData;
