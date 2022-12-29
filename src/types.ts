export enum PluginMessageType {
  CreateRectangles = 'createRectangles'
}

export interface PluginMessageCreateRectangles {
  type: PluginMessageType.CreateRectangles;
  count: number;
}

export type PluginMessage = PluginMessageCreateRectangles;

export enum HorizontalChangeDirection {
  LeftToRight = 'LEFT_TO_RIGHT',
  RightToLeft = 'RIGHT_TO_LEFT'
}

export enum VerticalChangeDirection {
  TopToBottom = 'TOP_TO_BOTTOM',
  BottomToTop = 'BOTTOM_TO_TOP'
}

export interface XY {
  x: number;
  y: number;
}
