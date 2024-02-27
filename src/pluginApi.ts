import { createPluginAPI, createUIAPI, RPCOptions } from 'figma-plugin-api';

import manifest from '../manifest.json';

import strings from './assets/strings';
import { defaultHeight } from './constants';
import { roundArrayTo1Decimals } from './util/mathUtils';

import { Color } from './types';

let uiTheme = '';

const PLUGIN_ID: string | undefined = manifest.id ?? undefined;

const pluginOptions: RPCOptions = {
  pluginId: PLUGIN_ID,
  logicTargetOrigin: import.meta.env.VITE_BASE_URL,
  uiTargetOrigin: 'https://www.figma.com'
};

/**
 * Methods for plugin logic (Figma side)
 * Import to UI
 */
export const api = createPluginAPI(
  {
    resizeUi(width: number, height?: number) {
      figma.ui.resize(width, height ?? defaultHeight);
    },
    saveTheme(theme: string) {
      uiTheme = theme;
    },
    getTheme() {
      return uiTheme;
    },
    /**
     * @param color Color in sRGB colorspace, values in range 0..255
     * @param alpha Float number in range 0..1
     * @param componentRepresentation The color's human-readable representation, e.g. HSV should return values in ranges: [0..360, 0..100, 0..100]
     */
    async addColor(
      color: Color,
      alpha: number,
      colorSpaceName: string,
      componentRepresentation: Color,
      colorName: string | undefined,
      updateExistingStyle: boolean
    ) {
      const existingPaintStyle = (await figma.getLocalPaintStylesAsync()).find((s) => s.name === colorName);

      const rgb: RGB = {
        r: color[0] / 255,
        g: color[1] / 255,
        b: color[2] / 255
      };
      const description = `${colorSpaceName}: ${roundArrayTo1Decimals(componentRepresentation).join(', ')}`;

      if (existingPaintStyle && updateExistingStyle) {
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
    }
  },
  pluginOptions
);

/**
 * Methods for plugin UI (React side)
 * Import to plugin logic
 */
export const uiApi = createUIAPI({}, pluginOptions);
