import manifest from '../manifest.json';

import { OmitStrict, PluginMessage, PluginReturnMessage } from './types';

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
  console.log(`New message of type ${msg.type} with returnId ${returnId}`);

  const result = new Promise<PluginReturnMessage>((resolve) => {
    const handleMessage = (e: MessageEvent<{ pluginMessage: PluginReturnMessage; pluginId: string }>) => {
      if (e.data.pluginMessage.fromFigma && e.data.pluginMessage.returnId === returnId) {
        console.log(`UI message for returnId ${returnId} received`);
        console.log(e.data.pluginMessage);
        resolve(e.data.pluginMessage);
        window.removeEventListener('message', handleMessage);
      }
    };

    window.addEventListener('message', handleMessage);
  });
  const timeout = new Promise<PluginReturnMessage>((_, reject) => {
    setTimeout(() => reject(`asyncMessage timeout for returnId ${returnId}`), timeoutMs);
  });

  const pluginMessage: PluginMessage = {
    ...msg,
    fromFigma: false,
    returnId
  };
  parent.postMessage({ pluginMessage, pluginId: manifest.id }, '*');

  return Promise.race([result, timeout]);
};
