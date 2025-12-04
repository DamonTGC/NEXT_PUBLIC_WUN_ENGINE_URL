
export function scoreEngine(odds, news) {
  return odds.map(o=>({ ...o, score:1 }));
}
