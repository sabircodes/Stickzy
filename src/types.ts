export interface StickerTemplate {
  width: number;       // in inches 
  height: number;      // in inches
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  fontFamily: string;
  fontSize: number;
  textColor: string;
  labelFontSize: number;
}

export interface ExcelData {
  headers: string[];
  rows: Record<string, string>[];
}

export interface TextStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export interface StickerElement {
  id: string;
  type: 'text' | 'image';
  content: string;
  field?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isLabel?: boolean;
  textStyle?: TextStyle;
}

export type PageSize = 'A4' | 'A3';

export interface PageDimensions {
  width: number;   // in inches
  height: number;  // in inches
}

export type AlignmentGuide = {
  type: 'horizontal' | 'vertical';
  position: number;
  elements: string[];
}