import { PluginMessage } from './types';

figma.showUI(__html__, { themeColors: true, width: 336, height: 600 });

figma.ui.onmessage = (msg: PluginMessage) => {
  console.log(msg);
};
