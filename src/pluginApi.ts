import { PluginMessage } from './types';

// Using this ensures all messages sent from the plugin UI are understood by plugin.ts
export const pluginPostMessage = (message: PluginMessage) => parent.postMessage({ pluginMessage: message }, '*');
