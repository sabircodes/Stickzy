import React from 'react';
import { Columns, Rows, Grid } from 'lucide-react';

interface GridSettingsProps {
  gridLayout: { rows: number; cols: number };
  setGridLayout: (layout: { rows: number; cols: number }) => void;
}

const GridSettings: React.FC<GridSettingsProps> = ({ gridLayout, setGridLayout }) => {
  const handleRowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1 || value > 10) return;
    
    setGridLayout({
      ...gridLayout,
      rows: value,
    });
  };

  const handleColumnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1 || value > 10) return;
    
    setGridLayout({
      ...gridLayout,
      cols: value,
    });
  };

  const totalStickers = gridLayout.rows * gridLayout.cols;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Grid Settings</h3>
      
      <div className="bg-gray-50 p-4 rounded-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rows
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Rows className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="number"
              min="1"
              max="10"
              value={gridLayout.rows}
              onChange={handleRowChange}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Columns
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Columns className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="number"
              min="1"
              max="10"
              value={gridLayout.cols}
              onChange={handleColumnChange}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-md p-3 flex items-center">
        <Grid className="h-5 w-5 text-blue-500 mr-2" />
        <span className="text-sm text-blue-700">
          Your layout will display <strong>{totalStickers}</strong> stickers per page
        </span>
      </div>
      
      <div className="text-sm text-gray-500">
        <p>Grid layout is useful for:</p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li>Printing multiple stickers on a single page</li>
          <li>Creating sheets of address labels</li>
          <li>Preparing label sheets for mass production</li>
        </ul>
      </div>
    </div>
  );
};

export default GridSettings;