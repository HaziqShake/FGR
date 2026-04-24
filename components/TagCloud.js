'use client';

import { Plus, Minus } from 'lucide-react';

export default function TagCloud({ genres, tagStates, cycleTag, showAdult }) {
  return (
    <div className="tag-cloud">
      {genres.map(genre => {
        // Hide the Adult tag entirely unless NSFW mode is on
        if (genre === 'Adult' && !showAdult) return null;
        const state = tagStates[genre] || 'none';
        return (
          <button key={genre} className={`tag-chip ${state}`} onClick={() => cycleTag(genre)}>
            {state === 'included' && <Plus size={12} />}
            {state === 'excluded' && <Minus size={12} />}
            {genre}
          </button>
        );
      })}
    </div>
  );
}
