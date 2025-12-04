'use client';

import { useState } from 'react';
import TopBooksModal, { TopBook } from './TopBooksModal';

export interface TileResult {
  id: string;
  league: string;
  day: number;
  marketLabel: string;
  description: string;
  odds: number;
  evPercent: number;
  probToCover: number;
  simAvg: number;
  last5: number[];
  tag: string;
  typeLabel: string;
}

function getSportFromLeague(league: string): 'football' | 'basketball' | 'baseball' | 'hockey' {
  const l = league.toUpperCase();
  if (l === 'NFL' || l === 'CFB' || l === 'NCAAF') return 'football';
  if (l === 'NBA' || l === 'CBB' || l === 'NCAAB') return 'basketball';
  if (l === 'MLB') return 'baseball';
  if (l === 'NHL') return 'hockey';
  return 'football';
}

function parseTeamCode(description: string): string {
  // crude parse: "BUF vs NYJ ; ..." or "BYU @ TCU"
  const parts = description.split(/vs|@/i);
  if (!parts.length) return 'GEN';
  const left = parts[0].trim();
  const code = left.split(' ')[0].trim().toUpperCase();
  return code || 'GEN';
}

const TEAM_COLORS: Record<string, string> = {
  BUF: '#00338D',
  NYJ: '#125740',
  LAL: '#552583',
  GSW: '#1D428A',
  BYU: '#002E5D',
  TCU: '#4D1979',
  GEN: '#F6C552',
};

export default function Tile({ result }: { result: TileResult }) {
  const [flipped, setFlipped] = useState(false);
  const [showBooks, setShowBooks] = useState(false);

  const books: TopBook[] = [
    { book: 'BetMGM', line: result.odds, odds: result.odds },
    { book: 'DraftKings', line: result.odds - 0.5, odds: result.odds + 5 },
    { book: 'FanDuel', line: result.odds, odds: result.odds + 10 },
    { book: 'Caesars', line: result.odds + 0.5, odds: result.odds },
    { book: 'PointsBet', line: result.odds, odds: result.odds - 5 },
  ];

  const evValue = `${result.evPercent >= 0 ? '+' : ''}${result.evPercent.toFixed(1)}%`;
  const evLabel = `EV: ${evValue}`;
  const oddsLabel = `${result.odds > 0 ? '+' : ''}${result.odds}`;

  const maxBar = Math.max(...result.last5, 1);
  const bars = result.last5.map((v) => (v / maxBar) * 100);

  const firstPart = result.marketLabel.split(';')[0].trim();
  const pillText = `${oddsLabel} • ${firstPart}`;

  const opponentTimeLine = result.description;

  const sport = getSportFromLeague(result.league);
  const sportIcon = `/icons/${sport}.svg`;

  const teamCode = parseTeamCode(result.description);
  const teamColor = TEAM_COLORS[teamCode] || TEAM_COLORS['GEN'];

  const jerseyStyle: React.CSSProperties = {
    borderRadius: '999px',
    boxShadow: `0 0 0 3px ${teamColor}, 0 12px 28px rgba(0,0,0,0.9)`,
    backgroundColor: '#050507',
  };

  return (
    <>
      <div
        className={`tile-wrapper${flipped ? ' flipped' : ''}`}
        onClick={() => setFlipped(!flipped)}
      >
        <div className="tile-card">
          <div className="tile-inner">
            {/* FRONT */}
            <div className="tile-face tile-front">
              <div className="tile-front-main">
                <div style={jerseyStyle}>
                  <img
                    className="tile-jersey"
                    src={sportIcon}
                    alt={`${result.league} icon`}
                  />
                </div>
                <div className="tile-front-pill">{pillText}</div>
                <div className="tile-front-text-sub">{opponentTimeLine}</div>
                <div className="tile-front-main-bet">{firstPart}</div>
              </div>

              <div className="tile-front-bottom">
                <div className="tile-front-odds">{firstPart}</div>
                <div className="tile-front-ev">{evLabel}</div>
              </div>
            </div>

            {/* BACK */}
            <div className="tile-face tile-back">
              <div className="tile-back-top">
                <div className="tile-back-chart">
                  <label>Last 5 performance</label>
                  <div className="chart-bars">
                    {bars.map((h, idx) => (
                      <div key={idx} className="chart-bar" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <div className="chart-labels">
                    {result.last5.map((_, idx) => (
                      <span key={idx}>G{idx + 1}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="tile-back-middle">
                <div className="tile-back-metric">
                  <label>Avg simulated</label>
                  <strong>{result.simAvg.toFixed(1)}</strong>
                  <div>({result.description})</div>
                </div>
                <div className="tile-back-metric">
                  <label>Chance to cover</label>
                  <strong>{(result.probToCover * 100).toFixed(1)}%</strong>
                  <div>WUN Engine</div>
                </div>
              </div>

              <div className="tile-back-bottom">
                <span>Tap tile to flip • Tap button for best books</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowBooks(true);
                  }}
                >
                  Best books
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TopBooksModal open={showBooks} onClose={() => setShowBooks(false)} books={books} />
    </>
  );
}
