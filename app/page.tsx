"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Answer = { text: string; points: number; aliases?: string[] };
type Round = { id: string; title: string; question: string; answers: Answer[] };

type FastMoneyQuestion = { prompt: string; answers: Answer[] };
type FastMoneyRound = { id: string; title: string; questions: FastMoneyQuestion[] };

// -----------------------------
// MAIN GAME ROUNDS (edit here)
// -----------------------------
const STARTER_ROUNDS: Round[] = [
  {
    id: "r1",
    title: "Round 1",
    question: "Name something people do the week before Christmas.",
    answers: [
      { text: "Buy gifts", points: 35, aliases: ["shopping", "gift shopping", "shop"] },
      { text: "Wrap presents", points: 22, aliases: ["wrapping", "wrap gifts", "wrap"] },
      { text: "Decorate", points: 18, aliases: ["put up lights", "tree", "decorate house"] },
      { text: "Travel", points: 15, aliases: ["drive", "fly", "go home", "visit family"] },
      { text: "Bake", points: 10, aliases: ["cookies", "bake cookies", "holiday baking"] }
    ]
  },
  {
    id: "r2",
    title: "Round 2",
    question: "Name a Christmas song people pretend to love.",
    answers: [
      { text: "All I Want for Christmas Is You", points: 30, aliases: ["mariah", "mariah carey"] },
      { text: "Last Christmas", points: 22, aliases: ["wham"] },
      { text: "Jingle Bell Rock", points: 18, aliases: ["jingle bell"] },
      { text: "Feliz Navidad", points: 16, aliases: ["feliz"] },
      { text: "Santa Baby", points: 14, aliases: ["santa baby song"] }
    ]
  },
  {
    id: "r3",
    title: "Round 3",
    question: "Name something you might find in a messy stocking.",
    answers: [
      { text: "Candy", points: 32, aliases: ["chocolate", "sweets"] },
      { text: "Batteries", points: 20, aliases: ["aa", "aaa", "battery"] },
      { text: "Gift cards", points: 18, aliases: ["giftcard", "card"] },
      { text: "Socks", points: 16, aliases: ["sock"] },
      { text: "Mini liquor", points: 14, aliases: ["mini bottles", "nips", "mini booze", "shot"] }
    ]
  }
];

