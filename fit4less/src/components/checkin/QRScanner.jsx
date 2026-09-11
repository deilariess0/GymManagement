import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { QrCode, Camera, X } from 'lucide-react';
import Button from '../ui/Button';

const QRScanner = ({ onScanSuccess, onScanFailure }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const scannerRef = useRef(null);

  const qrCodeRegionId = "qr-reader";

  const startScanner = async () => {
    setError('');
    setIsScanning(true);
    
    const html5QrCode = new Html5Qrcode(qrCodeRegionId);
    scannerRef.current = html5QrCode;

    const config = {
      fps: 10,
      // IMPROVED: Responsive qrbox size for mobile
      qrbox: (viewfinderWidth, viewfinderHeight) => {
        const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
        const qrboxSize = Math.floor(minEdge * 0.7); // 70% of smaller dimension
        return { width: qrboxSize, height: qrboxSize };
      },
      aspectRatio: 1.0,
      // ADDED: Prefer back camera and specify resolution
      videoConstraints: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    };

    try {
      await html5QrCode.start(
        // CHANGED: Use specific camera constraints object
        { facingMode: "environment" },
        config,
        (decodedText) => {
          stopScanner();
          if (onScanSuccess) onScanSuccess(decodedText);
        },
        (errorMessage) => {
          if (onScanFailure) onScanFailure(errorMessage);
        }
      );
    } catch (err) {
      console.error("Error starting scanner:", err);
      
      // IMPROVED: More specific error messages
      let errorMsg = "Could not access camera.";
      if (err.name === 'NotAllowedError') {
        errorMsg = "Camera permission denied. Please allow access in your browser settings.";
      } else if (err.name === 'NotFoundError') {
        errorMsg = "No camera found on this device.";
      } else if (err.name === 'NotReadableError') {
        errorMsg = "Camera is already in use by another app.";
      }
      
      setError(errorMsg);
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="flex flex-col items-center p-5 gap-4">
      {/* Scanner Container */}
      <div className="relative w-full max-w-[300px] aspect-square rounded-3xl overflow-hidden bg-gray-900 border-2 border-gray-200">
        
        <div id={qrCodeRegionId} className="w-full h-full object-cover"></div>

        {!isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/90 backdrop-blur-sm z-10">
            <QrCode size={48} className="text-gray-400 mb-2" />
            <p className="text-[11.5px] text-gray-500 text-center px-6 leading-relaxed font-medium">
              Align member's QR code within the frame to scan.
            </p>
          </div>
        )}

        {isScanning && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
            <div className="relative w-64 h-64 border-2 border-white/30 rounded-2xl">
              <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-amber-400 rounded-tl-xl"></div>
              <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-amber-400 rounded-tr-xl"></div>
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-amber-400 rounded-bl-xl"></div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-amber-400 rounded-br-xl"></div>
              
              <div className="absolute left-2 right-2 h-0.5 bg-rose-500 rounded-full animate-scan shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-rose-500 font-medium text-center bg-rose-50 px-3 py-2 rounded-lg w-full max-w-[300px]">
          {error}
        </p>
      )}

      <div className="w-full max-w-[300px] flex flex-col gap-3 mt-2">
        {isScanning ? (
          <Button variant="secondary" onClick={stopScanner} className="w-full gap-2">
            <X size={18} />
            Stop Camera
          </Button>
        ) : (
          <Button variant="primary" onClick={startScanner} className="w-full gap-2">
            <Camera size={18} />
            Open Camera
          </Button>
        )}
        
        <button 
          onClick={() => onScanSuccess && onScanSuccess("MEMBER-101")}
          className="text-xs text-gray-400 underline hover:text-gray-600 transition-colors"
        >
          Simulate Scan (Dev)
        </button>
      </div>
    </div>
  );
};

export default QRScanner;