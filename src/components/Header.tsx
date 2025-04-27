import React from 'react';
import { Printer, Download, FileUp } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface HeaderProps {
  editorRef: React.RefObject<HTMLDivElement>;
}

const Header: React.FC<HeaderProps> = ({ editorRef }) => {
  const handleExport = async () => {
    if (!editorRef.current) return;
    
    try {
      // First ensure we're capturing the actual content dimensions
      const element = editorRef.current;
      const originalStyles = window.getComputedStyle(element);
      
      // Store original overflow style and temporarily hide overflow
      const originalOverflow = element.style.overflow;
      element.style.overflow = 'visible';
      
      // Ensure the element is rendered with its full dimensions visible
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        backgroundColor: '#ffffff', // Set a background color to avoid transparency issues
        logging: false,
        allowTaint: true,
        // Don't use foreignObjectRendering as it can cause issues in some browsers
        foreignObjectRendering: false,
        // Capture the full element content
        width: element.scrollWidth,
        height: element.scrollHeight,
        // These options help ensure we capture everything
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
      });
      
      // Restore original overflow style
      element.style.overflow = originalOverflow;
      
      // Calculate PDF dimensions - adjust for margins if needed
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Choose the appropriate page orientation based on content dimensions
      const orientation = imgWidth > imgHeight ? 'landscape' : 'portrait';
      
      // Create PDF with the right dimensions
      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'px',
        format: [imgWidth, imgHeight],
        hotfixes: ['px_scaling'], // Helps with scaling issues
      });
      
      // Add the image to the PDF, fitting to the page dimensions
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Save the PDF
      pdf.save('stickers.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="bg-white shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <FileUp className="h-8 w-8 text-blue-500 mr-2" />
            <h1 className="text-2xl font-semibold text-gray-800">
              StickZy
            </h1>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>
            <button 
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;