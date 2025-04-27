import React from 'react';
import { Layers, Grid, PaintBucket, Type, Upload, Sliders } from 'lucide-react';
import ExcelUploader from './ExcelUploader';
import StickerDimensions from './StickerDimensions';
import GridSettings from './GridSettings';
import StickerStyler from './StickerStyler';
import { StickerTemplate, ExcelData } from '../types';

interface ControlPanelProps {
  excelData: ExcelData | null;
  setExcelData: (data: ExcelData | null) => void;
  template: StickerTemplate;
  setTemplate: (template: StickerTemplate) => void;
  currentSticker: number;
  setCurrentSticker: (index: number) => void;
  gridLayout: { rows: number; cols: number };
  setGridLayout: (layout: { rows: number; cols: number }) => void;
  unit: 'in' | 'cm';
  setUnit: (unit: 'in' | 'cm') => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  excelData,
  setExcelData,
  template,
  setTemplate,
  currentSticker,
  setCurrentSticker,
  gridLayout,
  setGridLayout,
  unit,
  setUnit,
}) => {
  const [activeTab, setActiveTab] = React.useState<string>('upload');
  
  const tabs = [
    { id: 'upload', icon: <Upload />, label: 'Upload' },
    { id: 'dimensions', icon: <Sliders />, label: 'Dimensions' },
    { id: 'grid', icon: <Grid />, label: 'Grid' },
    { id: 'style', icon: <PaintBucket />, label: 'Style' },
  ];

  return (
    <div className="bg-white rounded-lg shadow w-full lg:w-80 flex flex-col">
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex-1 py-3 px-1 flex flex-col items-center justify-center text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <div className="mb-1">{tab.icon}</div>
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto">
        {activeTab === 'upload' && (
          <ExcelUploader 
            excelData={excelData} 
            setExcelData={setExcelData}
            currentSticker={currentSticker}
            setCurrentSticker={setCurrentSticker}
          />
        )}
        
        {activeTab === 'dimensions' && (
          <StickerDimensions
            template={template}
            setTemplate={setTemplate}
            unit={unit}
            setUnit={setUnit}
          />
        )}
        
        {activeTab === 'grid' && (
          <GridSettings 
            gridLayout={gridLayout}
            setGridLayout={setGridLayout}
          />
        )}
        
        {activeTab === 'style' && (
          <StickerStyler 
            template={template}
            setTemplate={setTemplate}
          />
        )}
      </div>
    </div>
  );
};

export default ControlPanel;