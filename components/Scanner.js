'use client';

import { useState, useEffect } from 'react';
import { useScanner } from '../hooks/useScanner';
import { GPU_DATA, CPU_DATA, RAM_OPTIONS } from '../utils/hardware-data';
import { Cpu, HardDrive, Monitor, ChevronDown, ChevronRight, Search, X, Check, Zap } from 'lucide-react';

export default function Scanner() {
  const { specs, updateSpecs, runAutoDetect } = useScanner();
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null); // 'gpu' | 'cpu' | 'ram'
  const [activeBrand, setActiveBrand] = useState(null);
  const [activeSeries, setActiveSeries] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [detectToast, setDetectToast] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return (
    <div className="rig-overhaul loading-skeleton flex flex-col gap-4">
      <div className="h-20 w-full bg-white/5 animate-pulse rounded-xl"></div>
      <div className="h-20 w-full bg-white/5 animate-pulse rounded-xl"></div>
      <div className="h-20 w-full bg-white/5 animate-pulse rounded-xl"></div>
    </div>
  );

  const toggleCategory = (cat) => {
    setActiveCategory(activeCategory === cat ? null : cat);
    setActiveBrand(null);
    setActiveSeries(null);
    setSearchTerm('');
  };

  const selectHardware = (type, item) => {
    const newSpecs = { ...specs };
    if (type === 'gpu') { newSpecs.gpu = item.name; newSpecs.gpuTier = item.tier; }
    if (type === 'cpu') { newSpecs.cpu = item.name; newSpecs.cpuTier = item.tier; }
    if (type === 'ram') { newSpecs.ram = item.name; newSpecs.ramTier = item.tier; }
    updateSpecs(newSpecs);
    setActiveCategory(null); // Close dropdown on selection
  };

  const renderNestedDropdown = (type, data) => {
    const term = searchTerm.toLowerCase().trim();

    // ── Search mode: flat results list across all series ─────────────────────
    if (term) {
      const matches = [];
      data.forEach(series => {
        series.models.forEach(model => {
          if (model.name.toLowerCase().includes(term)) {
            matches.push({ model, series: series.series, brand: series.brand });
          }
        });
      });

      return (
        <div className="modrinth-dropdown glass animate-in">
          <div className="dropdown-search">
            <Search size={14} />
            <input
              autoFocus
              placeholder={`Search ${type.toUpperCase()}s...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="dropdown-list">
            {matches.length === 0 ? (
              <div className="search-empty">No results for &ldquo;{searchTerm}&rdquo;</div>
            ) : (
              <div className="models-grid p-2">
                {matches.map(({ model, series }) => (
                  <button
                    key={model.name}
                    className={`model-btn ${specs?.[type] === model.name ? 'selected' : ''}`}
                    onClick={() => selectHardware(type, model)}
                  >
                    <span>{model.name}</span>
                    <span className="model-series-label">{series}</span>
                    {specs?.[type] === model.name && <Check size={12} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    // ── Browse mode: nested brand → series → model hierarchy ─────────────────
    const brands = [...new Set(data.map(d => d.brand))];

    return (
      <div className="modrinth-dropdown glass animate-in">
        <div className="dropdown-search">
          <Search size={14} />
          <input
            autoFocus
            placeholder={`Search ${type.toUpperCase()}s...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="dropdown-list">
          {brands.map(brand => (
            <div key={brand} className="brand-section">
              <button
                className={`brand-header ${activeBrand === brand ? 'active' : ''}`}
                onClick={() => setActiveBrand(activeBrand === brand ? null : brand)}
              >
                {brand}
                {activeBrand === brand ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              {activeBrand === brand && (
                <div className="series-list">
                  {data.filter(d => d.brand === brand).map(series => (
                    <div key={series.series} className="series-item">
                      <button
                        className={`series-header ${activeSeries === series.series ? 'active' : ''}`}
                        onClick={() => setActiveSeries(activeSeries === series.series ? null : series.series)}
                      >
                        {series.series}
                      </button>

                      {activeSeries === series.series && (
                        <div className="models-grid">
                          {series.models.map(model => (
                            <button
                              key={model.name}
                              className={`model-btn ${specs?.[type] === model.name ? 'selected' : ''}`}
                              onClick={() => selectHardware(type, model)}
                            >
                              <span>{model.name}</span>
                              {specs?.[type] === model.name && <Check size={12} />}
                            </button>
                          ))}
                          <button className="model-btn custom" onClick={() => selectHardware(type, { name: 'Custom / Other', tier: 5 })}>
                            <span>Custom / Other</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="rig-overhaul">
      <div className="rig-header">
        <div className="rig-header-row">
          <div>
            <h2>Rig Configuration</h2>
            <p>Select your hardware or auto-detect GPU & RAM.</p>
          </div>
          {/* Auto-detect hidden as requested, but logic preserved in code */}
          {/* 
          <button className="auto-detect-btn" onClick={() => {
            const result = runAutoDetect();
            if (result?.gpu && result?.ram) {
              setDetectToast(`Detected ${result.gpu} + ${result.ram}`);
            } else if (result?.gpu) {
              setDetectToast(`Detected ${result.gpu}. Select RAM manually.`);
            } else if (result?.ram) {
              setDetectToast(`Detected ${result.ram}. Select GPU manually.`);
            } else {
              setDetectToast('Could not detect hardware. Please select manually.');
            }
            setTimeout(() => setDetectToast(null), 4000);
          }}>
            <Zap size={16} /> Auto-Detect
          </button>
          */}
        </div>
        {detectToast && <div className="detect-toast">{detectToast}</div>}
      </div>

      <div className="selector-stack">
        {/* GPU */}
        <div className={`category-box ${activeCategory === 'gpu' ? 'open' : ''}`}>
          <button className="main-toggle glass" onClick={() => toggleCategory('gpu')}>
            <Monitor size={20} className="icon" />
            <div className="info">
              <span className="label">Graphics Card</span>
              <span className="value">{specs?.gpu || 'Not Selected'}</span>
            </div>
            <ChevronDown size={20} className="chevron" />
          </button>
          {activeCategory === 'gpu' && renderNestedDropdown('gpu', GPU_DATA)}
        </div>

        {/* CPU */}
        <div className={`category-box ${activeCategory === 'cpu' ? 'open' : ''}`}>
          <button className="main-toggle glass" onClick={() => toggleCategory('cpu')}>
            <Cpu size={20} className="icon" />
            <div className="info">
              <span className="label">Processor</span>
              <span className="value">{specs?.cpu || 'Not Selected'}</span>
            </div>
            <ChevronDown size={20} className="chevron" />
          </button>
          {activeCategory === 'cpu' && renderNestedDropdown('cpu', CPU_DATA)}
        </div>

        {/* RAM */}
        <div className={`category-box ${activeCategory === 'ram' ? 'open' : ''}`}>
          <button className="main-toggle glass" onClick={() => toggleCategory('ram')}>
            <HardDrive size={20} className="icon" />
            <div className="info">
              <span className="label">Memory</span>
              <span className="value">{specs?.ram || 'Not Selected'}</span>
            </div>
            <ChevronDown size={20} className="chevron" />
          </button>
          {activeCategory === 'ram' && (
            <div className="modrinth-dropdown glass animate-in">
              <div className="dropdown-list">
                <div className="models-grid p-2">
                  {RAM_OPTIONS.map(opt => (
                    <button 
                      key={opt.name}
                      className={`model-btn ${specs?.ram === opt.name ? 'selected' : ''}`}
                      onClick={() => selectHardware('ram', opt)}
                    >
                      <span>{opt.name}</span>
                      {specs?.ram === opt.name && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .rig-overhaul { margin: 2rem 0; max-width: 800px; }
        .rig-header { margin-bottom: 1.5rem; }
        .rig-header-row { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
        .rig-header h2 { font-size: 1.4rem; font-weight: 800; color: #fff; }
        .rig-header p { font-size: 0.9rem; color: var(--text-secondary); }

        .auto-detect-btn {
          display: none !important;
        }
        .auto-detect-btn:hover {
          background: linear-gradient(135deg, rgba(161, 204, 42, 0.3), rgba(161, 204, 42, 0.1));
          border-color: var(--accent);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(161, 204, 42, 0.15);
        }

        .detect-toast {
          margin-top: 0.75rem;
          padding: 0.6rem 1rem;
          background: rgba(161, 204, 42, 0.1);
          border: 1px solid rgba(161, 204, 42, 0.2);
          border-radius: 8px;
          color: var(--accent);
          font-size: 0.8rem;
          font-weight: 600;
          animation: slideDown 0.2s ease;
        }

        .selector-stack { display: flex; flex-direction: column; gap: 1.25rem; }
        .category-box { position: relative; }
        
        .main-toggle {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 1.5rem 2rem;
          border-radius: 16px;
          border: 1px solid var(--border);
          text-align: left;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
        }
        .main-toggle:hover { border-color: var(--accent); background: rgba(255,255,255,0.03); }
        .open .main-toggle { border-color: var(--accent); border-bottom-left-radius: 0; border-bottom-right-radius: 0; }

        .icon { color: var(--accent); margin-right: 2rem; flex-shrink: 0; }
        .info { flex-grow: 1; display: flex; flex-direction: column; gap: 0.2rem; }
        .label { font-size: 0.70rem; font-weight: 900; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; }
        .value { font-size: 1.15rem; font-weight: 800; margin-top: 0.2rem; }
        .chevron { transition: transform 0.2s; color: var(--text-secondary); margin-left: 1.5rem; }
        .open .chevron { transform: rotate(180deg); }

        .modrinth-dropdown {
          position: absolute;
          top: 100%; left: 0; right: 0;
          background: #0f0f0f;
          border: 1px solid var(--accent);
          border-top: none;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          max-height: 550px;
          overflow: hidden;
          z-index: 100;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 50px rgba(0,0,0,0.8);
        }

        .dropdown-search {
          padding: 1rem 1.5rem;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          gap: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .dropdown-search input {
          background: transparent;
          border: none;
          color: white;
          outline: none;
          font-size: 0.95rem;
          width: 100%;
          font-weight: 500;
        }

        .dropdown-list { 
          overflow-y: auto; 
          flex-grow: 1; 
          padding: 0.5rem 0; 
          scrollbar-width: thin;
          scrollbar-color: var(--accent) transparent;
        }
        .dropdown-list::-webkit-scrollbar { width: 6px; }
        .dropdown-list::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 10px; }
        
        .brand-section { border-bottom: 1px solid rgba(255,255,255,0.03); }
        .brand-header {
          appearance: none;
          -webkit-appearance: none;
          border: none;
          background: transparent;
          margin: 0;
          font-family: inherit;
          width: 100%;
          box-sizing: border-box;
          padding: 1.1rem 1.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #fff;
          font-weight: 800;
          cursor: pointer;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.2s;
        }
        .brand-header:hover { background: rgba(255,255,255,0.06); }
        .brand-header.active { color: var(--accent); background: rgba(161, 204, 42, 0.05); border-left: 4px solid var(--accent); }

        .series-list { background: rgba(0,0,0,0.3); padding: 0.75rem 0; border-bottom: 1px solid rgba(255,255,255,0.02); }
        .series-header {
          appearance: none;
          -webkit-appearance: none;
          border: none;
          background: transparent;
          margin: 0;
          font-family: inherit;
          width: 100%;
          box-sizing: border-box;
          padding: 0.9rem 2.85rem;
          text-align: left;
          color: #888;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .series-header:hover, .series-header.active { color: white; background: rgba(255,255,255,0.04); }
        .series-header.active { color: var(--accent); padding-left: 3.25rem; }

        .models-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 0.75rem;
          padding: 1rem 2.85rem 2rem 2.85rem;
          background: rgba(0,0,0,0.25);
        }
        .model-btn {
          appearance: none;
          -webkit-appearance: none;
          margin: 0;
          font-family: inherit;
          box-sizing: border-box;
          padding: 0.8rem 1.25rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          color: #eee;
          font-size: 0.8rem;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .model-btn:hover { border-color: var(--accent); background: rgba(161, 204, 42, 0.1); transform: translateY(-2px); }
        .model-btn.selected { border-color: var(--accent); color: var(--accent); background: rgba(161, 204, 42, 0.15); box-shadow: 0 4px 15px rgba(161, 204, 42, 0.1); }
        .model-btn.custom { border-style: dashed; opacity: 0.6; }
        .model-btn.custom:hover { opacity: 1; border-style: solid; }
        .model-series-label {
          display: block;
          font-size: 0.65rem;
          font-weight: 500;
          color: var(--text-secondary);
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .search-empty {
          padding: 2rem;
          text-align: center;
          color: var(--text-secondary);
          font-size: 0.85rem;
        }

        .p-2 { padding: 1rem !important; }

        .animate-in { animation: slideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
        @keyframes slideDown { 
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