// -----------------------------
// FAST MONEY ROUNDS (your list)
// -----------------------------
const FAST_MONEY_ROUNDS: FastMoneyRound[] = [
  {
    id: "fm1",
    title: "Fast Money Round 1",
    questions: [
      {
        prompt: "Name a popular Christmas cookie.",
        answers: [
          { text: "gingerbread", points: 40, aliases: ["ginger bread"] },
          { text: "sugar cookie", points: 30, aliases: ["sugar cookies"] },
          { text: "snickerdoodle", points: 15, aliases: ["snickerdoodles"] },
          { text: "peppermint cookie", points: 10, aliases: ["peppermint"] },
          { text: "chocolate chip", points: 5, aliases: ["chocolate chip cookie", "choc chip"] }
        ]
      },
      {
        prompt: "Name something you put on a Christmas tree.",
        answers: [
          { text: "ornaments", points: 45, aliases: ["baubles"] },
          { text: "lights", points: 30, aliases: ["string lights"] },
          { text: "star/angel topper", points: 15, aliases: ["tree topper", "star", "angel"] },
          { text: "tinsel", points: 7, aliases: ["icicles"] },
          { text: "garland", points: 3, aliases: ["ribbon"] }
        ]
      },
      {
        prompt: "Name a reindeer besides Rudolph.",
        answers: [
          { text: "Dasher", points: 35, aliases: ["dasher"] },
          { text: "Vixen", points: 25, aliases: ["vixen"] },
          { text: "Comet", points: 20, aliases: ["comet"] },
          { text: "Blitzen", points: 12, aliases: ["blitzen"] },
          { text: "Prancer", points: 8, aliases: ["prancer"] }
        ]
      },
      {
        prompt: "Name a Christmas movie people watch every year.",
        answers: [
          { text: "Home Alone", points: 40, aliases: ["home alone 1", "kevin"] },
          { text: "Elf", points: 30, aliases: ["buddy the elf"] },
          { text: "The Grinch", points: 20, aliases: ["how the grinch stole christmas", "grinch"] },
          { text: "A Christmas Story", points: 7, aliases: ["ralphie"] },
          { text: "The Polar Express", points: 3, aliases: ["polar express"] }
        ]
      },
      {
        prompt: "Name a Christmas morning activity.",
        answers: [
          { text: "opening gifts", points: 50, aliases: ["open presents", "open gifts"] },
          { text: "making breakfast", points: 20, aliases: ["cook breakfast"] },
          { text: "taking photos", points: 15, aliases: ["pictures"] },
          { text: "drinking hot cocoa", points: 10, aliases: ["hot chocolate", "cocoa"] },
          { text: "cleaning up wrapping paper", points: 5, aliases: ["cleaning", "cleanup"] }
        ]
      }
    ]
  },
  {
    id: "fm2",
    title: "Fast Money Round 2",
    questions: [
      {
        prompt: "Name a Christmas scent.",
        answers: [
          { text: "pine", points: 40, aliases: ["christmas tree"] },
          { text: "cinnamon", points: 30, aliases: [] },
          { text: "peppermint", points: 20, aliases: [] },
          { text: "gingerbread", points: 7, aliases: [] },
          { text: "clove", points: 3, aliases: ["cloves"] }
        ]
      },
      {
        prompt: "Name a Christmas party drink.",
        answers: [
          { text: "eggnog", points: 40, aliases: ["nog"] },
          { text: "hot chocolate", points: 30, aliases: ["hot cocoa"] },
          { text: "apple cider", points: 15, aliases: ["cider"] },
          { text: "wine", points: 10, aliases: ["mulled wine"] },
          { text: "champagne", points: 5, aliases: ["bubbly"] }
        ]
      },
      {
        prompt: "Name a gift kids ask for.",
        answers: [
          { text: "toys", points: 45, aliases: ["toy"] },
          { text: "video games", points: 30, aliases: ["games"] },
          { text: "electronics", points: 15, aliases: ["ipad", "tablet", "phone"] },
          { text: "stuffed animals", points: 7, aliases: ["stuffies", "plush"] },
          { text: "board games", points: 3, aliases: ["board game"] }
        ]
      },
      {
        prompt: "Name a Christmas symbol.",
        answers: [
          { text: "star", points: 40, aliases: [] },
          { text: "candy cane", points: 25, aliases: ["candy canes"] },
          { text: "wreath", points: 20, aliases: [] },
          { text: "bell", points: 10, aliases: ["bells"] },
          { text: "holly", points: 5, aliases: [] }
        ]
      },
      {
        prompt: "Name something people hang for Christmas.",
        answers: [
          { text: "stockings", points: 45, aliases: ["stocking"] },
          { text: "lights", points: 25, aliases: ["string lights"] },
          { text: "garland", points: 15, aliases: [] },
          { text: "wreath", points: 10, aliases: [] },
          { text: "mistletoe", points: 5, aliases: [] }
        ]
      }
    ]
  },
  {
    id: "fm3",
    title: "Fast Money Round 3",
    questions: [
      {
        prompt: "Name a Christmas carol.",
        answers: [
          { text: "Jingle Bells", points: 40, aliases: ["jingle bells"] },
          { text: "Silent Night", points: 30, aliases: ["silent night"] },
          { text: "Deck the Halls", points: 15, aliases: ["deck the halls"] },
          { text: "O Holy Night", points: 10, aliases: ["o holy night"] },
          { text: "Joy to the World", points: 5, aliases: ["joy to the world"] }
        ]
      },
      {
        prompt: "Name a classic Christmas decoration.",
        answers: [
          { text: "wreath", points: 35, aliases: [] },
          { text: "mistletoe", points: 25, aliases: [] },
          { text: "nativity scene", points: 20, aliases: ["nativity"] },
          { text: "snow globe", points: 10, aliases: ["snowglobe"] },
          { text: "poinsettia", points: 5, aliases: ["poinsettias"] }
        ]
      },
      {
        prompt: "Name something people wrap for Christmas.",
        answers: [
          { text: "presents", points: 55, aliases: ["gifts"] },
          { text: "baked goods", points: 15, aliases: ["cookies", "treats"] },
          { text: "gift cards", points: 10, aliases: ["giftcard"] },
          { text: "candy", points: 10, aliases: ["chocolate"] },
          { text: "clothing", points: 5, aliases: ["clothes"] }
        ]
      },
      {
        prompt: "Name a winter clothing item worn on Christmas Day.",
        answers: [
          { text: "sweater", points: 40, aliases: ["ugly sweater"] },
          { text: "scarf", points: 25, aliases: [] },
          { text: "hat", points: 20, aliases: ["beanie"] },
          { text: "mittens", points: 10, aliases: ["gloves"] },
          { text: "boots", points: 5, aliases: [] }
        ]
      },
      {
        prompt: "Name a Christmas Eve tradition.",
        answers: [
          { text: "cookies for Santa", points: 45, aliases: ["leave cookies"] },
          { text: "opening one gift", points: 25, aliases: ["open one present"] },
          { text: "church service", points: 15, aliases: ["go to church"] },
          { text: "reading Christmas stories", points: 10, aliases: ["read stories", "read a christmas story"] },
          { text: "tracking Santa", points: 5, aliases: ["norad"] }
        ]
      }
    ]
  },
  {
    id: "fm4",
    title: "Fast Money Round 4",
    questions: [
      {
        prompt: "Name something Santa keeps in his sleigh.",
        answers: [
          { text: "presents", points: 55, aliases: ["gifts"] },
          { text: "elves (in stories)", points: 15, aliases: ["elves"] },
          { text: "cookies", points: 10, aliases: ["cookie"] },
          { text: "reindeer food", points: 5, aliases: ["carrots", "oats"] },
          { text: "toy sack", points: 5, aliases: ["sack", "bag"] }
        ]
      },
      {
        prompt: "Name a Christmas song played in stores.",
        answers: [
          { text: "All I Want for Christmas", points: 45, aliases: ["all i want for christmas is you", "mariah"] },
          { text: "Jingle Bell Rock", points: 25, aliases: ["jingle bell rock"] },
          { text: "Last Christmas", points: 15, aliases: ["wham"] },
          { text: "Let It Snow", points: 10, aliases: ["let it snow"] },
          { text: "Rockin’ Around the Christmas Tree", points: 5, aliases: ["rockin around", "rocking around"] }
        ]
      },
      {
        prompt: "Name a Christmas activity families do together.",
        answers: [
          { text: "decorate the tree", points: 40, aliases: ["decorating"] },
          { text: "bake cookies", points: 30, aliases: ["baking"] },
          { text: "watch movies", points: 20, aliases: ["movie"] },
          { text: "wrap gifts", points: 10, aliases: ["wrapping"] },
          { text: "sing carols", points: 5, aliases: ["caroling"] }
        ]
      },
      {
        prompt: "Name a gift people give coworkers.",
        answers: [
          { text: "gift cards", points: 40, aliases: ["giftcard"] },
          { text: "candles", points: 30, aliases: ["candle"] },
          { text: "mugs", points: 15, aliases: ["mug"] },
          { text: "treats/cookies", points: 10, aliases: ["cookies", "treats"] },
          { text: "lotions", points: 5, aliases: ["lotion"] }
        ]
      },
      {
        prompt: "Name something red at Christmas.",
        answers: [
          { text: "Santa’s suit", points: 45, aliases: ["santa suit", "santa"] },
          { text: "candy cane stripes", points: 25, aliases: ["candy cane", "candy canes"] },
          { text: "bows", points: 15, aliases: ["ribbon"] },
          { text: "stockings", points: 10, aliases: ["stocking"] },
          { text: "poinsettias", points: 5, aliases: ["poinsettia"] }
        ]
      }
    ]
  }
];

