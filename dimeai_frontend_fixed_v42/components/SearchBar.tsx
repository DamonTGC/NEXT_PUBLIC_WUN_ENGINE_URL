'use client';

import { useState } from 'react';

export default function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [value, setValue] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch(value.trim());
  }

  return (
    <div className="search-row">
      <div className="search-wun-shell">
        <form className="search-wun-form" onSubmit={handleSubmit}>
          {/* WUN Engine logo inside the search bar */}
          <img
            src="/wun-engine-logo.png"
            alt="WUN Engine"
            className="search-wun-img inside"
          />
          <input
            className="search-wun-input"
            placeholder="Type what you want to bet • team, time, league, prop..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button type="submit" className="search-wun-button">
            <span className="search-wun-arrow">➜</span>
          </button>
        </form>
      </div>
    </div>
  );
}
