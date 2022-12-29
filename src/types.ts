export enum PluginMessageType {
  CreateRectangles = 'createRectangles'
}

export interface PluginMessageCreateRectangles {
  type: PluginMessageType.CreateRectangles;
  count: number;
}

export type PluginMessage = PluginMessageCreateRectangles;
