import { PluginMessage } from './types';

declare const BASE_URL: string | undefined;

console.log(BASE_URL);

const html = BASE_URL ? `<script>window.location.href="${BASE_URL}";</script>` : __html__;

figma.showUI(html, { themeColors: true, width: 336, height: 800 });

figma.ui.onmessage = (msg: PluginMessage) => {
  console.log(msg);
};