// -----------------------------
// Helpers
// -----------------------------
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

// -----------------------------
// App
// -----------------------------
type Stage = "main" | "fastmoney";

export default function Page() {
  const mode =
    typeof window !== "undefined"
      ? (new URLSearchParams(window.location.search).get("mode") || "host").toLowerCase()
      : "host";
  const tvMode = mode === "tv";

  // shared-ish state (single tab works; two-tab works if you mirror laptop; true sync is optional)
  const [stage, setStage] = useState<Stage>("main");

  // Main game state
  const [roundIndex, setRoundIndex] = useState(0);
  const round = STARTER_ROUNDS[Math.min(roundIndex, STARTER_ROUNDS.length - 1)];
  const [revealed, setRevealed] = useState<string[]>([]);
  const revealedSet = useMemo(() => new Set(revealed), [revealed]);

  const [guess, setGuess] = useState("");
  const [bank, setBank] = useState(0);

  const [teamAName, setTeamAName] = useState("Team Holly");
  const [teamBName, setTeamBName] = useState("Team Jolly");
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [activeTeam, setActiveTeam] = useState<"A" | "B">("A");

  function submitGuess() {
    const g = guess;
    if (!g.trim()) return;

    const match = round.answers.find((a) => isMatch(g, a));
    if (!match) {
      setGuess("");
      return;
    }
    if (revealedSet.has(match.text)) {
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

  function revealAll() {
    setRevealed(round.answers.map((a) => a.text));
  }

  function nextRound() {
    const next = Math.min(roundIndex + 1, STARTER_ROUNDS.length - 1);
    setRoundIndex(next);
    setRevealed([]);
    setBank(0);
    setGuess("");
  }

  // Fast Money state
  const [fmRoundId, setFmRoundId] = useState(FAST_MONEY_ROUNDS[0].id);
  const fmRound = FAST_MONEY_ROUNDS.find((r) => r.id === fmRoundId) || FAST_MONEY_ROUNDS[0];

  const [fmPlayer, setFmPlayer] = useState<1 | 2>(1);
  const [fmQIndex, setFmQIndex] = useState(0);
  const fmQ = fmRound.questions[fmQIndex];

  const [fmInput, setFmInput] = useState("");
  const [fmP1, setFmP1] = useState<{ answers: string[]; points: number[]; total: number }>({
    answers: [],
    points: [],
    total: 0
  });
  const [fmP2, setFmP2] = useState<{ answers: string[]; points: number[]; total: number }>({
    answers: [],
    points: [],
    total: 0
  });

  // simple timer for FM (host-only controls)
  const [fmTimerSeconds, setFmTimerSeconds] = useState(25);
  const [fmTimeLeft, setFmTimeLeft] = useState(25);
  const [fmRunning, setFmRunning] = useState(false);
  const fmRef = useRef<number | null>(null);

  useEffect(() => {
    if (!fmRunning) return;
    fmRef.current = window.setInterval(() => {
      setFmTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => {
      if (fmRef.current) window.clearInterval(fmRef.current);
      fmRef.current = null;
    };
  }, [fmRunning]);

  useEffect(() => {
    if (fmRunning && fmTimeLeft === 0) setFmRunning(false);
  }, [fmRunning, fmTimeLeft]);

  function fmResetAll() {
    setFmPlayer(1);
    setFmQIndex(0);
    setFmP1({ answers: [], points: [], total: 0 });
    setFmP2({ answers: [], points: [], total: 0 });
    setFmInput("");
    setFmRunning(false);
    setFmTimeLeft(fmTimerSeconds);
  }

  function fmStartTimer() {
    setFmTimeLeft(fmTimerSeconds);
    setFmRunning(true);
  }

  function fmStopTimer() {
    setFmRunning(false);
  }

  function fmScore(raw: string) {
    const hit = (fmQ?.answers || []).find((a) => isMatch(raw, a));
    return hit ? hit.points : 0;
  }

  function fmSubmit() {
    if (!fmQ) return;

    const ans = fmInput.trim();
    const pts = ans ? fmScore(ans) : 0;

    if (fmPlayer === 1) {
      setFmP1((p) => ({
        answers: [...p.answers, ans || "(blank)"],
        points: [...p.points, pts],
        total: p.total + pts
      }));
    } else {
      setFmP2((p) => ({
        answers: [...p.answers, ans || "(blank)"],
        points: [...p.points, pts],
        total: p.total + pts
      }));
    }

    setFmInput("");
    setFmRunning(false);
    setFmTimeLeft(fmTimerSeconds);

    if (fmQIndex >= fmRound.questions.length - 1) {
      if (fmPlayer === 1) {
        setFmPlayer(2);
        setFmQIndex(0);
      }
      return;
    }

    setFmQIndex((i) => i + 1);
  }

  // Styling (works without Tailwind)
  const styles: Record<string, React.CSSProperties> = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(180deg, #064e3b 0%, #065f46 45%, #7f1d1d 100%)",
      color: "white",
      padding: 24,
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    wrap: { maxWidth: 1100, margin: "0 auto", display: "grid", gap: 16 },
    title: { textAlign: "center", fontWeight: 900, fontSize: 40, margin: "8px 0 0" },
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
      padding: "12px 14px",
      borderRadius: 18,
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

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <div>
          <div style={styles.title}>Christmas Friendly Feud</div>
          <div style={{ textAlign: "center", opacity: 0.85, marginTop: 6 }}>
            {tvMode ? "TV Board" : "Host Mode"} —{" "}
            <span style={{ opacity: 0.9 }}>
              TV: <b>?mode=tv</b> | Host: <b>?mode=host</b>
            </span>
          </div>
        </div>

        {!tvMode && (
          <div style={styles.card}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button style={styles.btnGhost} onClick={() => setStage("main")}>
                  Main Game
                </button>
                <button style={styles.btnGhost} onClick={() => setStage("fastmoney")}>
                  Fast Money
                </button>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button style={styles.btnGhost} onClick={() => setActiveTeam("A")}>
                  Active: {teamAName}
                </button>
                <button style={styles.btnGhost} onClick={() => setActiveTeam("B")}>
                  Active: {teamBName}
                </button>
              </div>
            </div>

            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <div style={styles.small}>Team A name</div>
                <input style={styles.input} value={teamAName} onChange={(e) => setTeamAName(e.target.value)} />
              </div>
              <div>
                <div style={styles.small}>Team B name</div>
                <input style={styles.input} value={teamBName} onChange={(e) => setTeamBName(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {stage === "main" ? (
          <div style={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={styles.small}>Round</div>
                <div style={styles.big}>
                  {round.title} ({roundIndex + 1}/{STARTER_ROUNDS.length})
                </div>
              </div>

              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div>
                  <div style={styles.small}>{teamAName}</div>
                  <div style={styles.big}>{scoreA}</div>
                </div>
                <div>
                  <div style={styles.small}>{teamBName}</div>
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
                const r = revealedSet.has(a.text);
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
              <>
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

                <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button style={styles.btn} onClick={() => awardBank(activeTeam)}>
                    Award Bank to Active Team
                  </button>
                  <button style={styles.btnGhost} onClick={() => awardBank(activeTeam === "A" ? "B" : "A")}>
                    Steal: Award Bank to Other Team
                  </button>
                  <button style={styles.btnGhost} onClick={revealAll}>
                    Reveal All
                  </button>
                  <button style={styles.btnGhost} onClick={nextRound}>
                    Next Round
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div style={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={styles.small}>Fast Money</div>
                <div style={styles.big}>{fmRound.title}</div>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div>
                  <div style={styles.small}>Timer</div>
                  <div style={styles.big}>{fmTimeLeft}</div>
                </div>
                {!tvMode && (
                  <button style={styles.btnGhost} onClick={fmResetAll}>
                    Reset FM
                  </button>
                )}
              </div>
            </div>

            {!tvMode && (
              <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                {FAST_MONEY_ROUNDS.map((r) => (
                  <button
                    key={r.id}
                    style={r.id === fmRoundId ? styles.btn : styles.btnGhost}
                    onClick={() => {
                      setFmRoundId(r.id);
                      fmResetAll();
                    }}
                  >
                    {r.title.replace("Fast Money ", "")}
                  </button>
                ))}
              </div>
            )}

            <div style={{ marginTop: 14, fontSize: tvMode ? 34 : 24, fontWeight: 900 }}>
              Player {fmPlayer} — Question {fmQIndex + 1} of {fmRound.questions.length}
            </div>
            <div style={{ marginTop: 10, fontSize: tvMode ? 36 : 22, fontWeight: 900 }}>
              {fmQ?.prompt}
            </div>

            {!tvMode && (
              <>
                <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
                  <input
                    style={styles.input}
                    placeholder="Type answer and press Enter"
                    value={fmInput}
                    onChange={(e) => setFmInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fmSubmit()}
                  />
                  <button style={styles.btn} onClick={fmSubmit}>
                    Submit
                  </button>
                </div>

                <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button style={styles.btn} onClick={fmStartTimer} disabled={fmRunning}>
                    Start Timer
                  </button>
                  <button style={styles.btnGhost} onClick={fmStopTimer} disabled={!fmRunning}>
                    Stop Timer
                  </button>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={styles.small}>Timer seconds</span>
                    <input
                      style={{ ...styles.input, width: 110 }}
                      type="number"
                      min={5}
                      max={120}
                      value={fmTimerSeconds}
                      onChange={(e) => {
                        const v = Math.max(5, Math.min(120, Number(e.target.value || 25)));
                        setFmTimerSeconds(v);
                        setFmTimeLeft(v);
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={styles.card}>
                    <div style={{ fontWeight: 900, fontSize: 18 }}>Player 1</div>
                    <div style={styles.small}>Total: {fmP1.total}</div>
                    <ul style={{ marginTop: 10, paddingLeft: 18 }}>
                      {fmP1.answers.map((a, i) => (
                        <li key={i} style={{ marginBottom: 6 }}>
                          <span style={{ fontWeight: 700 }}>{i + 1}. </span>
                          {a} <span style={{ opacity: 0.85 }}>({fmP1.points[i] ?? 0})</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={styles.card}>
                    <div style={{ fontWeight: 900, fontSize: 18 }}>Player 2</div>
                    <div style={styles.small}>Total: {fmP2.total}</div>
                    <ul style={{ marginTop: 10, paddingLeft: 18 }}>
                      {fmP2.answers.map((a, i) => (
                        <li key={i} style={{ marginBottom: 6 }}>
                          <span style={{ fontWeight: 700 }}>{i + 1}. </span>
                          {a} <span style={{ opacity: 0.85 }}>({fmP2.points[i] ?? 0})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ marginTop: 10, opacity: 0.85 }}>
                  Note: This Fast Money implementation scores exact-ish matches using aliases. You can edit aliases in
                  FAST_MONEY_ROUNDS above.
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
