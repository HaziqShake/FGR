'use client';

import { Plus, Minus } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import './TagCloud.css';

function parseHexToRgb(hex) {
  if (!hex) return null;
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) cleanHex = cleanHex.split('').map(c => c + c).join('');
  if (!/^[0-9a-fA-F]+$/.test(cleanHex) || cleanHex.length !== 6) return null;
  const num = parseInt(cleanHex, 16);
  return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
}

export default function TagCloud({ genres, tagStates, cycleTag, showAdult, accentColor }) {
  const prevShowAdult = useRef(showAdult);
  // Bump key each time Adult tag freshly appears so the element remounts and animation replays
  const [adultAnimKey, setAdultAnimKey] = useState(0);

  const rgb = parseHexToRgb(accentColor) || (accentColor?.toLowerCase() === '#67c1f5' ? '103, 193, 245' : '74, 222, 128');
  const tagStyle = accentColor ? {
    '--tag-accent': accentColor,
    '--tag-accent-rgb': rgb,
  } : {};

  useEffect(() => {
    if (showAdult && !prevShowAdult.current) {
      setAdultAnimKey(k => k + 1);
    }
    prevShowAdult.current = showAdult;
  }, [showAdult]);

  // Split genres into two halves for balanced rows
  const mid = Math.ceil(genres.length / 2);
  const firstHalf = genres.slice(0, mid);
  const secondHalf = genres.slice(mid);

  const renderChip = (genre) => {
    const isAdult = genre === 'Adult';
    if (isAdult && !showAdult) return null;
    const state = tagStates[genre] || 'none';
    const reactKey = isAdult ? `adult-${adultAnimKey}` : genre;

    return (
      <button
        key={reactKey}
        type="button"
        className={`tag-chip ${state}${isAdult ? ' adult-appearing' : ''}`}
        onClick={() => cycleTag(genre)}
        title={`${genre} (${state === 'none' ? 'Click to include' : state === 'included' ? 'Click to exclude' : 'Click to reset'})`}
      >
        {state === 'included' && (
          <span key="included-icon" className="chip-icon-pop chip-icon-plus" aria-hidden="true">
            <Plus className="icon-svg" size={11} strokeWidth={3} />
          </span>
        )}
        {state === 'excluded' && (
          <span key="excluded-icon" className="chip-icon-pop chip-icon-minus" aria-hidden="true">
            <Minus className="icon-svg" size={11} strokeWidth={3} />
          </span>
        )}
        <span className="chip-text">{genre}</span>
      </button>
    );
  };

  return (
    <div className="tag-cloud" style={tagStyle}>
      <div className="tag-cloud-row">
        {firstHalf.map(renderChip)}
      </div>
      <div className="tag-cloud-row">
        {secondHalf.map(renderChip)}
      </div>
    </div>
  );
}