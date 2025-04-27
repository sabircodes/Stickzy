import React, { useState, useRef, useEffect, forwardRef } from 'react';
import Draggable from 'react-draggable';
import { FileText, Bold, Italic, Underline } from 'lucide-react';
import { StickerTemplate, ExcelData, StickerElement, PageSize, AlignmentGuide } from '../types';
import { pageDimensions } from '../utils/defaults';

interface StickerEditorProps {
  excelData: ExcelData | null;
  template: StickerTemplate;
  currentSticker: number;
  gridLayout: { rows: number; cols: number };
  unit: 'in' | 'cm';
}

const ALIGNMENT_THRESHOLD = 5; // pixels

const StickerEditor = forwardRef<HTMLDivElement, StickerEditorProps>(({
  excelData,
  template,
  currentSticker,
  gridLayout,
  unit,
}, ref) => {
  const [activeElement, setActiveElement] = useState<string | null>(null);
  const [elements, setElements] = useState<StickerElement[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>('A4');
  const [alignmentGuides, setAlignmentGuides] = useState<AlignmentGuide[]>([]);
  const [applyToAll, setApplyToAll] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Scale factor for display (pixels per inch)
  const PPI = 96;
  
  // Convert template dimensions to pixels for display
  const displayWidth = template.width * PPI;
  const displayHeight = template.height * PPI;
  
  // Grid dimensions
  const gridWidthPx = displayWidth * gridLayout.cols;
  const gridHeightPx = displayHeight * gridLayout.rows;

  useEffect(() => {
    // Function to handle clicks anywhere in the document
    const handleGlobalClick = (event: MouseEvent) => {
      // Clear selection if the click is outside our components
      const clickTarget = event.target as Node;
      const isClickOnElement = elements.some(element => {
        const elementNode = document.getElementById(element.id);
        return elementNode && (elementNode === clickTarget || elementNode.contains(clickTarget));
      });
      
      if (!isClickOnElement) {
        setActiveElement(null);
        setAlignmentGuides([]);
      }
    };

    document.addEventListener('mousedown', handleGlobalClick);
    return () => document.removeEventListener('mousedown', handleGlobalClick);
  }, [elements]);
  
  // Initialize elements from excel data when data changes
  useEffect(() => {
    if (!excelData) {
      setElements([]);
      return;
    }
    
    const newElements = excelData.headers.map((header, index) => {
      const columns = 2;
      const column = index % columns;
      const row = Math.floor(index / columns);
      
      const spacing = 20;
      const elementWidth = (displayWidth - (spacing * 3)) / 2;
      
      const labelElement: StickerElement = {
        id: `label-${index}`,
        type: 'text',
        content: header,
        x: spacing + (column * (elementWidth + spacing)),
        y: spacing + (row * 60),
        width: elementWidth,
        height: 20,
        isLabel: true,
        textStyle: { bold: true },
      };
      
      const valueElement: StickerElement = {
        id: `element-${index}`,
        type: 'text',
        content: header,
        field: header,
        x: spacing + (column * (elementWidth + spacing)),
        y: spacing + (row * 60) + 25,
        width: elementWidth,
        height: 30,
        textStyle: {},
      };
      
      return [labelElement, valueElement];
    }).flat();
    
    setElements(newElements);
  }, [excelData, displayWidth]);

  const findAlignmentGuides = (currentElement: StickerElement, x: number, y: number): AlignmentGuide[] => {
    const guides: AlignmentGuide[] = [];
    
    elements.forEach(element => {
      if (element.id === currentElement.id) return;

      // Vertical alignment
      if (Math.abs(element.x - x) < ALIGNMENT_THRESHOLD) {
        guides.push({
          type: 'vertical',
          position: element.x,
          elements: [element.id, currentElement.id]
        });
      }

      // Horizontal alignment
      if (Math.abs(element.y - y) < ALIGNMENT_THRESHOLD) {
        guides.push({
          type: 'horizontal',
          position: element.y,
          elements: [element.id, currentElement.id]
        });
      }
    });

    return guides;
  };
  
  const handleDrag = (elementId: string, e: any, data: any) => {
    const { x, y } = data;
    const currentElement = elements.find(el => el.id === elementId);
    if (!currentElement) return;

    const guides = findAlignmentGuides(currentElement, x, y);
    setAlignmentGuides(guides);

    // Snap to guides if they exist
    let finalX = x;
    let finalY = y;

    guides.forEach(guide => {
      if (guide.type === 'vertical') {
        finalX = guide.position;
      } else {
        finalY = guide.position;
      }
    });
    
    setElements(elements.map(el => 
      el.id === elementId ? { ...el, x: finalX, y: finalY } : el
    ));
  };

  const handleDragStop = () => {
    setAlignmentGuides([]);
  };
  
  const handleClick = (elementId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveElement(elementId);
  };

  // Handle background click to clear selection
  const handleBackgroundClick = (event: React.MouseEvent) => {
    // Ensure this is a direct click on the background
    if (event.target === event.currentTarget) {
      setActiveElement(null);
      setAlignmentGuides([]);
    }
  };

  const toggleTextStyle = (style: keyof TextStyle) => {
    if (!activeElement) return;

    setElements(elements.map(el => {
      if (el.id === activeElement || (applyToAll && el.field === elements.find(e => e.id === activeElement)?.field)) {
        return {
          ...el,
          textStyle: {
            ...el.textStyle,
            [style]: !(el.textStyle?.[style] ?? false)
          }
        };
      }
      return el;
    }));
  };
  
  const getElementContent = (element: StickerElement, stickerIndex: number) => {
    if (!excelData || !element.field || element.isLabel) {
      return element.content;
    }
    return excelData.rows[stickerIndex][element.field] || element.content;
  };

  const getStickerIndices = () => {
    if (!excelData) return [];
    const totalStickers = Math.min(
      gridLayout.rows * gridLayout.cols,
      excelData.rows.length
    );
    return Array.from({ length: totalStickers }, (_, i) => i);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 flex-1 overflow-hidden" ref={editorRef}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-medium text-gray-900">Design Preview</h3>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value as PageSize)}
            className="rounded-md border-gray-300 text-sm"
          >
            <option value="A4">A4 Page</option>
            <option value="A3">A3 Page</option>
          </select>
          
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => toggleTextStyle('bold')}
              className={`p-1.5 rounded ${activeElement ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}
              disabled={!activeElement}
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleTextStyle('italic')}
              className={`p-1.5 rounded ${activeElement ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}
              disabled={!activeElement}
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleTextStyle('underline')}
              className={`p-1.5 rounded ${activeElement ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}
              disabled={!activeElement}
            >
              <Underline className="w-4 h-4" />
            </button>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={applyToAll}
              onChange={(e) => setApplyToAll(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Apply to all similar fields</span>
          </label>
        </div>
        <div className="text-sm text-gray-500">
          {unit === 'in' 
            ? `${template.width}" × ${template.height}"`
            : `${(template.width * 2.54).toFixed(1)}cm × ${(template.height * 2.54).toFixed(1)}cm`}
        </div>
      </div>
      
      <div className="overflow-auto" style={{ height: 'calc(100vh - 220px)' }}>
        <div 
          ref={ref}
          className="border border-gray-300 inline-block bg-gray-100 relative mx-auto"
          style={{ 
            width: gridWidthPx,
            height: gridHeightPx,
            maxWidth: pageDimensions[pageSize].width * PPI,
          }}
          onClick={handleBackgroundClick}
        >
          {/* Alignment Guides */}
          {alignmentGuides.map((guide, index) => (
            <div
              key={`guide-${index}`}
              className="absolute bg-blue-500"
              style={{
                ...(guide.type === 'vertical' 
                  ? {
                      width: '1px',
                      height: '100%',
                      left: `${guide.position}px`,
                    }
                  : {
                      width: '100%',
                      height: '1px',
                      top: `${guide.position}px`,
                    }
                ),
                zIndex: 1000,
              }}
            />
          ))}

          {getStickerIndices().map((stickerIndex) => {
            const row = Math.floor(stickerIndex / gridLayout.cols);
            const col = stickerIndex % gridLayout.cols;
            
            return (
              <div
                key={`grid-${row}-${col}`}
                className="absolute border border-dashed border-gray-200"
                style={{
                  width: displayWidth,
                  height: displayHeight,
                  left: col * displayWidth,
                  top: row * displayHeight,
                  padding: '8px',
                }}
              >
                <div
                  className="absolute inset-0 transition-all duration-200"
                  style={{
                    backgroundColor: template.backgroundColor,
                    borderWidth: `${template.borderWidth}px`,
                    borderStyle: 'solid',
                    borderColor: template.borderColor,
                    borderRadius: `${template.borderRadius}px`,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  }}
                  onClick={handleBackgroundClick} // Add click handler to clear selection on sticker background too
                />
                
                {elements.map((element) => (
                  <Draggable
                    key={`${element.id}-${row}-${col}`}
                    position={{ x: element.x, y: element.y }}
                    bounds="parent"
                    onDrag={(e, data) => handleDrag(element.id, e, data)}
                    onStop={handleDragStop}
                    disabled={!(row === 0 && col === 0)}
                  >
                    <div
                      id={`${element.id}-${row}-${col}`} // Add ID to help with click detection
                      className={`absolute cursor-move transition-all duration-200 ${
                        activeElement === element.id && row === 0 && col === 0
                          ? 'ring-2 ring-blue-500 ring-opacity-50'
                          : ''
                      }`}
                      style={{
                        width: element.width,
                        height: element.height,
                        backgroundColor: activeElement === element.id ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                        borderRadius: '4px',
                      }}
                      onClick={(e) => handleClick(element.id, e)}
                    >
                      <div
                        className="p-2 select-none transition-colors duration-200"
                        style={{
                          fontFamily: template.fontFamily,
                          fontSize: element.isLabel ? `${template.labelFontSize}px` : `${template.fontSize}px`,
                          color: element.isLabel ? '#64748b' : template.textColor,
                          fontWeight: (element.textStyle?.bold || element.isLabel) ? '600' : '400',
                          fontStyle: element.textStyle?.italic ? 'italic' : 'normal',
                          textDecoration: element.textStyle?.underline ? 'underline' : 'none',
                          lineHeight: '1.4',
                          letterSpacing: '0.01em',
                          textAlign: 'left',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {getElementContent(element, stickerIndex)}
                      </div>
                    </div>
                  </Draggable>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default StickerEditor;