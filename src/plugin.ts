import { defaultHeight, defaultWidth } from './constants';
import './pluginApi';

const BASE_URL: string = import.meta.env.VITE_BASE_URL;
const urlParam = '?figma=true';

const html = `<script>
  parent.postMessage({
    pluginMessage: {
      jsonrpc: '2.0',
      method: 'saveTheme',
      params: [document.getElementById('figma-style')?.innerHTML ?? '']
    }
  }, '*');
  window.location.href = '${BASE_URL}${urlParam}';
</script>`;

figma.showUI(html, { themeColors: true, width: defaultWidth, height: defaultHeight });

figma.ui.onmessage = (msg) => {
  // Actual handling of messages happens in pluginApi.ts
  console.log('Plugin received message:', msg);
};
