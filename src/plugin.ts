import strings from './assets/strings';
import { roundArrayTo1Decimals } from './util/mathUtils';

import { PluginMessage, PluginMessageType, PluginReturnMessageGetTheme } from './types';

declare const BASE_URL: string | undefined;
const urlParam = '?figma=true';
const defaultWidth = 336;
const defaultHeight = 830;

let theme = '';

const html = `<script>
  parent.postMessage({ pluginMessage: { type: 'SAVE_THEME', payload: document.getElementById('figma-style').innerHTML } }, '*');
  window.location.href="${BASE_URL}${urlParam}";
</script>`;

figma.showUI(html, { themeColors: true, width: defaultWidth, height: defaultHeight });

figma.ui.onmessage = (msg: PluginMessage) => {
  console.log(msg);
  switch (msg.type) {
    case PluginMessageType.AddColor: {
      const { color, alpha, colorSpaceName, componentRepresentation, colorName, updateExistingStyle } = msg.payload;

      const existingPaintStyle = figma.getLocalPaintStyles().find((s) => s.name === colorName);

      const rgb: RGB = {
        r: color[0] / 255,
        g: color[1] / 255,
        b: color[2] / 255
      };
      const description = `${colorSpaceName}: ${roundArrayTo1Decimals(componentRepresentation).join(', ')}`;

      if (existingPaintStyle && updateExistingStyle) {
        console.log('Update style', colorName);
        existingPaintStyle.description = description;
        existingPaintStyle.paints = [{ type: 'SOLID', color: rgb, opacity: alpha }];
        figma.notify(`${strings.figma.updateColorSuccessful} ${colorName}`);
      } else {
        const newPaintStyle = figma.createPaintStyle();
        newPaintStyle.name = colorName ?? '';
        newPaintStyle.description = description;
        newPaintStyle.paints = [{ type: 'SOLID', color: rgb, opacity: alpha }];
        figma.notify(`${strings.figma.addColorSuccessful_1} ${colorName ?? ''} ${strings.figma.addColorSuccessful_2}`);
      }

      break;
    }
    case PluginMessageType.Resize: {
      figma.ui.resize(msg.payload.width, msg.payload.height ?? defaultHeight);
      break;
    }
    case PluginMessageType.SaveTheme: {
      theme = msg.payload;
      break;
    }
    case PluginMessageType.GetTheme: {
      const pluginMessage: PluginReturnMessageGetTheme = {
        type: PluginMessageType.GetTheme,
        payload: theme,
        fromFigma: true,
        returnId: msg.returnId
      };
      figma.ui.postMessage(pluginMessage);
    }
  }
};
