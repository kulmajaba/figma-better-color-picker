import { PluginMessage, PluginMessageType, PluginReturnMessage } from './types';

figma.showUI(__html__, { themeColors: true, width: 300, height: 600 });

const postMessage = (msg: Omit<PluginReturnMessage, 'fromFigma'>) => {
  figma.ui.postMessage(Object.assign({}, msg, { fromFigma: true }));
};

figma.ui.onmessage = (msg: PluginMessage) => {
  switch (msg.type) {
    case PluginMessageType.EyeDropper: {
      console.log('Eyedropper');
      const openEyeDropper = async () => {
        if (!window.EyeDropper) {
          console.warn('This browser does not support EyeDropper API');
          return;
        }
        try {
          const dropper = new window.EyeDropper();
          const result = await dropper.open();
          console.log(result);
          postMessage({ type: PluginMessageType.EyeDropper, value: result.sRGBHex });
        } catch (e) {
          console.log(e);
        }
      };

      openEyeDropper();
      break;
    }
  }
};
