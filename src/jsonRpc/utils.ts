import { LogLevel } from './types';

// Debugging setup for RPC
const isFigma = typeof figma !== 'undefined';
const isUi = typeof parent !== 'undefined';
export const logBase = (level: LogLevel, ...msg: unknown[]) =>
  console[level](`RPC in ${isFigma ? 'logic' : isUi ? 'ui' : 'UNKNOWN'}:`, ...msg);
