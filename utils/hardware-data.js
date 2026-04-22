/**
 * Hardware Library
 * Tiers: 1 (Integrated) to 10 (Enthusiast)
 */

export const GPU_DATA = [
  { brand: 'NVIDIA', series: 'RTX 40 Series', models: [
    { name: 'RTX 4090', tier: 10 }, { name: 'RTX 4080 Super', tier: 10 },
    { name: 'RTX 4080', tier: 10 }, { name: 'RTX 4070 Ti Super', tier: 9 },
    { name: 'RTX 4070 Ti', tier: 9 }, { name: 'RTX 4070 Super', tier: 9 },
    { name: 'RTX 4070', tier: 8 }, { name: 'RTX 4060 Ti', tier: 7 },
    { name: 'RTX 4060', tier: 7 }
  ]},
  { brand: 'NVIDIA', series: 'RTX 30 Series', models: [
    { name: 'RTX 3090 Ti', tier: 10 }, { name: 'RTX 3090', tier: 10 },
    { name: 'RTX 3080 Ti', tier: 9 }, { name: 'RTX 3080', tier: 9 },
    { name: 'RTX 3070 Ti', tier: 8 }, { name: 'RTX 3070', tier: 8 },
    { name: 'RTX 3060 Ti', tier: 7 }, { name: 'RTX 3060', tier: 6 },
    { name: 'RTX 3050', tier: 5 }
  ]},
  { brand: 'NVIDIA', series: 'Legacy / Mobile (MX & GTX)', models: [
    { name: 'GTX 1660 Ti', tier: 6 }, { name: 'GTX 1660', tier: 5 }, { name: 'GTX 1650 Ti', tier: 5 }, { name: 'GTX 1650', tier: 4 },
    { name: 'GTX 1080', tier: 6 }, { name: 'GTX 1070', tier: 5 }, { name: 'GTX 1060', tier: 4 }, { name: 'GTX 1050 Ti', tier: 4 },
    { name: 'GTX 980M', tier: 4 }, { name: 'GTX 970M', tier: 3 }, { name: 'GTX 960M', tier: 2 },
    { name: 'MX550', tier: 3 }, { name: 'MX450', tier: 3 }, { name: 'MX350', tier: 2 }, { name: 'MX250', tier: 2 }, { name: 'MX150', tier: 2 },
    { name: 'GT 1030', tier: 2 }
  ]},
  { brand: 'AMD', series: 'RX 7000 Series', models: [
    { name: 'RX 7900 XTX', tier: 10 }, { name: 'RX 7900 XT', tier: 10 },
    { name: 'RX 7900 GRE', tier: 9 }, { name: 'RX 7800 XT', tier: 8 },
    { name: 'RX 7700 XT', tier: 7 }, { name: 'RX 7600', tier: 6 }
  ]},
  { brand: 'AMD', series: 'RX 6000 Series', models: [
    { name: 'RX 6950 XT', tier: 10 }, { name: 'RX 6900 XT', tier: 10 },
    { name: 'RX 6800 XT', tier: 9 }, { name: 'RX 6800', tier: 8 },
    { name: 'RX 6750 XT', tier: 8 }, { name: 'RX 6700 XT', tier: 7 },
    { name: 'RX 6600 XT', tier: 5 }
  ]},
  { brand: 'AMD', series: 'Legacy (RX 500/400)', models: [
    { name: 'RX 590', tier: 5 }, { name: 'RX 580', tier: 5 }, { name: 'RX 570', tier: 4 }, { name: 'RX 560', tier: 3 },
    { name: 'RX 480', tier: 4 }, { name: 'RX 470', tier: 3 }, { name: 'RX 460', tier: 2 }
  ]},
  { brand: 'Integrated', series: 'Common IGPUs', models: [
    { name: 'Intel Iris Xe', tier: 2 },
    { name: 'Intel UHD Graphics', tier: 1 },
    { name: 'AMD Radeon 780M', tier: 3 },
    { name: 'AMD Radeon Graphics (Vega)', tier: 2 }
  ]}
];

export const CPU_DATA = [
  { brand: 'Intel', series: 'Core i9', models: [
    { name: 'i9-14900K', tier: 10 }, { name: 'i9-13900K', tier: 10 }, { name: 'i9-12900K', tier: 9 }
  ]},
  { brand: 'Intel', series: 'Core i7', models: [
    { name: 'i7-14700K', tier: 9 }, { name: 'i7-13700K', tier: 9 }, { name: 'i7-12700K', tier: 8 }
  ]},
  { brand: 'Intel', series: 'Core i5', models: [
    { name: 'i5-14600K', tier: 8 }, { name: 'i5-13600K', tier: 8 }, { name: 'i5-12600K', tier: 7 }, { name: 'i5-11400', tier: 6 }
  ]},
  { brand: 'AMD', series: 'Ryzen 9', models: [
    { name: 'Ryzen 9 7950X3D', tier: 10 }, { name: 'Ryzen 9 7900X', tier: 10 }, { name: 'Ryzen 9 5950X', tier: 9 }
  ]},
  { brand: 'AMD', series: 'Ryzen 7', models: [
    { name: 'Ryzen 7 7800X3D', tier: 9 }, { name: 'Ryzen 7 7700X', tier: 9 }, { name: 'Ryzen 7 5800X3D', tier: 8 }
  ]},
  { brand: 'AMD', series: 'Ryzen 5', models: [
    { name: 'Ryzen 5 7600X', tier: 8 }, { name: 'Ryzen 5 5600X', tier: 6 }, { name: 'Ryzen 5 3600', tier: 5 }
  ]}
];

export const RAM_OPTIONS = [
  { name: '64 GB', tier: 10 },
  { name: '32 GB', tier: 9 },
  { name: '16 GB', tier: 7 },
  { name: '12 GB', tier: 5 },
  { name: '8 GB', tier: 4 },
  { name: '4 GB', tier: 2 }
];
