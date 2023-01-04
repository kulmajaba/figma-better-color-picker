import { PluginMessage, PluginMessageType } from './types';

figma.showUI(__html__, { themeColors: true, width: 300, height: 600 });

const postMessage = (msg: Omit<PluginMessage, 'fromFigma'>) => {
  figma.ui.postMessage(Object.assign({}, msg, { fromFigma: true }));
};

figma.ui.onmessage = (msg: PluginMessage) => {
  switch (msg.type) {
    case PluginMessageType.ClientStorageGet: {
      const getData = async () => {
        try {
          const value = await figma.clientStorage.getAsync(msg.key);
          postMessage({ type: PluginMessageType.ClientStorageGet, key: msg.key, value });
        } catch (e) {
          console.log(e);
        }
      };

      getData();
      break;
    }
  }
};
