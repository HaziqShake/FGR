'use client';

import { Search, SortAsc, X } from 'lucide-react';

export default function SearchBar({ searchTerm, setSearchTerm, sortBy, setSortBy, showAdult, setShowAdult }) {
  return (
    <div className="search-container glass">
      <Search className="search-icon" size={24} />
      <input
        type="text"
        placeholder="Search thousands of repacks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="sort-box">
        <SortAsc size={16} />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="abc">A-Z</option>
          <option value="size">Largest</option>
          <option value="popular">Popular</option>
        </select>
      </div>
      <div className={`nsfw-toggle ${showAdult ? 'active' : ''}`} onClick={() => setShowAdult(!showAdult)}>
        <div className="nsfw-badge">{showAdult ? '18+' : 'Safe'}</div>
        <span>NSFW</span>
      </div>
      {searchTerm && <X className="clear-btn" onClick={() => setSearchTerm('')} />}
    </div>
  );
}
