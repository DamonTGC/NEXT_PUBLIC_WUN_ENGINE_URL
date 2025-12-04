'use client';

import { useEffect, useState } from 'react';
import SearchBar from '../../components/SearchBar';
import ExplanationStrip from '../../components/ExplanationStrip';
import Tile, { TileResult } from '../../components/Tile';

interface ApiResponse {
  mode: string;
  query: string;
  results: TileResult[];
  explanation: string;
}

export default function ParlaysPage() {
  const [results, setResults] = useState<TileResult[]>([]);
  const [explanation, setExplanation] = useState('');
  const [leagueFilter, setLeagueFilter] = useState<string | null>(null);

  async function fetchResults(query: string = '') {
    const params = new URLSearchParams({ mode: 'parlay', q: query });
    const res = await fetch(`/api/results?${params.toString()}`);
    const data: ApiResponse = await res.json();
    const mapped = data.results.map((r) => ({ ...r, typeLabel: 'PARLAY' }));
    setResults(mapped);
    setExplanation(data.explanation);
  }

  useEffect(() => {
    fetchResults('');
  }, []);

  const leagues = ['ALL', 'NFL', 'NBA', 'MLB', 'CBB', 'CFB', 'NHL'];
  const filtered = leagueFilter ? results.filter((r) => r.league === leagueFilter) : results;

  return (
    <main>
      <div className="top-band">
        <div className="top-band-brand">
          <div className="brand-coin" />
          <div>
            <div className="brand-text-main">DIMEAI</div>
            <div className="brand-sub">
              Powered by the WUN Engine • Made to be Number 1
            </div>
          </div>
        </div>
        <div className="top-band-search">
          <SearchBar onSearch={fetchResults} />
        </div>
      </div>

      <div className="league-row">
        <div className="league-tabs">
          {leagues.map((l) => {
            const active = leagueFilter === (l === 'ALL' ? null : l);
            return (
              <button
                key={l}
                className={`league-pill${active ? ' active' : ''}`}
                onClick={() => setLeagueFilter(l === 'ALL' ? null : l)}
                type="button"
              >
                {l}
              </button>
            );
          })}
        </div>
      </div>
      <ExplanationStrip text={explanation} />
      <section className="tile-grid">
        {filtered.map((r) => (
          <Tile key={r.id} result={r} />
        ))}
      </section>
    </main>
  );
}
