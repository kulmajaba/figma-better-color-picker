import { MouseEvent, TouchEvent } from 'react';

import * as colorSpace from './color';

// Better Omit type for Discriminated Union types
// https://github.com/microsoft/TypeScript/issues/31501
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OmitStrict<T, K extends keyof T> = T extends any ? Pick<T, Exclude<keyof T, K>> : never;

export type Color = [number, number, number];
export type ColorWithAlpha = [number, number, number, number];

export type ColorConverter = (color: Color) => Color;

export type InputValue = string | number | readonly string[] | undefined;

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

export const strictObjectKeys = Object.keys as <T extends Record<string, unknown>>(obj: T) => Array<keyof T>;
