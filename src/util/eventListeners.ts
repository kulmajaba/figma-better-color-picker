import { PluginMessage } from '../types';

export const waitForMessage = (timeoutMs = 5000): Promise<PluginMessage> => {
  const result = new Promise<PluginMessage>((resolve) => {
    const handleEvent = (e: MessageEvent<{ pluginMessage: PluginMessage; pluginId: string }>) => {
      if (e.data.pluginMessage.fromFigma) {
        console.log('UI message received:');
        console.log(e.data.pluginMessage);
        resolve(e.data.pluginMessage);
        window.removeEventListener('message', handleEvent);
      }
    };

    window.addEventListener('message', handleEvent);
  });
  const timeout = new Promise<PluginMessage>((_, reject) => {
    setTimeout(() => reject('waitForMessage timeout'), timeoutMs);
  });
  return Promise.race([result, timeout]);
};
