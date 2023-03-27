import { MouseEvent, TouchEvent } from 'react';

import * as colorSpace from './color';

export type Color = [number, number, number];
export type ColorWithAlpha = [number, number, number, number];

export type ColorConverter = (color: Color) => Color;

export type InputValue = string | number | readonly string[] | undefined;

export enum PluginMessageType {
  AddColor = 'ADD_COLOR',
  Resize = 'RESIZE'
}

interface PluginMessageBase {
  type: PluginMessageType;
  fromFigma: boolean;
}

export interface PluginMessageAddColor extends PluginMessageBase {
  type: PluginMessageType.AddColor;
  payload: {
    color: Color;
    alpha: number;
    colorSpaceName: string;
    componentRepresentation: Color;
    colorName: string | undefined;
    updateExistingStyle: boolean;
  };
  fromFigma: false;
}

export interface PluginMessageResize extends PluginMessageBase {
  type: PluginMessageType.Resize;
  payload: { width: number; height?: number };
  fromFigma: false;
}

// Union types for all accepted messages
export type PluginMessage = PluginMessageAddColor | PluginMessageResize;
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

export type HMTLButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export type MouseOrTouchEventHandler = (e: MouseEvent | TouchEvent) => void;

export type SetEditingColorCallback = (
  colorRow: number | undefined,
  contrastColumn: number | undefined,
  color: Color,
  alpha?: number
) => void;

export const isMouseEvent = (e: MouseEvent | TouchEvent): e is MouseEvent => e.type.includes('mouse');
