"use client";

import React, { useMemo, useState } from "react";

type Answer = { text: string; points: number; aliases?: string[] };
type Round = { id: string; title: string; question: string; answers: Answer[] };

const STARTER_ROUNDS: Round[] = [
  {
    id: "r1",
    title: "Round 1",
    question: "Name something people do before Christmas.",
    answers: [
      { text: "Buy gifts", points: 35, aliases: ["shopping", "shop"] },
      { text: "Decorate", points: 25, aliases: ["tree", "lights"] },
      { text: "Wrap presents", points: 20, aliases: ["wrap", "wrapping"] },
      { text: "Bake", points: 10, aliases: ["cookies", "baking"] },
      { text: "Travel", points: 10, aliases: ["drive", "fly"] }
    ]
  }
];

function normalize(s: string) {
  return (s || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ");
}

function isMatch(guess: string, a: Answer) {
  const g = normalize(guess);
  if (!g) return false;
  const candidates = [a.text, ...(a.aliases || [])].map(normalize);
  if (candidates.includes(g)) return true;
  return candidates.some((c) => c.includes(g) || g.includes(c));
}

export default function Page() {
  const urlMode =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("mode") || "host"
      : "host";

  const [rounds] = useState<Round[]>(STARTER_ROUNDS);
  const [roundIndex, setRoundIndex] = useState(0);

  const round = rounds[Math.min(roundIndex, rounds.length - 1)];

  const [guess, setGuess] = useState("");
  const [revealed, setRevealed] = useState<string[]>([]);
  const [bank, setBank] = useState(0);

  const [teamAName, setTeamAName] = useState("Team Holly");
  const [teamBName, setTeamBName] = useState("Team Jolly");
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [activeTeam, setActiveTeam] = useState<"A" | "B">("A");

  const allFound = useMemo(
    () => revealed.length >= (round?.answers?.length || 0),
    [revealed.length, round?.answers?.length]
  );

  function submitGuess() {
    const g = guess;
    if (!g.trim()) return;

    const match = round.answers.find((a) => isMatch(g, a));
    if (!match) {
      setGuess("");
      return;
    }
    if (revealed.includes(match.text)) {
      setGuess("");
      return;
    }

    setRevealed((prev) => [...prev, match.text]);
    setBank((b) => b + match.points);
    setGuess("");
  }

  function awardBank(to: "A" | "B") {
    if (bank <= 0) return;
    if (to === "A") setScoreA((s) => s + bank);
    else setScoreB((s) => s + bank);
    setBank(0);
    setRevealed([]);
  }

  function nextRound() {
    const next = Math.min(roundIndex + 1, rounds.length - 1);
    setRoundIndex(next);
    setRevealed([]);
    setBank(0);
    setGuess("");
  }

  const styles: Record<string, React.CSSProperties> = {
    page: {
      minHeight: "100vh",
      background:
        "linear-gradient(180deg, #064e3b 0%, #065f46 45%, #7f1d1d 100%)",
      color: "white",
      padding: 24,
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    wrap: { maxWidth: 980, margin: "0 auto", display: "grid", gap: 16 },
    title: {
      textAlign: "center",
      fontWeight: 900,
      letterSpacing: -0.5,
      fontSize: 40,
      margin: "8px 0 0"
    },
    card: {
      border: "1px solid rgba(255,255,255,0.18)",
      background: "rgba(255,255,255,0.10)",
      borderRadius: 24,
      padding: 16
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
      padding: "10px 12px",
      borderRadius: 16,
      border: "1px solid rgba(255,255,255,0.18)",
      background: "rgba(0,0,0,0.10)"
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: 14,
      border: "1px solid rgba(255,255,255,0.25)",
      background: "rgba(255,255,255,0.12)",
      color: "white",
      outline: "none",
      fontSize: 16
    },
    btn: {
      padding: "10px 14px",
      borderRadius: 14,
      border: "1px solid rgba(255,255,255,0.25)",
      background: "rgba(255,255,255,0.16)",
      color: "white",
      fontWeight: 700,
      cursor: "pointer"
    },
    btnGhost: {
      padding: "10px 14px",
      borderRadius: 14,
      border: "1px solid rgba(255,255,255,0.35)",
      background: "transparent",
      color: "white",
      fontWeight: 700,
      cursor: "pointer"
    },
    big: { fontSize: 26, fontWeight: 900 },
    small: { opacity: 0.85, fontSize: 13 }
  };

  const tvMode = urlMode === "tv";

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <div>
          <div style={styles.title}>Christmas Friendly Feud</div>
          <div style={{ textAlign: "center", opacity: 0.85, marginTop: 6 }}>
            {tvMode ? "TV Board" : "Host Mode"} —{" "}
            <span style={{ opacity: 0.9 }}>
              open <b>?mode=tv</b> on the TV and <b>?mode=host</b> on your laptop
            </span>
          </div>
        </div>

        {!tvMode && (
          <div style={styles.card}>
            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <div style={styles.small}>Team A name</div>
                  <input
                    style={styles.input}
                    value={teamAName}
                    onChange={(e) => setTeamAName(e.target.value)}
                  />
                </div>
                <div>
                  <div style={styles.small}>Team B name</div>
                  <input
                    style={styles.input}
                    value={teamBName}
                    onChange={(e) => setTeamBName(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button style={styles.btnGhost} onClick={() => setActiveTeam("A")}>
                  Active: {teamAName || "Team A"}
                </button>
                <button style={styles.btnGhost} onClick={() => setActiveTeam("B")}>
                  Active: {teamBName || "Team B"}
                </button>
                <button style={styles.btn} onClick={() => awardBank(activeTeam)}>
                  Award Bank to Active Team
                </button>
                <button style={styles.btnGhost} onClick={() => awardBank(activeTeam === "A" ? "B" : "A")}>
                  Steal: Award Bank to Other Team
                </button>
                <button style={styles.btnGhost} onClick={nextRound}>
                  Next Round
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={styles.small}>Round</div>
              <div style={styles.big}>{round.title}</div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div>
                <div style={styles.small}>{teamAName || "Team A"}</div>
                <div style={styles.big}>{scoreA}</div>
              </div>
              <div>
                <div style={styles.small}>{teamBName || "Team B"}</div>
                <div style={styles.big}>{scoreB}</div>
              </div>
              <div>
                <div style={styles.small}>Bank</div>
                <div style={styles.big}>{bank}</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 12, fontSize: tvMode ? 34 : 26, fontWeight: 900 }}>
            {round.question}
          </div>

          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            {round.answers.map((a, i) => {
              const r = revealed.includes(a.text);
              return (
                <div key={a.text} style={styles.row}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ width: 26, opacity: 0.85 }}>{i + 1}</div>
                    <div style={{ fontSize: tvMode ? 26 : 18, fontWeight: 800 }}>
                      {r ? a.text : "__________"}
                    </div>
                  </div>
                  <div style={{ width: 70, textAlign: "right", fontWeight: 900, fontSize: tvMode ? 26 : 18 }}>
                    {r ? a.points : ""}
                  </div>
                </div>
              );
            })}
          </div>

          {!tvMode && (
            <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
              <input
                style={styles.input}
                placeholder="Type an answer and press Enter"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitGuess()}
              />
              <button style={styles.btn} onClick={submitGuess}>
                Submit
              </button>
            </div>
          )}

          {!tvMode && (
            <div style={{ marginTop: 10, opacity: 0.85 }}>
              {allFound ? "All answers found — award the bank." : "Tip: type a guess and press Enter."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
