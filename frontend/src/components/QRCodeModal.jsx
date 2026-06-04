import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { X, Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export const QRCodeModal = ({ isOpen, onClose, urlRecord }) => {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  if (!isOpen || !urlRecord) return null;

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const targetCode = urlRecord.customAlias || urlRecord.shortCode;
  const shortLink = `${backendUrl}/${targetCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shortLink);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current.querySelector('canvas');
    if (!canvas) {
      toast.error('Failed to generate QR Code image.');
      return;
    }
    
    // Create a larger high-res canvas for downloading
    const downloadCanvas = document.createElement('canvas');
    downloadCanvas.width = 1000;
    downloadCanvas.height = 1000;
    const ctx = downloadCanvas.getContext('2d');
    
    // Draw white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 1000, 1000);
    
    // Draw the QR canvas content scaled up
    ctx.drawImage(canvas, 50, 50, 900, 900);
    
    const url = downloadCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr_${targetCode}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('QR Code downloaded successfully!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden transition-colors duration-300 animate-scale-up">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">QR Code Generator</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-450 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Display */}
        <div className="flex flex-col items-center py-8">
          <div 
            ref={canvasRef}
            className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 dark:border-slate-805 mb-6"
          >
            {/* Standard canvas rendered in screen */}
            <QRCodeCanvas
              value={shortLink}
              size={200}
              level="H"
              includeMargin={false}
            />
          </div>
          
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 text-center max-w-xs break-all">
            {shortLink}
          </p>

          {/* Target original URL indicator */}
          <div className="w-full text-center px-4 mb-6">
            <span className="text-xs text-slate-400 block mb-1">Destined to:</span>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-350 truncate">
              {urlRecord.originalUrl}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-sm text-slate-700 dark:text-slate-300 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-purple-650 dark:hover:bg-purple-700 font-medium text-sm text-white shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default QRCodeModal;
