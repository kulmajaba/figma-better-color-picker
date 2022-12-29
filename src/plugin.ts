import { PluginMessage, PluginMessageType } from './types';

figma.showUI(__html__, { themeColors: true, width: 300, height: 600 });

figma.ui.onmessage = (msg: PluginMessage) => {
  console.log(msg);
  switch (msg.type) {
    case PluginMessageType.CreateRectangles: {
      const nodes = [];

      for (let i = 0; i < msg.count; i++) {
        const rect = figma.createRectangle();
        rect.x = i * 150;
        rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
        figma.currentPage.appendChild(rect);
        nodes.push(rect);
      }

      figma.currentPage.selection = nodes;
      figma.viewport.scrollAndZoomIntoView(nodes);
      break;
    }
  }
};
