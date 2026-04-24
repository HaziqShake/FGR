/**
 * Hardware Library
 * Tiers: 1 (Integrated) to 10 (Enthusiast)
 */

export const GPU_DATA = [
  { brand: 'NVIDIA', series: 'RTX 50 Series (Next-Gen)', models: [
    { name: 'RTX 5090', tier: 10 }, { name: 'RTX 5080', tier: 10 },
    { name: 'RTX 5070', tier: 9 }
  ]},
  { brand: 'NVIDIA', series: 'RTX 40 Series', models: [
    { name: 'RTX 4090', tier: 10 }, { name: 'RTX 4080 Super', tier: 10 },
    { name: 'RTX 4080', tier: 10 }, { name: 'RTX 4070 Ti Super', tier: 9 },
    { name: 'RTX 4070 Ti', tier: 9 }, { name: 'RTX 4070 Super', tier: 9 },
    { name: 'RTX 4070', tier: 8 }, { name: 'RTX 4060 Ti', tier: 7 },
    { name: 'RTX 4060', tier: 7 }, { name: 'RTX 4050 (Mobile)', tier: 5 }
  ]},
  { brand: 'NVIDIA', series: 'RTX 30 Series', models: [
    { name: 'RTX 3090 Ti', tier: 10 }, { name: 'RTX 3090', tier: 10 },
    { name: 'RTX 3080 Ti', tier: 9 }, { name: 'RTX 3080', tier: 9 },
    { name: 'RTX 3070 Ti', tier: 8 }, { name: 'RTX 3070', tier: 8 },
    { name: 'RTX 3060 Ti', tier: 7 }, { name: 'RTX 3060', tier: 6 },
    { name: 'RTX 3050 Ti (Mobile)', tier: 5 }, { name: 'RTX 3050', tier: 5 }
  ]},
  { brand: 'NVIDIA', series: 'RTX 20 Series', models: [
    { name: 'RTX 2080 Ti', tier: 8 }, { name: 'RTX 2080 Super', tier: 7 },
    { name: 'RTX 2080', tier: 7 }, { name: 'RTX 2070 Super', tier: 6 },
    { name: 'RTX 2070', tier: 6 }, { name: 'RTX 2060 Super', tier: 5 },
    { name: 'RTX 2060', tier: 5 }
  ]},
  { brand: 'NVIDIA', series: 'GTX 16 Series', models: [
    { name: 'GTX 1660 Ti', tier: 6 }, { name: 'GTX 1660 Super', tier: 5 },
    { name: 'GTX 1660', tier: 5 }, { name: 'GTX 1650 Super', tier: 4 },
    { name: 'GTX 1650 Ti (Mobile)', tier: 4 }, { name: 'GTX 1650', tier: 4 }
  ]},
  { brand: 'NVIDIA', series: 'GTX 10 Series', models: [
    { name: 'GTX 1080 Ti', tier: 7 }, { name: 'GTX 1080', tier: 6 },
    { name: 'GTX 1070 Ti', tier: 6 }, { name: 'GTX 1070', tier: 5 },
    { name: 'GTX 1060 6GB', tier: 4 }, { name: 'GTX 1060 3GB', tier: 4 },
    { name: 'GTX 1050 Ti', tier: 4 }, { name: 'GTX 1050', tier: 3 }
  ]},
  { brand: 'AMD', series: 'RX 8000 Series (RDNA 4)', models: [
    { name: 'RX 8800 XT', tier: 9 }, { name: 'RX 8700 XT', tier: 8 },
    { name: 'RX 8600 XT', tier: 7 }
  ]},
  { brand: 'AMD', series: 'RX 7000 Series', models: [
    { name: 'RX 7900 XTX', tier: 10 }, { name: 'RX 7900 XT', tier: 10 },
    { name: 'RX 7900 GRE', tier: 9 }, { name: 'RX 7800 XT', tier: 8 },
    { name: 'RX 7700 XT', tier: 7 }, { name: 'RX 7600 XT', tier: 6 },
    { name: 'RX 7600', tier: 6 }
  ]},
  { brand: 'AMD', series: 'RX 6000 Series', models: [
    { name: 'RX 6950 XT', tier: 10 }, { name: 'RX 6900 XT', tier: 10 },
    { name: 'RX 6800 XT', tier: 9 }, { name: 'RX 6800', tier: 8 },
    { name: 'RX 6750 XT', tier: 8 }, { name: 'RX 6700 XT', tier: 7 },
    { name: 'RX 6700', tier: 6 }, { name: 'RX 6650 XT', tier: 6 },
    { name: 'RX 6600 XT', tier: 5 }, { name: 'RX 6600', tier: 5 }
  ]},
  { brand: 'Intel', series: 'Arc B-Series (Battlemage)', models: [
    { name: 'Arc B580', tier: 6 }, { name: 'Arc B570', tier: 5 }
  ]},
  { brand: 'Intel', series: 'Arc A-Series', models: [
    { name: 'Arc A770', tier: 6 }, { name: 'Arc A750', tier: 6 },
    { name: 'Arc A580', tier: 5 }, { name: 'Arc A380', tier: 3 }
  ]},
  { brand: 'Integrated', series: 'Latest IGPUs', models: [
    { name: 'Intel Arc Graphics (Lunar Lake)', tier: 3 },
    { name: 'AMD Radeon 890M', tier: 4 },
    { name: 'AMD Radeon 880M', tier: 3 },
    { name: 'AMD Radeon 780M', tier: 3 },
    { name: 'Intel Iris Xe', tier: 2 }
  ]}
];

