import { StickerTemplate, PageSize, PageDimensions } from '../types';

export const defaultTemplate: StickerTemplate = {
  width: 3.5,      // 3.5 inches
  height: 2,       // 2 inches
  backgroundColor: '#ffffff',
  borderColor: '#e2e8f0',
  borderWidth: 1,
  borderRadius: 8,
  fontFamily: 'Helvetica, sans-serif',
  fontSize: 16,
  labelFontSize: 12,
  textColor: '#1e293b',
};

export const pageDimensions: Record<PageSize, PageDimensions> = {
  'A4': {
    width: 8.27,    // 210mm in inches
    height: 11.69,  // 297mm in inches
  },
  'A3': {
    width: 11.69,   // 297mm in inches
    height: 16.54,  // 420mm in inches
  }
};