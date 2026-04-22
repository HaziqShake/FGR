'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { autoDetectHardware, isMobileDevice } from '../utils/hardware-detector';

const ScannerContext = createContext();

export function ScannerProvider({ children }) {
  const [isScanning, setIsScanning] = useState(true);
  const [specs, setSpecs] = useState(null);
  const [error, setError] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null); // Raw detection result for UI display

  useEffect(() => {
    const saved = localStorage.getItem('fitcheck_specs');
    if (saved) {
      setSpecs(JSON.parse(saved));
      setIsScanning(false);
      return;
    }

    // Auto-detect on first visit (desktop only)
    if (!isMobileDevice()) {
      try {
        const detected = autoDetectHardware();
        setDetectionResult(detected);

        // Only auto-apply if we got at least GPU or RAM
        if (detected.gpu || detected.ram) {
          const autoSpecs = {};
          if (detected.gpu) {
            autoSpecs.gpu = detected.gpu;
            autoSpecs.gpuTier = detected.gpuTier;
          }
          if (detected.ram) {
            autoSpecs.ram = detected.ram;
            autoSpecs.ramTier = detected.ramTier;
          }
          setSpecs(autoSpecs);
          localStorage.setItem('fitcheck_specs', JSON.stringify(autoSpecs));
        }
      } catch (err) {
        console.warn('Auto-detection failed:', err);
      }
    }

    setIsScanning(false);
  }, []);

  const updateSpecs = (newSpecs) => {
    setSpecs(newSpecs);
    localStorage.setItem('fitcheck_specs', JSON.stringify(newSpecs));
  };

  // Manual re-detect (triggered by user clicking "Auto-Detect" button)
  const runAutoDetect = () => {
    try {
      const detected = autoDetectHardware();
      setDetectionResult(detected);

      const newSpecs = { ...specs };
      if (detected.gpu) {
        newSpecs.gpu = detected.gpu;
        newSpecs.gpuTier = detected.gpuTier;
      }
      if (detected.ram) {
        newSpecs.ram = detected.ram;
        newSpecs.ramTier = detected.ramTier;
      }
      updateSpecs(newSpecs);
      return detected;
    } catch (err) {
      console.warn('Manual detection failed:', err);
      return null;
    }
  };

  const rescan = () => {
    localStorage.removeItem('fitcheck_specs');
    window.location.reload();
  };

  return (
    <ScannerContext.Provider value={{ specs, isScanning, error, rescan, updateSpecs, runAutoDetect, detectionResult }}>
      {children}
    </ScannerContext.Provider>
  );
}

export function useScannerContext() {
  const context = useContext(ScannerContext);
  if (!context) {
    throw new Error('useScannerContext must be used within a ScannerProvider');
  }
  return context;
}
