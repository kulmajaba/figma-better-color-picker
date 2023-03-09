import { PluginMessage, PluginMessageType } from './types';
import { roundArrayTo1Decimals } from './util/mathUtils';

declare const BASE_URL: string | undefined;
const urlParam = '?figma=true';
const defaultWidth = 336;
const defaultHeight = 800;

console.log(BASE_URL);

const html = BASE_URL ? `<script>window.location.href="${BASE_URL}${urlParam}"</script>` : __html__;

figma.showUI(html, { themeColors: true, width: defaultWidth, height: defaultHeight });

figma.ui.onmessage = (msg: PluginMessage) => {
  console.log(msg);
  switch (msg.type) {
    case PluginMessageType.AddColor: {
      const newPaintStyle = figma.createPaintStyle();
      const { color, alpha, colorSpaceName, componentRepresentation } = msg.payload;
      const rgb: RGB = {
        r: color[0] / 255,
        g: color[1] / 255,
        b: color[2] / 255
      };

      const description = `${colorSpaceName}: ${roundArrayTo1Decimals(componentRepresentation).join(', ')}`;
      newPaintStyle.name = description;
      newPaintStyle.description = description;
      newPaintStyle.paints = [{ type: 'SOLID', color: rgb, opacity: alpha }];
      break;
    }
    case PluginMessageType.Resize: {
      figma.ui.resize(msg.payload.width, msg.payload.height || defaultHeight);
      break;
    }
  }
};
