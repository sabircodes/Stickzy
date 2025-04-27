import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileText, Check, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { ExcelData } from '../types';

interface ExcelUploaderProps {
  excelData: ExcelData | null;
  setExcelData: (data: ExcelData | null) => void;
  currentSticker: number;
  setCurrentSticker: (index: number) => void;
}

const ExcelUploader: React.FC<ExcelUploaderProps> = ({ 
  excelData, 
  setExcelData,
  currentSticker,
  setCurrentSticker
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      processFile(files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };
  
  const processFile = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if (jsonData.length === 0) {
          toast.error('The Excel file has no data');
          return;
        }
        
        // Extract headers and data
        const headers = Object.keys(jsonData[0]);
        const rows = jsonData.map(row => {
          const rowData: Record<string, string> = {};
          headers.forEach(header => {
            rowData[header] = String(row[header] || '');
          });
          return rowData;
        });
        
        setExcelData({ headers, rows });
        setCurrentSticker(0);
        toast.success('Excel file loaded successfully!');
      } catch (error) {
        console.error('Error processing Excel file:', error);
        toast.error('Failed to process Excel file. Please check the format.');
      }
    };
    
    reader.onerror = () => {
      toast.error('Error reading file');
    };
    
    reader.readAsBinaryString(file);
  };
  
  const handleClearData = () => {
    setExcelData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePrevSticker = () => {
    if (excelData && currentSticker > 0) {
      setCurrentSticker(currentSticker - 1);
    }
  };

  const handleNextSticker = () => {
    if (excelData && currentSticker < excelData.rows.length - 1) {
      setCurrentSticker(currentSticker + 1);
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Excel Data</h3>
      
      {!excelData ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-10 w-10 text-gray-400 mb-3" />
          <p className="text-sm text-gray-500">
            Drag & drop an Excel file or <span className="text-blue-500">browse</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Columns will be used as fields, rows as stickers
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".xlsx,.xls"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                {excelData.rows.length} stickers loaded
              </span>
            </div>
            <button
              onClick={handleClearData}
              className="text-red-500 hover:text-red-700 text-sm flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-md p-3">
            <div className="text-sm text-gray-500 mb-2">
              Sticker {currentSticker + 1} of {excelData.rows.length}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {excelData.headers.map((header, index) => (
                <div key={index}>
                  <div className="font-medium text-gray-700">{header}:</div>
                  <div className="text-gray-600 truncate">
                    {excelData.rows[currentSticker][header]}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={handlePrevSticker}
              disabled={currentSticker === 0}
              className={`flex items-center text-sm ${
                currentSticker === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:text-blue-700'
              }`}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>
            <button
              onClick={handleNextSticker}
              disabled={currentSticker === excelData.rows.length - 1}
              className={`flex items-center text-sm ${
                currentSticker === excelData.rows.length - 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-500 hover:text-blue-700'
              }`}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelUploader;