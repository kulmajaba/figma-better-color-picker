import * as colorSpace from './color';

export type Color = [number, number, number];

export type ColorConverter = (color: Color) => Color;

export type InputValue = string | number | readonly string[] | undefined;

export enum PluginMessageType {}

interface PluginMessageBase {
  type: PluginMessageType;
  fromFigma: boolean;
}

// Union types for all accepted messages
export type PluginMessage = unknown;
export type PluginReturnMessage = unknown;

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

export interface ImageDataCache {
  [key: number]: ImageData;
}

export type ToSRGBFuncName = keyof typeof colorSpace;

export interface ImageDataWorkerMessage {
  width: number;
  height: number;
  firstComponentValues: number[];
  toSRGBFuncName: ToSRGBFuncName;
}

export enum WorkerStatus {
  Idle = 0,
  Working
}
