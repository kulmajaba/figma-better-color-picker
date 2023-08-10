import { handleRaw, sendRequest, setup } from './rpc';

import {
  ApiFunctions,
  AwaitedReturn,
  LogLevel,
  RPCAPIReturnType,
  RPCOptions,
  RPCSendRaw,
  StrictParameters
} from './types';
import { strictObjectKeys } from '../types';

// Debugging setup for RPC
const isFigma = typeof figma !== 'undefined';
const isUi = typeof parent !== 'undefined';
const logBase = (level: LogLevel, ...msg: unknown[]) =>
  console[level](`RPC in ${isFigma ? 'logic' : isUi ? 'ui' : 'UNKNOWN'}:`, ...msg);

let sendRaw: RPCSendRaw;
/**
 * Set up sending and receiving of messages for Figma plugin logic and UI
 */
const setupMessaging = (pluginId: string | undefined) => {
  if (typeof figma !== 'undefined') {
    figma.ui.on('message', (message) => handleRaw(message));
    sendRaw = (message) => figma.ui.postMessage(message);
  } else if (typeof parent !== 'undefined') {
    onmessage = (event) => handleRaw(event.data.pluginMessage);
    sendRaw = (pluginMessage) => {
      if (pluginId !== undefined) {
        parent.postMessage({ pluginMessage, pluginId }, '*');
      } else {
        parent.postMessage({ pluginMessage }, '*');
      }
    };
  }
};

/**
 * Creates one side of a JSON-RPC API for a Figma plugin
 * @param hostType A typeof string of an object that differentiates between on-host and off-host.
 * For example, if `typeof figma` is used, when `figma` is defined the creator is considered to be on-host
 * and the methods for processing the remote API calls are set up.
 * Off-host the creator sets up the equivalent remote API calls to make requests to host.
 */
const createAPI = <T extends ApiFunctions>(
  methods: T,
  hostType: string,
  options?: RPCOptions
): Readonly<RPCAPIReturnType<T>> => {
  const { timeoutMs, pluginId } = options ?? {};

  if (sendRaw === undefined) {
    setupMessaging(pluginId);
  }

  if (hostType !== 'undefined') {
    // Should not happen but log an error just in case
    if (sendRaw === undefined) {
      console.error('createAPI: sendRaw is undefined at during setup, the API will not work');
    }

    setup(methods, sendRaw, logBase);
  }

  const api: RPCAPIReturnType<T> = strictObjectKeys(methods).reduce((prev, p) => {
    const method = async (...params: StrictParameters<T[keyof T]>) => {
      if (hostType !== 'undefined') {
        return (await methods[p](...params)) as AwaitedReturn<T[keyof T]>;
      }

      return (await sendRequest(p as string, params, timeoutMs)) as AwaitedReturn<T[keyof T]>;
    };

    prev[p] = method;
    return prev;
  }, {} as RPCAPIReturnType<T>);

  return api;
};

/**
 * Create a set of methods that are called from plugin logic and executed in plugin UI
 */
export const createUIAPI = <T extends ApiFunctions>(
  methods: T,
  options?: RPCOptions
): Readonly<RPCAPIReturnType<T>> => {
  return createAPI(methods, typeof parent, options);
};

/**
 * Create a set of methods that are called from plugin UI and executed in plugin logic
 */
export const createPluginAPI = <T extends ApiFunctions>(
  methods: T,
  options?: RPCOptions
): Readonly<RPCAPIReturnType<T>> => {
  return createAPI(methods, typeof figma, options);
};
