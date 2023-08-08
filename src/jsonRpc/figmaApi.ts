import { sendRequest, setup } from './rpc';

import { ApiFunctions, AwaitedReturn, RPCAPIReturnType, RPCOptions, StrictParameters } from './types';
import { strictObjectKeys } from '../types';

/**
 * Create a set of methods that will be executed on the UI,
 * regarless of where they are called from.
 */
export const createUIAPI = <T extends ApiFunctions>(
  methods: T,
  options?: RPCOptions
): Readonly<RPCAPIReturnType<T>> => {
  const timeoutMs = options && options.timeoutMs;

  if (typeof parent !== 'undefined') {
    console.log('Setup UI API', methods);
    setup(methods);
  }

  const api: RPCAPIReturnType<T> = strictObjectKeys(methods).reduce((prev, p) => {
    const method = async (...params: StrictParameters<T[keyof T]>) => {
      if (typeof parent !== 'undefined') {
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
 * Create a set of methods that will be executed on the plugin,
 * regarless of where they are called from.
 */
export const createPluginAPI = <T extends ApiFunctions>(
  methods: T,
  options?: RPCOptions
): Readonly<RPCAPIReturnType<T>> => {
  const timeoutMs = options && options.timeoutMs;

  if (typeof figma !== 'undefined') {
    console.log('Setup plugin API', methods);
    setup(methods);
  }

  const api: RPCAPIReturnType<T> = strictObjectKeys(methods).reduce((prev, p) => {
    const method = async (...params: StrictParameters<T[keyof T]>) => {
      if (typeof figma !== 'undefined') {
        return (await methods[p](...params)) as AwaitedReturn<T[keyof T]>;
      }

      return (await sendRequest(p as string, params, timeoutMs)) as AwaitedReturn<T[keyof T]>;
    };

    prev[p] = method;
    return prev;
  }, {} as RPCAPIReturnType<T>);

  return api;
};
