// src/components/checkin/QRScanner.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { QrCode, Camera, X, AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';

const QRScanner = ({ onScanSuccess, onScanFailure }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [lastScanned, setLastScanned] = useState('');
  const scannerRef = useRef(null);
  const scannedRef = useRef(false); // Prevents duplicate scans from same QR

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

  const handleScanResult = (decodedText) => {
    // Prevent multiple scans in quick succession
    if (scannedRef.current) return;
    scannedRef.current = true;

    console.log("✅ QR Detected:", decodedText);
    setLastScanned(decodedText);

    // Vibrate on success (mobile only)
    if (navigator.vibrate) navigator.vibrate(100);

    // Stop scanner then pass the data up
    stopScanner().then(() => {
      if (onScanSuccess) onScanSuccess(decodedText);
    });
  };

  const startScanner = async () => {
    setError('');
    setIsScanning(true);
    scannedRef.current = false;

    // Wait a tick for the DOM to render the qr-reader div
    await new Promise((resolve) => setTimeout(resolve, 200));

    const html5QrCode = new Html5Qrcode(qrCodeRegionId, {
      // Use native BarcodeDetector API (fast on mobile)
      useBarCodeDetectorIfSupported: true,
      verbose: false,
    });
    scannerRef.current = html5QrCode;

    const config = {
      // Higher FPS = faster detection
      fps: 15,

      // Larger scan box (80%) so big QR codes fit inside
      qrbox: (viewfinderWidth, viewfinderHeight) => {
        const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
        const qrboxSize = Math.floor(minEdge * 0.8);
        return { width: qrboxSize, height: qrboxSize };
      },

      aspectRatio: 1.0,
      disableFlip: false,

      // Only look for QR codes (skips other barcode types)
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],

      videoConstraints: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },

      // Experimental: better low-contrast detection
      experimentalFeatures: {
        useBarCodeDetectorIfSupported: true,
      },
    };

    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        handleScanResult,
        (errorMessage) => {
          // Called constantly when no QR detected — that's fine
          if (onScanFailure) onScanFailure(errorMessage);
        }
      );

      // iOS video attribute fixes
      applyVideoAttributes();
      setTimeout(applyVideoAttributes, 300);
      setTimeout(applyVideoAttributes, 800);

    } catch (err) {
      console.error("❌ Error starting scanner:", err);

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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  // Dynamic simulate: picks a random member from localStorage
  const handleSimulateScan = () => {
    const allMembers = JSON.parse(localStorage.getItem("fit4less_members") || "[]");
    if (allMembers.length === 0) {
      return alert("No members registered yet! Register one first.");
    }
    const randomMember = allMembers[Math.floor(Math.random() * allMembers.length)];
    const qrValue = randomMember.qrValue || randomMember.id;
    console.log("🎲 Simulating scan of:", qrValue);
    onScanSuccess && onScanSuccess(qrValue);
  };

  return (
    <div className="flex flex-col items-center gap-3 p-4 pb-6">
      
      {/* Insecure Connection Warning */}
      {isInsecureContext && !isScanning && (
        <div className="flex w-full max-w-[300px] items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600" />
          <p className="text-[11px] leading-relaxed text-amber-700">
            Camera requires <strong>https://</strong> on mobile. Use "Simulate Scan" to test below.
          </p>
        </div>
      )}

      {/* Scanner Container */}
      <div className="relative w-full max-w-[300px] overflow-hidden rounded-2xl border-2 border-ink-950/5 bg-gray-900">
        
        <div 
          id={qrCodeRegionId} 
          className="h-[280px] w-full object-cover"
        ></div>

        {/* Placeholder when not scanning */}
        {!isScanning && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-surface/95 backdrop-blur-sm">
            <QrCode size={40} className="mb-2 text-ink-950/30" />
            <p className="px-6 text-center text-[11px] font-medium leading-relaxed text-ink-950/50">
              Align member's QR code within the frame to scan.
            </p>
          </div>
        )}

        {/* Target overlay when scanning */}
        {isScanning && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <div className="relative h-[200px] w-[200px] rounded-2xl border-2 border-white/30">
              <div className="absolute -left-1 -top-1 h-7 w-7 rounded-tl-xl border-l-4 border-t-4 border-gold-400"></div>
              <div className="absolute -right-1 -top-1 h-7 w-7 rounded-tr-xl border-r-4 border-t-4 border-gold-400"></div>
              <div className="absolute -bottom-1 -left-1 h-7 w-7 rounded-bl-xl border-b-4 border-l-4 border-gold-400"></div>
              <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-br-xl border-b-4 border-r-4 border-gold-400"></div>
              <div className="absolute left-2 right-2 h-0.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-scan" />
            </div>
          </div>
        )}
      </div>

      {/* Last Scanned Debug Info */}
      {lastScanned && (
        <p className="text-[10px] font-bold text-emerald-600">
          ✓ Last detected: {lastScanned}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p className="w-full max-w-[300px] rounded-lg bg-rose-50 px-3 py-2 text-center text-[11px] font-medium text-rose-500">
          {error}
        </p>
      )}

      {/* Controls */}
      <div className="flex w-full max-w-[300px] flex-col gap-2">
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
          onClick={handleSimulateScan}
          className="text-[11px] text-ink-950/40 underline transition-colors hover:text-ink-950/60"
        >
          Simulate Scan (Dev)
        </button>
      </div>
    </div>
  );
};

export default QRScanner;