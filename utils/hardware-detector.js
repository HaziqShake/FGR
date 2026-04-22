/**
 * FitCheck Hardware Detection Engine (HDE) v2.0
 * Detects GPU via WebGL, RAM via navigator.deviceMemory.
 * CPU model cannot be detected in-browser (privacy sandbox).
 */

import { GPU_DATA, RAM_OPTIONS } from './hardware-data';
import { getGPUTier } from './hardware-tiers';

/**
 * Detect if current device is mobile/tablet
 */
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || (navigator.maxTouchPoints > 0 && window.innerWidth < 1024);
};

/**
 * Extract raw GPU string from WebGL
 */
export const detectRawGPU = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return null;

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return null;

    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    return { renderer, vendor };
  } catch (e) {
    console.warn('HDE: WebGL GPU detection failed:', e);
    return null;
  }
};

/**
 * Normalize a raw WebGL GPU string into a clean name
 * e.g. "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11)" -> "GeForce RTX 3060"
 */
export const normalizeGPUName = (gpuString) => {
  if (!gpuString || gpuString === 'Unknown') return null;

  let name = gpuString;

  // Strip ANGLE(...) wrapper
  const angleMatch = name.match(/ANGLE\s*\(([^)]+)\)/i);
  if (angleMatch) name = angleMatch[1];

  // Split by comma, take the part with the GPU model
  const parts = name.split(',').map(p => p.trim());
  // The GPU model is usually the longest part or the one with known keywords
  const gpuPart = parts.find(p => 
    /geforce|radeon|intel|rtx|gtx|rx\s?\d|uhd|iris|hd\s?\d/i.test(p)
  ) || parts[1] || parts[0];

  name = gpuPart;

  // Strip Direct3D/driver version suffixes
  name = name.replace(/Direct3D\d*\s*vs_[\d_]+\s*ps_[\d_]+/gi, '');
  name = name.replace(/D3D\d+/gi, '');
  name = name.replace(/OpenGL\s*Engine/gi, '');
  name = name.replace(/\(R\)/gi, '');
  name = name.replace(/\(TM\)/gi, '');

  // Clean up NVIDIA prefix duplication: "NVIDIA GeForce RTX 3060" -> "GeForce RTX 3060"  
  name = name.replace(/^NVIDIA\s+/i, '');
  name = name.replace(/^AMD\s+/i, '');
  name = name.replace(/^Intel\s+/i, '');

  return name.trim() || null;
};

/**
 * Fuzzy-match a normalized GPU name against our GPU_DATA library.
 * Returns the best matching { name, tier } or null.
 */
export const fuzzyMatchGPU = (normalizedName) => {
  if (!normalizedName) return null;

  const lower = normalizedName.toLowerCase();

  // Try exact substring match first (most reliable)
  for (const group of GPU_DATA) {
    for (const model of group.models) {
      const modelLower = model.name.toLowerCase();
      if (lower.includes(modelLower) || modelLower.includes(lower)) {
        return model;
      }
    }
  }

  // Try partial keyword matching (e.g. "GeForce RTX 3060" should match "RTX 3060")
  // Extract the core model identifier
  const coreMatch = lower.match(/(rtx\s*\d{4}\s*(?:ti|super)?|gtx\s*\d{3,4}\s*(?:ti)?|rx\s*\d{3,4}\s*(?:xt|xtx)?|mx\s*\d{3}|gt\s*\d{4}|iris\s*xe|uhd\s*(?:graphics|\d{3})|radeon\s*(?:graphics|vega|\d{3}m?))/i);
  
  if (coreMatch) {
    const core = coreMatch[1].toLowerCase().replace(/\s+/g, ' ');
    for (const group of GPU_DATA) {
      for (const model of group.models) {
        if (model.name.toLowerCase().replace(/\s+/g, ' ').includes(core)) {
          return model;
        }
      }
    }
  }

  // Last resort: use the tier system directly
  const tier = getGPUTier(normalizedName);
  if (tier > 0) {
    return { name: normalizedName, tier };
  }

  return null;
};

/**
 * Detect approximate RAM via navigator.deviceMemory
 * Returns the closest RAM_OPTIONS entry or null
 */
export const detectRAM = () => {
  if (typeof navigator === 'undefined' || !navigator.deviceMemory) return null;

  const detectedGB = navigator.deviceMemory;
  
  // Find closest RAM option (deviceMemory returns 2, 4, 8, 16, 32)
  let best = null;
  let bestDiff = Infinity;
  for (const opt of RAM_OPTIONS) {
    const optGB = parseInt(opt.name);
    const diff = Math.abs(optGB - detectedGB);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = opt;
    }
  }

  return best;
};

/**
 * Detect CPU core count (this is all we can get)
 */
export const detectCPUCores = () => {
  if (typeof navigator === 'undefined') return null;
  return navigator.hardwareConcurrency || null;
};

/**
 * Full auto-detect pipeline.
 * Returns { gpu, gpuTier, ram, ramTier, cpuCores, autoDetected: true } or partial results.
 */
export const autoDetectHardware = () => {
  const result = { autoDetected: true };

  // GPU
  const rawGPU = detectRawGPU();
  if (rawGPU) {
    const normalized = normalizeGPUName(rawGPU.renderer);
    const matched = fuzzyMatchGPU(normalized);
    if (matched) {
      result.gpu = matched.name;
      result.gpuTier = matched.tier;
      result.gpuRaw = rawGPU.renderer; // Keep raw for debugging
    }
  }

  // RAM
  const ramMatch = detectRAM();
  if (ramMatch) {
    result.ram = ramMatch.name;
    result.ramTier = ramMatch.tier;
  }

  // CPU cores (informational only, can't determine model)
  result.cpuCores = detectCPUCores();

  return result;
};

// Legacy exports for backward compatibility
export const getHardwareSpecs = () => {
  const raw = detectRawGPU();
  return {
    cpuCores: detectCPUCores() || 'Unknown',
    ram: navigator?.deviceMemory ? `${navigator.deviceMemory} GB` : 'Unknown',
    gpu: raw?.renderer || 'Unknown',
    gpuVendor: raw?.vendor || 'Unknown'
  };
};
