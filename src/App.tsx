import React, { useState, useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import StickerEditor from './components/StickerEditor';
import ControlPanel from './components/ControlPanel';
import { StickerTemplate, ExcelData } from './types';
import { defaultTemplate } from './utils/defaults';

function App() {
  const [excelData, setExcelData] = useState<ExcelData | null>(null);
  const [template, setTemplate] = useState<StickerTemplate>(defaultTemplate);
  const [currentSticker, setCurrentSticker] = useState(0);
  const [gridLayout, setGridLayout] = useState({ rows: 1, cols: 1 });
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const editorRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header editorRef={editorRef} />
      <main className="flex flex-col lg:flex-row flex-1 p-4 gap-4">
        <ControlPanel 
          excelData={excelData}
          setExcelData={setExcelData}
          template={template}
          setTemplate={setTemplate}
          currentSticker={currentSticker}
          setCurrentSticker={setCurrentSticker}
          gridLayout={gridLayout}
          setGridLayout={setGridLayout}
          unit={unit}
          setUnit={setUnit}
        />
        <StickerEditor 
          ref={editorRef}
          excelData={excelData}
          template={template}
          currentSticker={currentSticker}
          gridLayout={gridLayout}
          unit={unit}
        />
      </main>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;