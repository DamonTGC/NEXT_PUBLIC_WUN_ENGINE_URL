
export function buildTile(item) {
  return {
    id: item.id || Math.random().toString(),
    team: item.team || "Team",
    opponent: item.opponent || "Opponent",
    gameTime: "7:00 PM",
    badgeText: "-3.5",
    wagerType: "Spread",
    icon: "/logo.png",
    ev: "+5.2%",
    pctToCover: "72%",
    avgSimScore: "27-17",
    avg5: [21,22,23,25,26]
  };
}
