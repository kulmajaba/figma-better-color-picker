import manifest from '../manifest.json';

import { OmitStrict, PluginMessage, PluginMessageType, PluginReturnMessage } from './types';

/**
 * Post a message to Figma plugin
 */
export const pluginPostMessage = (msg: OmitStrict<PluginMessage, 'fromFigma'>) =>
  parent.postMessage({ pluginMessage: { ...msg, fromFigma: false }, pluginId: manifest.id }, '*');

/**
 * Post a message to Figma and get a response asynchronously, unless timed out
 */
export const asyncPluginMessage = async (
  msg: OmitStrict<PluginMessage, 'fromFigma' | 'returnId'>,
  timeoutMs = 5000
) => {
  const returnId = Date.now(); // Eh it's unique enough, use the uuid package if you care more than I do

  const result = new Promise<PluginReturnMessage>((resolve, reject) => {
    const handleMessage = (e: MessageEvent<{ pluginMessage: PluginReturnMessage; pluginId: string }>) => {
      if (e.data.pluginMessage.fromFigma && e.data.pluginMessage.returnId === returnId) {
        resolve(e.data.pluginMessage);
        window.removeEventListener('message', handleMessage);
      }
    };

    window.addEventListener('message', handleMessage);

    setTimeout(() => {
      window.removeEventListener('message', handleMessage);
      reject(`asyncMessage timeout for returnId ${returnId}, type ${msg.type}`);
    }, timeoutMs);
  });

  const pluginMessage: PluginMessage = {
    ...msg,
    fromFigma: false,
    returnId
  };
  parent.postMessage({ pluginMessage, pluginId: manifest.id }, '*');

  return result;
};

type ApiEndpoint<T> = (message: PluginMessageType) => Promise<T>;

export const getTheme: ApiEndpoint<string> = async () =>
  (await asyncPluginMessage({ type: PluginMessageType.GetTheme })).payload;
