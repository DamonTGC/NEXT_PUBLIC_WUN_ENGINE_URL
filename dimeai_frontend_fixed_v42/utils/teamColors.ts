
export type LeagueKey = 'NFL' | 'NBA' | 'MLB' | 'NHL' | 'CFB' | 'CBB';

interface TeamColorMap {
  [key: string]: string;
}

// Very small starter map – you can expand this.
export const teamColors: TeamColorMap = {
  // NFL
  'NFL:BUF': '#00338D',
  'NFL:NYJ': '#125740',
  'NFL:KC': '#E31837',
  'NFL:DAL': '#003594',

  // NBA
  'NBA:LAL': '#552583',
  'NBA:GSW': '#1D428A',
  'NBA:BOS': '#007A33',

  // MLB
  'MLB:NYY': '#0C2340',
  'MLB:LAD': '#005A9C',

  // NHL
  'NHL:COL': '#6F263D',
  'NHL:VGK': '#B4975A',

  // CFB / CBB example
  'CFB:BYU': '#002255',
  'CFB:TCU': '#4D1979',
  'CBB:DUKE': '#003087',
};

export function getTeamColor(league: string, team: string): string {
  const key = `${league}:${team.toUpperCase()}`;
  if (teamColors[key]) return teamColors[key];

  // League default fallback
  switch (league) {
    case 'NFL':
      return '#F6C552';
    case 'NBA':
      return '#F27A3B';
    case 'MLB':
      return '#D92E3A';
    case 'NHL':
      return '#4FB3FF';
    case 'CFB':
    case 'CBB':
      return '#9F7AEA';
    default:
      return '#F6C552';
  }
}
