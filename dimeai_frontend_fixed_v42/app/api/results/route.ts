
import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_WUN_ENGINE_URL || 'https://wun-engine-production.up.railway.app';

type BackendStraight = {
  id: string;
  team?: string;
  opponent?: string;
  league?: string;
  gameTime?: string;
  market?: string;
  odds?: number | string;
  ev?: number;
  pctToCover?: number;
  avg5?: number[];
  avgSimScore?: [number, number] | number;
};

type BackendParlay = {
  id: string;
  legs: { team: string; opponent: string; market: string; odds: string }[];
  combinedEV: number;
  combinedProb: number;
  book: string;
};

type BackendTeaser = BackendParlay & {
  teaserPoints: number;
};

function toTileFromStraight(p: BackendStraight, idx: number) {
  const league = p.league || 'NFL';
  const oddsVal = typeof p.odds === 'number' ? p.odds : -110;
  const evDecimal = p.ev ?? 0;
  const probPct = p.pctToCover ?? 0;
  const last5 = p.avg5 && p.avg5.length ? p.avg5 : [22, 18, 30, 24, 20];
  const sim = Array.isArray(p.avgSimScore) ? p.avgSimScore[0] : (typeof p.avgSimScore === 'number' ? p.avgSimScore : 0);

  const team = p.team ?? 'Team A';
  const opp = p.opponent ?? 'Team B';
  const time = p.gameTime ?? '7:00 PM';

  const marketLabel = `${p.market ?? 'Spread'} ; ${oddsVal}`;
  const description = `${team} vs ${opp} ; ${time}`;

  return {
    id: p.id || `straight-${idx}`,
    league,
    day: 17 + (idx % 12),
    marketLabel,
    description,
    odds: oddsVal,
    evPercent: evDecimal * 100,
    probToCover: probPct / 100,
    simAvg: sim,
    last5,
  };
}


function buildFallback(mode: string) {
  // Simple client-side fallback so the UI always has something to show
  if (mode === 'parlays' || mode === 'teasers') {
    return [
      {
        id: mode + '-demo-1',
        league: 'NFL',
        day: 21,
        marketLabel: mode === 'parlays' ? 'Parlay 3 legs ; DemoBook' : 'Teaser +6 ; 10 legs',
        description: 'Demo Team A vs Demo Team B (Spread) • Demo Team C vs Demo Team D (Total)',
        odds: -110,
        evPercent: 5.0,
        probToCover: 0.38,
        simAvg: 38,
        last5: [3, 4, 5, 4, 6],
      },
    ];
  }

  // straight mode fallback
  return Array.from({ length: 10 }).map((_, idx) => ({
    id: `straight-demo-${idx}`,
    league: 'NFL',
    day: 17 + (idx % 5),
    marketLabel: 'Spread ; -3.5',
    description: `Demo Team ${idx + 1} vs Demo Opponent ${idx + 1} ; 7:00 PM`,
    odds: -110,
    evPercent: 4.2,
    probToCover: 0.62,
    simAvg: 27,
    last5: [24, 21, 27, 20, 30],
  }));
}

function toTileFromParlay(p: BackendParlay | BackendTeaser, idx: number) {
  const legs = p.legs || [];
  const first = legs[0] || { team: 'Team A', opponent: 'Team B', market: 'Spread', odds: '-110' };
  const league = 'MIX';
  const legCount = legs.length || 2;
  const teaser = (p as any).teaserPoints;
  const labelType = teaser ? `Teaser +${teaser}` : 'Parlay';

  const description =
    legs.length > 0
      ? legs
          .map((l) => `${l.team} vs ${l.opponent} (${l.market})`)
          .join(' • ')
      : `${first.team} vs ${first.opponent} (${first.market})`;

  const oddsVal = -110;
  const last5 = [legCount, legCount + 1, legCount + 2, legCount + 3, legCount + 4];

  return {
    id: p.id || `${teaser ? 'teaser' : 'parlay'}-${idx}`,
    league,
    day: 17 + (idx % 12),
    marketLabel: `${labelType} ${legCount} legs ; ${p.book ?? 'Book'}`,
    description,
    odds: oddsVal,
    evPercent: (p.combinedEV ?? 0) * 100,
    probToCover: p.combinedProb ?? 0,
    simAvg: (p.combinedProb ?? 0) * 100,
    last5,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode') || 'straight';
  const q = searchParams.get('q') || '';

  let endpoint = '/run';
  if (mode === 'parlays') endpoint = '/parlays';
  else if (mode === 'teasers') endpoint = '/teasers';
  // future: props, search, etc.

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: q, mode }),
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('WUN Engine backend error', res.status);
      const fallback = buildFallback(mode);
      return NextResponse.json(
        {
          mode,
          query: q,
          results: fallback,
          explanation: 'Showing demo WUN Engine tiles while backend is unavailable.',
        },
        { status: 200 },
      );
    }

    const data = await res.json();
    const arr: any[] = Array.isArray(data) ? data : data.results || [];

    let mapped;
    if (mode === 'parlays' || mode === 'teasers') {
      mapped = arr.map((p, idx) => toTileFromParlay(p, idx));
    } else {
      mapped = arr.map((p, idx) => toTileFromStraight(p, idx));
    }

    const explanation =
      mode === 'parlays'
        ? 'Combining highest EV legs into parlays while balancing probability to hit.'
        : mode === 'teasers'
        ? 'Building teaser legs where line movement gives the strongest edge.'
        : 'Prioritizing highest cover probability, then EV, using live WUN Engine data.';

    return NextResponse.json({
      mode,
      query: q,
      results: mapped,
      explanation,
    });
  } catch (err) {
    console.error('Engine /results exception', err);
    const fallback = buildFallback(mode);
    return NextResponse.json(
      {
        mode,
        query: q,
        results: fallback,
        explanation: 'Showing demo WUN Engine tiles while backend is unavailable.',
      },
      { status: 200 },
    );
  }
}
