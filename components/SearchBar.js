'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, SortAsc, X, ChevronDown } from 'lucide-react';
import './SearchBar.css';

/**
 * Converts a hex color string to an rgb string.
 * Supports #fff and #ffffff formats.
 * Returns null if the input is not a valid hex color.
 */
function parseHexToRgb(hex) {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  if (!/^[0-9a-fA-F]+$/.test(cleanHex) || cleanHex.length !== 6) return null;
  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) return null;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r}, ${g}, ${b}`;
}

export default function SearchBar({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  showAdult,
  setShowAdult,
  accentColor, // Optional: hex string for accent color (e.g., '#67c1f5')
  placeholder = 'Search thousands of repacks...',
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    { value: 'newest', label: 'Newest Added' },
    { value: 'oldest', label: 'Oldest Added' },
    { value: 'abc', label: 'A to Z' },
    { value: 'zyx', label: 'Z to A' },
    { value: 'size-large', label: 'Largest Size' },
    { value: 'size-small', label: 'Smallest Size' },
    { value: 'popular', label: 'Popular' },
    { value: 'dlc-most', label: 'Most DLC' },
    { value: 'recent-release', label: 'Recent Release' },
  ];

  const currentLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Newest';

  const defaultAccent = '#a1cc2a';
  const effectiveAccent = accentColor || defaultAccent;
  const rgb = parseHexToRgb(effectiveAccent) || (effectiveAccent.toLowerCase() === '#67c1f5' ? '103, 193, 245' : '161, 204, 42');

  const searchBarStyle = {
    '--search-accent': effectiveAccent,
    '--search-accent-rgb': rgb,
    '--search-accent-hover-bg': `rgba(${rgb}, 0.08)`,
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="search-container glass" style={searchBarStyle}>
      <Search className="search-icon" size={24} />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="sort-box" ref={dropdownRef}>
        <SortAsc size={16} />
        <button
          type="button"
          className="sort-dropdown-btn"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {currentLabel}
          <ChevronDown size={14} className={`chevron ${dropdownOpen ? 'open' : ''}`} />
        </button>
        {dropdownOpen && (
          <div className="sort-dropdown-menu">
            {sortOptions.map((opt, index) => (
              <button
                key={opt.value}
                type="button"
                className={`sort-option ${sortBy === opt.value ? 'active' : ''}`}
                style={{ animationDelay: `${index * 30}ms` }}
                onClick={() => {
                  setSortBy(opt.value);
                  setDropdownOpen(false);
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className={`nsfw-toggle ${showAdult ? 'active' : ''}`} onClick={() => setShowAdult(!showAdult)}>
        <div className="nsfw-badge">{showAdult ? '18+' : 'Safe'}</div>
        <span>NSFW</span>
      </div>
      {searchTerm && <X className="clear-btn" size={18} onClick={() => setSearchTerm('')} />}
    </div>
  );
}