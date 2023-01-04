import { PluginMessage } from './types';

// Using this ensures all messages sent from the plugin UI are understood by plugin.ts
export const pluginPostMessage = (msg: Omit<PluginMessage, 'fromFigma'>) =>
  parent.postMessage({ pluginMessage: { ...msg, fromFigma: false } }, '*');