export const CPU_DATA = [
  { brand: 'Intel', series: 'Core Ultra Series 2 (Arrow Lake)', models: [
    { name: 'Core Ultra 9 285K', tier: 10 }, { name: 'Core Ultra 7 265K', tier: 9 },
    { name: 'Core Ultra 5 245K', tier: 8 }
  ]},
  { brand: 'Intel', series: 'Core Ultra (Lunar Lake)', models: [
    { name: 'Core Ultra 9 288V', tier: 8 }, { name: 'Core Ultra 7 258V', tier: 7 }
  ]},
  { brand: 'Intel', series: 'Core i9', models: [
    { name: 'i9-14900KS', tier: 10 }, { name: 'i9-14900K', tier: 10 }, { name: 'i9-13900K', tier: 10 },
    { name: 'i9-12900K', tier: 9 }, { name: 'i9-11900K', tier: 8 }
  ]},
  { brand: 'Intel', series: 'Core i7', models: [
    { name: 'i7-14700K', tier: 9 }, { name: 'i7-13700K', tier: 9 }, { name: 'i7-12700K', tier: 8 }
  ]},
  { brand: 'Intel', series: 'Core i5', models: [
    { name: 'i5-14600K', tier: 8 }, { name: 'i5-13600K', tier: 8 }, { name: 'i5-12600K', tier: 7 }, { name: 'i5-12400', tier: 6 }
  ]},
  { brand: 'AMD', series: 'Ryzen 9000 Series (Zen 5)', models: [
    { name: 'Ryzen 9 9950X', tier: 10 }, { name: 'Ryzen 9 9900X', tier: 10 },
    { name: 'Ryzen 7 9700X', tier: 9 }, { name: 'Ryzen 5 9600X', tier: 8 }
  ]},
  { brand: 'AMD', series: 'Ryzen X3D (Gaming Focused)', models: [
    { name: 'Ryzen 7 9800X3D', tier: 10 }, { name: 'Ryzen 7 7800X3D', tier: 9 },
    { name: 'Ryzen 9 7950X3D', tier: 10 }, { name: 'Ryzen 7 5800X3D', tier: 8 }
  ]},
  { brand: 'AMD', series: 'Ryzen 7000 Series', models: [
    { name: 'Ryzen 9 7950X', tier: 10 }, { name: 'Ryzen 9 7900X', tier: 10 },
    { name: 'Ryzen 7 7700X', tier: 9 }, { name: 'Ryzen 5 7600X', tier: 8 }
  ]},
  { brand: 'AMD', series: 'Ryzen 5000 Series', models: [
    { name: 'Ryzen 9 5950X', tier: 9 }, { name: 'Ryzen 9 5900X', tier: 9 },
    { name: 'Ryzen 7 5800X', tier: 7 }, { name: 'Ryzen 5 5600X', tier: 6 }
  ]}
];

export const RAM_OPTIONS = [
  { name: '128 GB', tier: 10 },
  { name: '64 GB', tier: 10 },
  { name: '48 GB', tier: 9 },
  { name: '32 GB', tier: 9 },
  { name: '24 GB', tier: 8 },
  { name: '16 GB', tier: 7 },
  { name: '12 GB', tier: 5 },
  { name: '8 GB', tier: 4 },
  { name: '4 GB', tier: 2 }
];
