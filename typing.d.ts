// src/types/global.d.ts
// declare module '@/redux/index.ts' {
//   import { Store } from 'redux';

//   const store: Store;
//   export default store;
// }



// 旋转
// config = {}
interface Config {
  width?: number;
  height?: number;
  thumbWidth?: number;
  thumbHeight?: number;
  verticalPadding?: number;
  horizontalPadding?: number;
  showTheme?: boolean;
  title?: string;
  iconSize?: number;
  scope ?: boolean;
}

// data = {}
interface Data {
  angle: number;
  image: string;
  thumb: string;
  thumbSize: number;
}

// events = {}
interface Events {
  rotate?: (angle: number) => void;
  refresh?: () => void;
  close?: () => void;
  confirm?: (angle: number, reset:() => void) => boolean;
}

// export component method
interface ExportMethods {
  reset: () => void,
  clear: () => void,
  refresh: () => void,
  close: () => void,
}


// 按钮
interface _ {
  config?: CaptchaConfig
  clickEvent?: () => void
  disabled?: boolean
  type?: 'default' | 'warn' | 'error' | 'success'
  title?: string
}

export interface CaptchaConfig {
  width?: number
  height?: number
  verticalPadding?: number
  horizontalPadding?: number
}