import React from 'react';
import { SketchPicker } from 'react-color';
import { PaintBucket, Type, ListOrdered as BorderAll } from 'lucide-react';
import { StickerTemplate } from '../types';

interface StickerStylerProps {
  template: StickerTemplate;
  setTemplate: (template: StickerTemplate) => void;
}

const StickerStyler: React.FC<StickerStylerProps> = ({ template, setTemplate }) => {
  const [showBackgroundPicker, setShowBackgroundPicker] = React.useState(false);
  const [showBorderPicker, setShowBorderPicker] = React.useState(false);
  const [showTextPicker, setShowTextPicker] = React.useState(false);
  
  const fontFamilies = [
    { value: 'Arial, sans-serif', label: 'Arial' },
    { value: 'Helvetica, sans-serif', label: 'Helvetica' },
    { value: 'Times New Roman, serif', label: 'Times New Roman' },
    { value: 'Courier New, monospace', label: 'Courier New' },
    { value: 'Georgia, serif', label: 'Georgia' },
    { value: 'Verdana, sans-serif', label: 'Verdana' },
    { value: 'Impact, sans-serif', label: 'Impact' },
  ];
  
  const handleBackgroundColorChange = (color: any) => {
    setTemplate({
      ...template,
      backgroundColor: color.hex,
    });
  };
  
  const handleBorderColorChange = (color: any) => {
    setTemplate({
      ...template,
      borderColor: color.hex,
    });
  };
  
  const handleTextColorChange = (color: any) => {
    setTemplate({
      ...template,
      textColor: color.hex,
    });
  };
  
  const handleBorderWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setTemplate({
      ...template,
      borderWidth: value,
    });
  };
  
  const handleBorderRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setTemplate({
      ...template,
      borderRadius: value,
    });
  };
  
  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTemplate({
      ...template,
      fontFamily: e.target.value,
    });
  };
  
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setTemplate({
      ...template,
      fontSize: value,
    });
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Style Settings</h3>
      
      <div className="space-y-5">
        {/* Background color */}
        <div className="relative">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Background Color
            </label>
            <div 
              className="w-8 h-8 rounded-md cursor-pointer border border-gray-300 shadow-sm"
              style={{ backgroundColor: template.backgroundColor }}
              onClick={() => setShowBackgroundPicker(!showBackgroundPicker)}
            />
          </div>
          {showBackgroundPicker && (
            <div className="absolute right-0 z-10 mt-1">
              <div 
                className="fixed inset-0" 
                onClick={() => setShowBackgroundPicker(false)}
              />
              <SketchPicker 
                color={template.backgroundColor}
                onChange={handleBackgroundColorChange}
              />
            </div>
          )}
        </div>
        
        {/* Border settings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Border Color
            </label>
            <div 
              className="w-8 h-8 rounded-md cursor-pointer border border-gray-300 shadow-sm"
              style={{ backgroundColor: template.borderColor }}
              onClick={() => setShowBorderPicker(!showBorderPicker)}
            />
          </div>
          {showBorderPicker && (
            <div className="absolute right-0 z-10 mt-1">
              <div 
                className="fixed inset-0" 
                onClick={() => setShowBorderPicker(false)}
              />
              <SketchPicker 
                color={template.borderColor}
                onChange={handleBorderColorChange}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Width (px)
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={template.borderWidth}
              onChange={handleBorderWidthChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Radius (px)
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={template.borderRadius}
              onChange={handleBorderRadiusChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>10</span>
              <span>20</span>
            </div>
          </div>
        </div>
        
        {/* Text settings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Text Color
            </label>
            <div 
              className="w-8 h-8 rounded-md cursor-pointer border border-gray-300 shadow-sm"
              style={{ backgroundColor: template.textColor }}
              onClick={() => setShowTextPicker(!showTextPicker)}
            />
          </div>
          {showTextPicker && (
            <div className="absolute right-0 z-10 mt-1">
              <div 
                className="fixed inset-0" 
                onClick={() => setShowTextPicker(false)}
              />
              <SketchPicker 
                color={template.textColor}
                onChange={handleTextColorChange}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Family
            </label>
            <select
              value={template.fontFamily}
              onChange={handleFontFamilyChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {fontFamilies.map((font) => (
                <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Size (px)
            </label>
            <input
              type="range"
              min="8"
              max="36"
              value={template.fontSize}
              onChange={handleFontSizeChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>8</span>
              <span>22</span>
              <span>36</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickerStyler;