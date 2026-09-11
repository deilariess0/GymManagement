import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { QrCode, Camera, X, AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';

const QRScanner = ({ onScanSuccess, onScanFailure }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const scannerRef = useRef(null);

  const qrCodeRegionId = "qr-reader";

  const isInsecureContext = 
    typeof window !== 'undefined' &&
    window.location.protocol === 'http:' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1';

  const applyVideoAttributes = () => {
    const video = document.querySelector(`#${qrCodeRegionId} video`);
    if (video) {
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.setAttribute('muted', 'true');
      video.setAttribute('autoplay', 'true');
      video.muted = true;
      video.play().catch(() => {});
    }
  };

  const startScanner = async () => {
    setError('');
    setIsScanning(true);

    await new Promise((resolve) => setTimeout(resolve, 150));

    const html5QrCode = new Html5Qrcode(qrCodeRegionId);
    scannerRef.current = html5QrCode;

    const config = {
      fps: 10,
      qrbox: (viewfinderWidth, viewfinderHeight) => {
        const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
        const qrboxSize = Math.floor(minEdge * 0.7);
        return { width: qrboxSize, height: qrboxSize };
      },
      aspectRatio: 1.0,
      videoConstraints: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    };

    try {
      await html5QrCode.start(
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

      applyVideoAttributes();
      setTimeout(applyVideoAttributes, 300);
      setTimeout(applyVideoAttributes, 800);

    } catch (err) {
      console.error("Error starting scanner:", err);
      
      let errorMsg = "Could not access camera.";
      if (err.name === 'NotAllowedError' || err.message?.includes('Permission')) {
        errorMsg = "Camera permission denied. Please allow camera access in your browser settings.";
      } else if (err.name === 'NotFoundError') {
        errorMsg = "No camera found on this device.";
      } else if (err.name === 'NotReadableError') {
        errorMsg = "Camera is already in use by another app.";
      } else if (isInsecureContext) {
        errorMsg = "Camera requires HTTPS. Please use a secure connection (https://).";
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
    <div className="flex flex-col items-center gap-3 p-4">
      
      {/* Insecure Connection Warning */}
      {isInsecureContext && !isScanning && (
        <div className="flex w-full max-w-[280px] items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
          <AlertTriangle size={16} className="shrink-0 text-amber-600 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-amber-700">
            Camera requires <strong>https://</strong> on mobile. Use "Simulate Scan" to test below.
          </p>
        </div>
      )}

      {/* Scanner Container - Compact on Mobile */}
      <div className="relative w-full max-w-[280px] overflow-hidden rounded-2xl border-2 border-gray-200 bg-gray-900">
        <div 
          id={qrCodeRegionId} 
          className="h-[280px] w-full object-cover"
        ></div>

        {!isScanning && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-50/95 backdrop-blur-sm">
            <QrCode size={40} className="mb-2 text-gray-400" />
            <p className="px-6 text-center text-[11px] font-medium leading-relaxed text-gray-500">
              Align member's QR code within the frame to scan.
            </p>
          </div>
        )}

        {isScanning && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <div className="relative h-[180px] w-[180px] rounded-2xl border-2 border-white/30">
              <div className="absolute -left-1 -top-1 h-7 w-7 rounded-tl-xl border-l-4 border-t-4 border-amber-400"></div>
              <div className="absolute -right-1 -top-1 h-7 w-7 rounded-tr-xl border-r-4 border-t-4 border-amber-400"></div>
              <div className="absolute -bottom-1 -left-1 h-7 w-7 rounded-bl-xl border-b-4 border-l-4 border-amber-400"></div>
              <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-br-xl border-b-4 border-r-4 border-amber-400"></div>
              <div className="absolute left-2 right-2 h-0.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-scan" />
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="w-full max-w-[280px] rounded-lg bg-rose-50 px-3 py-2 text-center text-[11px] font-medium text-rose-500">
          {error}
        </p>
      )}

      {/* Controls - Always Visible */}
      <div className="flex w-full max-w-[280px] flex-col gap-2">
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
          className="text-[11px] text-gray-400 underline transition-colors hover:text-gray-600"
        >
          Simulate Scan (Dev)
        </button>
      </div>
    </div>
  );
};

export default QRScanner;