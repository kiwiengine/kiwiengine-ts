import { Texture } from 'pixi.js';

export type Char = {
  x: number;
  y: number;
  width: number;
  height: number;
  xoffset: number;
  yoffset: number;
  xadvance: number;
};

export type BitmapFont = {
  chars: Record<number, Char>;
  texture: Texture;
  size: number;
  lineHeight: number;
};
