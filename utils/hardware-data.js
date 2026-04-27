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
  { brand: 'NVIDIA', series: 'GTX 900 Series', models: [
    { name: 'GTX 980 Ti', tier: 5 }, { name: 'GTX 980', tier: 5 },
    { name: 'GTX 970', tier: 4 }, { name: 'GTX 960', tier: 3 },
    { name: 'GTX 950', tier: 3 }
  ]},
  { brand: 'NVIDIA', series: 'GTX 700 Series', models: [
    { name: 'GTX 780 Ti', tier: 4 }, { name: 'GTX 780', tier: 4 },
    { name: 'GTX 770', tier: 3 }, { name: 'GTX 760', tier: 3 },
    { name: 'GTX 750 Ti', tier: 2 }, { name: 'GTX 750', tier: 2 }
  ]},
  { brand: 'NVIDIA', series: 'MX Laptop Series', models: [
    { name: 'MX570', tier: 4 }, { name: 'MX550', tier: 3 },
    { name: 'MX450', tier: 3 }, { name: 'MX350', tier: 2 },
    { name: 'MX250', tier: 2 }, { name: 'MX150', tier: 2 }
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
  { brand: 'AMD', series: 'RX 5000 Series (RDNA 1)', models: [
    { name: 'RX 5700 XT', tier: 7 }, { name: 'RX 5700', tier: 6 },
    { name: 'RX 5600 XT', tier: 6 }, { name: 'RX 5500 XT 8GB', tier: 5 },
    { name: 'RX 5500 XT 4GB', tier: 4 }, { name: 'RX 5300', tier: 4 }
  ]},
  { brand: 'AMD', series: 'RX 500 Series', models: [
    { name: 'RX 590', tier: 5 }, { name: 'RX 580 8GB', tier: 5 },
    { name: 'RX 580 4GB', tier: 4 }, { name: 'RX 570', tier: 4 },
    { name: 'RX 560', tier: 3 }, { name: 'RX 550', tier: 2 }
  ]},
  { brand: 'AMD', series: 'RX 400 Series', models: [
    { name: 'RX 480 8GB', tier: 5 }, { name: 'RX 480 4GB', tier: 4 },
    { name: 'RX 470', tier: 4 }, { name: 'RX 460', tier: 3 }
  ]},
  { brand: 'AMD', series: 'Vega Series', models: [
    { name: 'Radeon VII', tier: 8 },
    { name: 'RX Vega 64', tier: 7 }, { name: 'RX Vega 56', tier: 6 }
  ]},
  { brand: 'AMD', series: 'R9 / R7 Legacy', models: [
    { name: 'R9 390X', tier: 5 }, { name: 'R9 390', tier: 5 },
    { name: 'R9 290X', tier: 5 }, { name: 'R9 290', tier: 4 },
    { name: 'R9 380X', tier: 4 }, { name: 'R9 380', tier: 3 },
    { name: 'R9 270X', tier: 3 }, { name: 'R7 370', tier: 3 },
    { name: 'R7 360', tier: 2 }
  ]},
  { brand: 'Intel', series: 'Arc B-Series (Battlemage)', models: [
    { name: 'Arc B580', tier: 6 }, { name: 'Arc B570', tier: 5 }
  ]},
  { brand: 'Intel', series: 'Arc A-Series', models: [
    { name: 'Arc A770', tier: 6 }, { name: 'Arc A750', tier: 6 },
    { name: 'Arc A580', tier: 5 }, { name: 'Arc A380', tier: 3 }
  ]},
  { brand: 'Integrated', series: 'AMD APU Graphics (Modern)', models: [
    { name: 'AMD Radeon 890M', tier: 4 },
    { name: 'AMD Radeon 880M', tier: 3 }, { name: 'AMD Radeon 860M', tier: 3 },
    { name: 'AMD Radeon 780M', tier: 3 }, { name: 'AMD Radeon 760M', tier: 3 },
    { name: 'AMD Radeon 680M', tier: 3 }, { name: 'AMD Radeon 660M', tier: 2 }
  ]},
  { brand: 'Integrated', series: 'AMD APU Graphics (Legacy)', models: [
    { name: 'AMD Radeon Vega 11', tier: 2 }, { name: 'AMD Radeon Vega 10', tier: 2 },
    { name: 'AMD Radeon Vega 8', tier: 2 }, { name: 'AMD Radeon Vega 6', tier: 1 },
    { name: 'AMD Radeon Vega 3', tier: 1 }
  ]},
  { brand: 'Integrated', series: 'Intel Arc & Iris (Modern)', models: [
    { name: 'Intel Arc Graphics 140V', tier: 4 },
    { name: 'Intel Arc Graphics 130V', tier: 3 },
    { name: 'Intel Iris Xe Graphics', tier: 2 },
    { name: 'Intel UHD 770', tier: 2 }, { name: 'Intel UHD 750', tier: 2 },
    { name: 'Intel UHD 730', tier: 2 }
  ]},
  { brand: 'Integrated', series: 'Intel UHD / HD (Legacy)', models: [
    { name: 'Intel UHD 630', tier: 1 }, { name: 'Intel UHD 620', tier: 1 },
    { name: 'Intel UHD 617', tier: 1 }, { name: 'Intel UHD 615', tier: 1 },
    { name: 'Intel HD 630', tier: 1 }, { name: 'Intel HD 620', tier: 1 },
    { name: 'Intel HD 530', tier: 1 }, { name: 'Intel HD 520', tier: 1 },
    { name: 'Intel HD 4600', tier: 1 }, { name: 'Intel HD 4000', tier: 1 }
  ]}
];

export const CPU_DATA = [
  // ── Intel ──────────────────────────────────────────────────────────────────

  { brand: 'Intel', series: 'Core Ultra 200 Series (Arrow Lake)', models: [
    { name: 'Core Ultra 9 285K', tier: 10 },
    { name: 'Core Ultra 7 265K', tier: 9 }, { name: 'Core Ultra 7 265KF', tier: 9 },
    { name: 'Core Ultra 5 245K', tier: 8 }, { name: 'Core Ultra 5 245KF', tier: 8 }
  ]},

  { brand: 'Intel', series: 'Core Ultra 100 Series (Meteor Lake / Lunar Lake)', models: [
    { name: 'Core Ultra 9 288V', tier: 8 },
    { name: 'Core Ultra 7 258V', tier: 7 }, { name: 'Core Ultra 7 165H', tier: 7 }, { name: 'Core Ultra 7 155H', tier: 7 },
    { name: 'Core Ultra 5 125H', tier: 6 }
  ]},

  { brand: 'Intel', series: '14th Gen (Raptor Lake Refresh) i9', models: [
    { name: 'i9-14900KS', tier: 10 }, { name: 'i9-14900K', tier: 10 }, { name: 'i9-14900KF', tier: 10 },
    { name: 'i9-14900', tier: 9 },
    { name: 'i9-14900HX', tier: 9 }
  ]},

  { brand: 'Intel', series: '14th Gen (Raptor Lake Refresh) i7', models: [
    { name: 'i7-14700K', tier: 9 }, { name: 'i7-14700KF', tier: 9 },
    { name: 'i7-14700', tier: 8 },
    { name: 'i7-14700HX', tier: 8 }
  ]},

  { brand: 'Intel', series: '14th Gen (Raptor Lake Refresh) i5', models: [
    { name: 'i5-14600K', tier: 8 }, { name: 'i5-14600KF', tier: 8 },
    { name: 'i5-14500', tier: 7 }, { name: 'i5-14400', tier: 7 }, { name: 'i5-14400F', tier: 7 }
  ]},

  { brand: 'Intel', series: '14th Gen (Raptor Lake Refresh) i3', models: [
    { name: 'i3-14100', tier: 5 }, { name: 'i3-14100F', tier: 5 }
  ]},

  { brand: 'Intel', series: '13th Gen (Raptor Lake) i9', models: [
    { name: 'i9-13900KS', tier: 10 }, { name: 'i9-13900K', tier: 10 }, { name: 'i9-13900KF', tier: 10 },
    { name: 'i9-13900', tier: 9 },
    { name: 'i9-13900HX', tier: 9 }
  ]},

  { brand: 'Intel', series: '13th Gen (Raptor Lake) i7', models: [
    { name: 'i7-13700K', tier: 9 }, { name: 'i7-13700KF', tier: 9 },
    { name: 'i7-13700', tier: 8 },
    { name: 'i7-13700HX', tier: 8 }, { name: 'i7-13700H', tier: 7 }
  ]},

  { brand: 'Intel', series: '13th Gen (Raptor Lake) i5', models: [
    { name: 'i5-13600K', tier: 8 }, { name: 'i5-13600KF', tier: 8 },
    { name: 'i5-13500', tier: 7 }, { name: 'i5-13400', tier: 7 }, { name: 'i5-13400F', tier: 7 },
    { name: 'i5-13600H', tier: 7 }, { name: 'i5-13500HX', tier: 7 }
  ]},

  { brand: 'Intel', series: '13th Gen (Raptor Lake) i3', models: [
    { name: 'i3-13100', tier: 5 }, { name: 'i3-13100F', tier: 5 }
  ]},

  { brand: 'Intel', series: '12th Gen (Alder Lake) i9', models: [
    { name: 'i9-12900KS', tier: 9 }, { name: 'i9-12900K', tier: 9 }, { name: 'i9-12900KF', tier: 9 },
    { name: 'i9-12900', tier: 8 }
  ]},

  { brand: 'Intel', series: '12th Gen (Alder Lake) i7', models: [
    { name: 'i7-12700K', tier: 8 }, { name: 'i7-12700KF', tier: 8 },
    { name: 'i7-12700F', tier: 8 }, { name: 'i7-12700', tier: 8 },
    { name: 'i7-12700H', tier: 7 }, { name: 'i7-12800HX', tier: 7 }
  ]},

  { brand: 'Intel', series: '12th Gen (Alder Lake) i5', models: [
    { name: 'i5-12600K', tier: 7 }, { name: 'i5-12600KF', tier: 7 },
    { name: 'i5-12500', tier: 6 }, { name: 'i5-12400', tier: 6 }, { name: 'i5-12400F', tier: 6 },
    { name: 'i5-12500H', tier: 6 }
  ]},

  { brand: 'Intel', series: '12th Gen (Alder Lake) i3', models: [
    { name: 'i3-12100', tier: 5 }, { name: 'i3-12100F', tier: 5 }
  ]},

  { brand: 'Intel', series: '11th Gen (Rocket Lake) i9', models: [
    { name: 'i9-11900K', tier: 8 }, { name: 'i9-11900KF', tier: 8 }, { name: 'i9-11900', tier: 7 }
  ]},

  { brand: 'Intel', series: '11th Gen (Rocket Lake) i7', models: [
    { name: 'i7-11700K', tier: 7 }, { name: 'i7-11700KF', tier: 7 },
    { name: 'i7-11700F', tier: 7 }, { name: 'i7-11700', tier: 7 },
    { name: 'i7-1165G7', tier: 5 }, { name: 'i7-1185G7', tier: 5 }
  ]},

  { brand: 'Intel', series: '11th Gen (Rocket Lake) i5', models: [
    { name: 'i5-11600K', tier: 6 }, { name: 'i5-11600KF', tier: 6 },
    { name: 'i5-11400', tier: 6 }, { name: 'i5-11400F', tier: 6 },
    { name: 'i5-1135G7', tier: 4 }
  ]},

  { brand: 'Intel', series: '10th Gen (Comet Lake Refresh) i3', models: [
    { name: 'i3-10105', tier: 4 }, { name: 'i3-10105F', tier: 4 }
  ]},

  { brand: 'Intel', series: '10th Gen (Comet Lake) i9', models: [
    { name: 'i9-10900K', tier: 7 }, { name: 'i9-10900KF', tier: 7 }, { name: 'i9-10900', tier: 7 }
  ]},

  { brand: 'Intel', series: '10th Gen (Comet Lake) i7', models: [
    { name: 'i7-10700K', tier: 7 }, { name: 'i7-10700KF', tier: 7 },
    { name: 'i7-10700', tier: 6 }, { name: 'i7-10700F', tier: 6 },
    { name: 'i7-1065G7', tier: 4 }
  ]},

  { brand: 'Intel', series: '10th Gen (Comet Lake) i5', models: [
    { name: 'i5-10600K', tier: 6 },
    { name: 'i5-10400', tier: 5 }, { name: 'i5-10400F', tier: 5 },
    { name: 'i5-10300H', tier: 5 }
  ]},

  { brand: 'Intel', series: '10th Gen (Comet Lake) i3', models: [
    { name: 'i3-10100', tier: 4 }, { name: 'i3-10100F', tier: 4 }
  ]},

  { brand: 'Intel', series: '9th Gen (Coffee Lake Refresh) i9', models: [
    { name: 'i9-9900KS', tier: 7 }, { name: 'i9-9900K', tier: 7 }, { name: 'i9-9900KF', tier: 7 },
    { name: 'i9-9900', tier: 6 }
  ]},

  { brand: 'Intel', series: '9th Gen (Coffee Lake Refresh) i7', models: [
    { name: 'i7-9700K', tier: 6 }, { name: 'i7-9700KF', tier: 6 }
  ]},

  { brand: 'Intel', series: '9th Gen (Coffee Lake Refresh) i5', models: [
    { name: 'i5-9600K', tier: 5 }, { name: 'i5-9600KF', tier: 5 }, { name: 'i5-9400F', tier: 5 }
  ]},

  { brand: 'Intel', series: '9th Gen (Coffee Lake) Laptop H-Series', models: [
    { name: 'i9-9880H', tier: 6 },
    { name: 'i7-9750H', tier: 5 }, { name: 'i7-9850H', tier: 5 },
    { name: 'i5-9300H', tier: 4 }, { name: 'i5-9300HF', tier: 4 }
  ]},

  { brand: 'Intel', series: '8th Gen (Coffee Lake) i9', models: [
    { name: 'i9-8950HK', tier: 6 }
  ]},

  { brand: 'Intel', series: '8th Gen (Coffee Lake) i7', models: [
    { name: 'i7-8700K', tier: 6 }, { name: 'i7-8700', tier: 5 },
    { name: 'i7-8750H', tier: 5 }, { name: 'i7-8850H', tier: 5 }
  ]},

  { brand: 'Intel', series: '8th Gen (Coffee Lake) i5', models: [
    { name: 'i5-8600K', tier: 5 }, { name: 'i5-8400', tier: 4 },
    { name: 'i5-8300H', tier: 4 }
  ]},

  { brand: 'Intel', series: '8th Gen (Whiskey Lake / KBL-R) Laptop U-Series', models: [
    { name: 'i7-8565U', tier: 4 }, { name: 'i7-8550U', tier: 4 },
    { name: 'i5-8265U', tier: 3 }, { name: 'i5-8250U', tier: 3 },
    { name: 'i3-8145U', tier: 3 }, { name: 'i3-8130U', tier: 2 }
  ]},

  { brand: 'Intel', series: '7th Gen (Kaby Lake) i7', models: [
    { name: 'i7-7700K', tier: 5 }, { name: 'i7-7700', tier: 4 },
    { name: 'i7-7700HQ', tier: 4 }
  ]},

  { brand: 'Intel', series: '7th Gen (Kaby Lake) i5', models: [
    { name: 'i5-7600K', tier: 4 }, { name: 'i5-7400', tier: 3 },
    { name: 'i5-7300HQ', tier: 3 }
  ]},

  { brand: 'Intel', series: '7th Gen (Kaby Lake) Laptop U-Series', models: [
    { name: 'i7-7500U', tier: 3 }, { name: 'i5-7200U', tier: 3 },
    { name: 'i3-7100U', tier: 2 }
  ]},

  { brand: 'Intel', series: '6th Gen (Skylake) i7', models: [
    { name: 'i7-6700K', tier: 4 }, { name: 'i7-6700', tier: 4 },
    { name: 'i7-6700HQ', tier: 4 }
  ]},

  { brand: 'Intel', series: '6th Gen (Skylake) i5', models: [
    { name: 'i5-6600K', tier: 3 }, { name: 'i5-6500', tier: 3 },
    { name: 'i5-6300HQ', tier: 3 }
  ]},

  { brand: 'Intel', series: '6th Gen (Skylake) Laptop U-Series', models: [
    { name: 'i7-6600U', tier: 3 }, { name: 'i7-6500U', tier: 3 },
    { name: 'i5-6300U', tier: 2 }, { name: 'i5-6200U', tier: 2 },
    { name: 'i3-6100U', tier: 2 }
  ]},

  // ── AMD ────────────────────────────────────────────────────────────────────

  { brand: 'AMD', series: 'Ryzen 9000 Series (Zen 5)', models: [
    { name: 'Ryzen 9 9950X', tier: 10 }, { name: 'Ryzen 9 9900X', tier: 10 },
    { name: 'Ryzen 7 9700X', tier: 9 }, { name: 'Ryzen 7 9700', tier: 8 },
    { name: 'Ryzen 5 9600X', tier: 8 }, { name: 'Ryzen 5 9600', tier: 7 }
  ]},

  { brand: 'AMD', series: 'Ryzen 9000 Mobile (Strix Point / Zen 5)', models: [
    { name: 'Ryzen AI 9 HX 370', tier: 9 }, { name: 'Ryzen AI 9 365', tier: 8 },
    { name: 'Ryzen 9 9955HX', tier: 9 }, { name: 'Ryzen 7 9850HX', tier: 8 }
  ]},

  { brand: 'AMD', series: 'Ryzen 7000 X3D (Zen 4 Gaming)', models: [
    { name: 'Ryzen 9 7950X3D', tier: 10 },
    { name: 'Ryzen 7 7800X3D', tier: 10 }
  ]},

  { brand: 'AMD', series: 'Ryzen 7000 Series (Zen 4)', models: [
    { name: 'Ryzen 9 7950X', tier: 10 }, { name: 'Ryzen 9 7900X', tier: 10 }, { name: 'Ryzen 9 7900', tier: 9 },
    { name: 'Ryzen 7 7700X', tier: 9 }, { name: 'Ryzen 7 7700', tier: 8 },
    { name: 'Ryzen 5 7600X', tier: 8 }, { name: 'Ryzen 5 7600', tier: 7 },
    { name: 'Ryzen 5 7500F', tier: 7 }
  ]},

  { brand: 'AMD', series: 'Ryzen 7000 Mobile (Dragon Range / Phoenix)', models: [
    { name: 'Ryzen 9 7945HX', tier: 9 }, { name: 'Ryzen 9 7940HX', tier: 9 },
    { name: 'Ryzen 7 7745HX', tier: 8 }, { name: 'Ryzen 7 7740H', tier: 7 },
    { name: 'Ryzen 5 7640H', tier: 6 }, { name: 'Ryzen 5 7535H', tier: 6 }
  ]},

  { brand: 'AMD', series: 'Ryzen 5000 X3D (Zen 3)', models: [
    { name: 'Ryzen 7 5800X3D', tier: 9 }
  ]},

  { brand: 'AMD', series: 'Ryzen 5000 Series (Zen 3)', models: [
    { name: 'Ryzen 9 5950X', tier: 9 }, { name: 'Ryzen 9 5900X', tier: 9 },
    { name: 'Ryzen 7 5800X', tier: 8 }, { name: 'Ryzen 7 5700X', tier: 7 },
    { name: 'Ryzen 5 5600X', tier: 7 }, { name: 'Ryzen 5 5600', tier: 6 }, { name: 'Ryzen 5 5600G', tier: 5 },
    { name: 'Ryzen 5 5500', tier: 5 }, { name: 'Ryzen 3 5300G', tier: 4 }
  ]},

  { brand: 'AMD', series: 'Ryzen 5000 Mobile (Cezanne / Zen 3)', models: [
    { name: 'Ryzen 9 5900HX', tier: 8 }, { name: 'Ryzen 9 5900HS', tier: 8 },
    { name: 'Ryzen 7 5800H', tier: 7 }, { name: 'Ryzen 7 5800HS', tier: 7 },
    { name: 'Ryzen 5 5600H', tier: 6 }, { name: 'Ryzen 5 5600HS', tier: 6 }
  ]},

  { brand: 'AMD', series: 'Ryzen 4000 Series (Zen 2 / Renoir)', models: [
    { name: 'Ryzen 9 4900H', tier: 7 }, { name: 'Ryzen 7 4800H', tier: 7 }, { name: 'Ryzen 7 4800U', tier: 5 },
    { name: 'Ryzen 5 4600H', tier: 6 }, { name: 'Ryzen 5 4600U', tier: 4 },
    { name: 'Ryzen 3 4300U', tier: 3 }
  ]},

  { brand: 'AMD', series: 'Ryzen 3000 Series (Zen 2)', models: [
    { name: 'Ryzen 9 3950X', tier: 8 }, { name: 'Ryzen 9 3900X', tier: 8 }, { name: 'Ryzen 9 3900XT', tier: 8 },
    { name: 'Ryzen 7 3800XT', tier: 7 }, { name: 'Ryzen 7 3800X', tier: 7 }, { name: 'Ryzen 7 3700X', tier: 7 },
    { name: 'Ryzen 5 3600X', tier: 6 }, { name: 'Ryzen 5 3600XT', tier: 6 }, { name: 'Ryzen 5 3600', tier: 6 },
    { name: 'Ryzen 5 3500X', tier: 5 }, { name: 'Ryzen 3 3300X', tier: 4 }, { name: 'Ryzen 3 3100', tier: 4 }
  ]},

  { brand: 'AMD', series: 'Ryzen 3000 Mobile (Picasso / Zen+)', models: [
    { name: 'Ryzen 7 3750H', tier: 5 }, { name: 'Ryzen 7 3700U', tier: 4 },
    { name: 'Ryzen 5 3550H', tier: 4 }, { name: 'Ryzen 5 3500U', tier: 4 }
  ]},

  { brand: 'AMD', series: 'Ryzen 2000 Series (Zen+)', models: [
    { name: 'Ryzen 7 2700X', tier: 6 }, { name: 'Ryzen 7 2700', tier: 5 },
    { name: 'Ryzen 5 2600X', tier: 5 }, { name: 'Ryzen 5 2600', tier: 5 },
    { name: 'Ryzen 3 2200G', tier: 3 }
  ]},

  { brand: 'AMD', series: 'Ryzen 1000 Series (Zen)', models: [
    { name: 'Ryzen 7 1800X', tier: 5 }, { name: 'Ryzen 7 1700X', tier: 5 }, { name: 'Ryzen 7 1700', tier: 5 },
    { name: 'Ryzen 5 1600X', tier: 4 }, { name: 'Ryzen 5 1600', tier: 4 }, { name: 'Ryzen 5 1500X', tier: 4 },
    { name: 'Ryzen 3 1300X', tier: 3 }, { name: 'Ryzen 3 1200', tier: 3 }
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
