import React from 'react';
import { Ruler, Maximize2 } from 'lucide-react';
import { StickerTemplate } from '../types';

interface StickerDimensionsProps {
  template: StickerTemplate;
  setTemplate: (template: StickerTemplate) => void;
  unit: 'in' | 'cm';
  setUnit: (unit: 'in' | 'cm') => void;
}

const StickerDimensions: React.FC<StickerDimensionsProps> = ({
  template,
  setTemplate,
  unit,
  setUnit,
}) => {
  // Conversion factors
  const inchToCm = 2.54;
  const cmToInch = 0.3937;

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value) || value <= 0) return;
    
    const widthInInches = unit === 'in' ? value : value * cmToInch;
    setTemplate({
      ...template,
      width: widthInInches,
    });
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value) || value <= 0) return;
    
    const heightInInches = unit === 'in' ? value : value * cmToInch;
    setTemplate({
      ...template,
      height: heightInInches,
    });
  };

  // Get display values based on the selected unit
  const displayWidth = unit === 'in' 
    ? template.width 
    : (template.width * inchToCm).toFixed(2);
    
  const displayHeight = unit === 'in' 
    ? template.height 
    : (template.height * inchToCm).toFixed(2);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Sticker Dimensions</h3>
      
      <div className="bg-gray-50 p-4 rounded-md space-y-4">
        <div className="flex justify-end">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              className={`px-3 py-1.5 text-sm font-medium rounded-l-md transition-colors ${
                unit === 'in'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
              onClick={() => setUnit('in')}
            >
              in
            </button>
            <button
              type="button"
              className={`px-3 py-1.5 text-sm font-medium rounded-r-md transition-colors ${
                unit === 'cm'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
              onClick={() => setUnit('cm')}
            >
              cm
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Width
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Maximize2 className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={displayWidth}
                onChange={handleWidthChange}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">{unit}</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Ruler className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={displayHeight}
                onChange={handleHeightChange}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">{unit}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-500">
        <p className="mb-1">Tips:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Standard address label: 2.63" × 1"</li>
          <li>Standard name tag: 3.5" × 2"</li>
          <li>Standard shipping label: a 4" × 6"</li>
        </ul>
      </div>
    </div>
  );
};

export default StickerDimensions;