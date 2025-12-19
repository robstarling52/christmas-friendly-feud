"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Answer = { text: string; points: number; aliases: string[] };
type Round = { id: string; title: string; question: string; answers: Answer[] };

type FastMoneyQuestion = { prompt: string; answers: Answer[] };
type FastMoneyRound = { id: string; title: string; questions: FastMoneyQuestion[] };

type UiMode = "host" | "tv";
type Stage = "setup" | "play" | "deck" | "fastmoney";
type SoundMode = "on" | "off";

// -----------------------------
// MAIN GAME STARTER DECK (default)
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
      { text: "Bake", points: 10, aliases: ["cookies", "bake cookies", "holiday baking"] },
    ],
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
      { text: "Santa Baby", points: 14, aliases: ["santa baby song"] },
    ],
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
      { text: "Mini liquor", points: 14, aliases: ["mini bottles", "nips", "mini booze", "shot"] },
    ],
  },
];

// -----------------------------
// FAST MONEY (your list)
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
          { text: "chocolate chip", points: 5, aliases: ["chocolate chip cookie", "choc chip"] },
        ],
      },
      {
        prompt: "Name something you put on a Christmas tree.",
        answers: [
          { text: "ornaments", points: 45, aliases: ["baubles"] },
          { text: "lights", points: 30, aliases: ["string lights"] },
          { text: "star/angel topper", points: 15, aliases: ["tree topper", "star", "angel"] },
          { text: "tinsel", points: 7, aliases: ["icicles"] },
          { text: "garland", points: 3, aliases: ["ribbon"] },
        ],
      },
      {
        prompt: "Name a reindeer besides Rudolph.",
        answers: [
          { text: "Dasher", points: 35, aliases: ["dasher"] },
          { text: "Vixen", points: 25, aliases: ["vixen"] },
          { text: "Comet", points: 20, aliases: ["comet"] },
          { text: "Blitzen", points: 12, aliases: ["blitzen"] },
          { text: "Prancer", points: 8, aliases: ["prancer"] },
        ],
      },
      {
        prompt: "Name a Christmas movie people watch every year.",
        answers: [
          { text: "Home Alone", points: 40, aliases: ["home alone 1", "kevin"] },
          { text: "Elf", points: 30, aliases: ["buddy the elf"] },
          { text: "The Grinch", points: 20, aliases: ["how the grinch stole christmas", "grinch"] },
          { text: "A Christmas Story", points: 7, aliases: ["ralphie"] },
          { text: "The Polar Express", points: 3, aliases: ["polar express"] },
        ],
      },
      {
        prompt: "Name a Christmas morning activity.",
        answers: [
          { text: "opening gifts", points: 50, aliases: ["open presents", "open gifts"] },
          { text: "making breakfast", points: 20, aliases: ["cook breakfast"] },
          { text: "taking photos", points: 15, aliases: ["pictures"] },
          { text: "drinking hot cocoa", points: 10, aliases: ["hot chocolate", "cocoa"] },
          { text: "cleaning up wrapping paper", points: 5, aliases: ["cleaning", "cleanup"] },
        ],
      },
    ],
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
          { text: "clove", points: 3, aliases: ["cloves"] },
        ],
      },
      {
        prompt: "Name a Christmas party drink.",
        answers: [
          { text: "eggnog", points: 40, aliases: ["nog"] },
          { text: "hot chocolate", points: 30, aliases: ["hot cocoa"] },
          { text: "apple cider", points: 15, aliases: ["cider"] },
          { text: "wine", points: 10, aliases: ["mulled wine"] },
          { text: "champagne", points: 5, aliases: ["bubbly"] },
        ],
      },
      {
        prompt: "Name a gift kids ask for.",
        answers: [
          { text: "toys", points: 45, aliases: ["toy"] },
          { text: "video games", points: 30, aliases: ["games"] },
          { text: "electronics", points: 15, aliases: ["ipad", "tablet", "phone"] },
          { text: "stuffed animals", points: 7, aliases: ["stuffies", "plush"] },
          { text: "board games", points: 3, aliases: ["board game"] },
        ],
      },
      {
        prompt: "Name a Christmas symbol.",
        answers: [
          { text: "star", points: 40, aliases: [] },
          { text: "candy cane", points: 25, aliases: ["candy canes"] },
          { text: "wreath", points: 20, aliases: [] },
          { text: "bell", points: 10, aliases: ["bells"] },
          { text: "holly", points: 5, aliases: [] },
        ],
      },
      {
        prompt: "Name something people hang for Christmas.",
        answers: [
          { text: "stockings", points: 45, aliases: ["stocking"] },
          { text: "lights", points: 25, aliases: ["string lights"] },
          { text: "garland", points: 15, aliases: [] },
          { text: "wreath", points: 10, aliases: [] },
          { text: "mistletoe", points: 5, aliases: [] },
        ],
      },
    ],
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
          { text: "Joy to the World", points: 5, aliases: ["joy to the world"] },
        ],
      },
      {
        prompt: "Name a classic Christmas decoration.",
        answers: [
          { text: "wreath", points: 35, aliases: [] },
          { text: "mistletoe", points: 25, aliases: [] },
          { text: "nativity scene", points: 20, aliases: ["nativity"] },
          { text: "snow globe", points: 10, aliases: ["snowglobe"] },
          { text: "poinsettia", points: 5, aliases: ["poinsettias"] },
        ],
      },
      {
        prompt: "Name something people wrap for Christmas.",
        answers: [
          { text: "presents", points: 55, aliases: ["gifts"] },
          { text: "baked goods", points: 15, aliases: ["cookies", "treats"] },
          { text: "gift cards", points: 10, aliases: ["giftcard"] },
          { text: "candy", points: 10, aliases: ["chocolate"] },
          { text: "clothing", points: 5, aliases: ["clothes"] },
        ],
      },
      {
        prompt: "Name a winter clothing item worn on Christmas Day.",
        answers: [
          { text: "sweater", points: 40, aliases: ["ugly sweater"] },
          { text: "scarf", points: 25, aliases: [] },
          { text: "hat", points: 20, aliases: ["beanie"] },
          { text: "mittens", points: 10, aliases: ["gloves"] },
          { text: "boots", points: 5, aliases: [] },
        ],
      },
      {
        prompt: "Name a Christmas Eve tradition.",
        answers: [
          { text: "cookies for Santa", points: 45, aliases: ["leave cookies"] },
          { text: "opening one gift", points: 25, aliases: ["open one present"] },
          { text: "church service", points: 15, aliases: ["go to church"] },
          { text: "reading Christmas stories", points: 10, aliases: ["read stories", "read a christmas story"] },
          { text: "tracking Santa", points: 5, aliases: ["norad"] },
        ],
      },
    ],
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
          { text: "toy sack", points: 5, aliases: ["sack", "bag"] },
        ],
      },
      {
        prompt: "Name a Christmas song played in stores.",
        answers: [
          { text: "All I Want for Christmas", points: 45, aliases: ["all i want for christmas is you", "mariah"] },
          { text: "Jingle Bell Rock", points: 25, aliases: ["jingle bell rock"] },
          { text: "Last Christmas", points: 15, aliases: ["wham"] },
          { text: "Let It Snow", points: 10, aliases: ["let it snow"] },
          { text: "Rockin’ Around the Christmas Tree", points: 5, aliases: ["rockin around", "rocking around"] },
        ],
      },
      {
        prompt: "Name a Christmas activity families do together.",
        answers: [
          { text: "decorate the tree", points: 40, aliases: ["decorating"] },
          { text: "bake cookies", points: 30, aliases: ["baking"] },
          { text: "watch movies", points: 20, aliases: ["movie"] },
          { text: "wrap gifts", points: 10, aliases: ["wrapping"] },
          { text: "sing carols", points: 5, aliases: ["caroling"] },
        ],
      },
      {
        prompt: "Name a gift people give coworkers.",
        answers: [
          { text: "gift cards", points: 40, aliases: ["giftcard"] },
          { text: "candles", points: 30, aliases: ["candle"] },
          { text: "mugs", points: 15, aliases: ["mug"] },
          { text: "treats/cookies", points: 10, aliases: ["cookies", "treats"] },
          { text: "lotions", points: 5, aliases: ["lotion"] },
        ],
      },
      {
        prompt: "Name something red at Christmas.",
        answers: [
          { text: "Santa’s suit", points: 45, aliases: ["santa suit", "santa"] },
          { text: "candy cane stripes", points: 25, aliases: ["candy cane", "candy canes"] },
          { text: "bows", points: 15, aliases: ["ribbon"] },
          { text: "stockings", points: 10, aliases: ["stocking"] },
          { text: "poinsettias", points: 5, aliases: ["poinsettia"] },
        ],
      },
    ],
  },
];

// -----------------------------
// Helpers
// -----------------------------
const STORAGE_DECK_KEY = "cff_deck_v3";

function deepClone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T;
}

function safeJsonParse<T>(raw: string | null): T | null {
  try {
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function normalize(s: string) {
  return (s || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/ +/g, " ");
}

function isMatch(guess: string, a: Answer) {
  const g = normalize(guess);
  if (!g) return false;
  const candidates = [a.text, ...(a.aliases || [])].map(normalize);
  if (candidates.includes(g)) return true;
  return candidates.some((c) => c.includes(g) || g.includes(c));
}

function downloadJson(filename: string, data: unknown) {
  try {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  } catch {
    // ignore
  }
}

function newRound(): Round {
  return {
    id: `r_${Math.random().toString(36).slice(2, 9)}`,
    title: "New Round",
    question: "",
    answers: [
      { text: "", points: 0, aliases: [] },
      { text: "", points: 0, aliases: [] },
      { text: "", points: 0, aliases: [] },
      { text: "", points: 0, aliases: [] },
      { text: "", points: 0, aliases: [] },
    ],
  };
}

function sanitizeDeck(raw: any): Round[] {
  if (!Array.isArray(raw)) return deepClone(STARTER_ROUNDS);
  const cleaned: Round[] = raw
    .filter(Boolean)
    .map((r: any) => ({
      id: String(r?.id || `r_${Math.random().toString(36).slice(2, 9)}`),
      title: String(r?.title || "Round"),
      question: String(r?.question || ""),
      answers: Array.isArray(r?.answers)
        ? r.answers.map((a: any) => ({
            text: String(a?.text || ""),
            points: Number(a?.points || 0),
            aliases: Array.isArray(a?.aliases) ? a.aliases.map((x: any) => String(x)) : [],
          }))
        : [],
    }));
  return cleaned.length ? cleaned : deepClone(STARTER_ROUNDS);
}

function navigateToMode(mode: UiMode, newTab: boolean) {
  if (typeof window === "undefined") return;
  const u = new URL(window.location.href);
  u.searchParams.set("mode", mode);
  if (newTab) window.open(u.toString(), "_blank", "noopener,noreferrer");
  else window.location.href = u.toString();
}

// -----------------------------
// Sounds (no audio files)
// -----------------------------
function useSoundFx(soundMode: SoundMode, volume: number) {
  const ctxRef = useRef<AudioContext | null>(null);

  function ensureCtx() {
    if (soundMode === "off") return null;
    const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!ctxRef.current) ctxRef.current = new AudioCtx();
    return ctxRef.current;
  }

  function beep({
    type,
    f0,
    f1,
    durationMs,
  }: {
    type: OscillatorType;
    f0: number;
    f1?: number;
    durationMs: number;
  }) {
    const ctx = ensureCtx();
    if (!ctx) return;

    if (ctx.state === "suspended") ctx.resume().catch(() => undefined);

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(f0, now);
    if (typeof f1 === "number") {
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, f1), now + durationMs / 1000);
    }

    const v = Math.max(0, Math.min(1, volume));
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.18 * v), now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + durationMs / 1000);
  }

  function correct() {
    if (soundMode === "off") return;
    beep({ type: "sine", f0: 880, f1: 1320, durationMs: 140 });
    window.setTimeout(() => beep({ type: "sine", f0: 660, f1: 990, durationMs: 140 }), 120);
  }

  function wrong() {
    if (soundMode === "off") return;
    beep({ type: "sawtooth", f0: 220, f1: 90, durationMs: 260 });
  }

  return { correct, wrong };
}

// -----------------------------
// App
// -----------------------------
export default function Page() {
  const uiMode: UiMode = useMemo(() => {
    if (typeof window === "undefined") return "host";
    const u = new URL(window.location.href);
    const m = (u.searchParams.get("mode") || "host").toLowerCase();
    return m === "tv" ? "tv" : "host";
  }, []);
  const tvMode = uiMode === "tv";

  // Stage
  const [stage, setStage] = useState<Stage>(tvMode ? "play" : "setup");

  // Main-game deck (persisted)
  const [rounds, setRounds] = useState<Round[]>(() => {
    if (typeof window === "undefined") return deepClone(STARTER_ROUNDS);
    const saved = safeJsonParse<any>(localStorage.getItem(STORAGE_DECK_KEY));
    return sanitizeDeck(saved ?? STARTER_ROUNDS);
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      // always persist sanitized shape (prevents future TS/runtime weirdness)
      localStorage.setItem(STORAGE_DECK_KEY, JSON.stringify(sanitizeDeck(rounds)));
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rounds]);

  // Setup controls
  const [teamAName, setTeamAName] = useState("Team Holly");
  const [teamBName, setTeamBName] = useState("Team Jolly");

  const [soundMode, setSoundMode] = useState<SoundMode>("on");
  const [soundVolume, setSoundVolume] = useState(0.9);
  const sfx = useSoundFx(soundMode, soundVolume);

  // Main game state
  const [roundIndex, setRoundIndex] = useState(0);
  const round = rounds[Math.min(roundIndex, Math.max(0, rounds.length - 1))];

  const [revealed, setRevealed] = useState<string[]>([]);
  const revealedSet = useMemo(() => new Set(revealed), [revealed]);
  const [guess, setGuess] = useState("");
  const [bank, setBank] = useState(0);

  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [activeTeam, setActiveTeam] = useState<"A" | "B">("A");
  const [message, setMessage] = useState("Ready.");

  function resetMainRoundState(nextIndex: number) {
    setRoundIndex(nextIndex);
    setRevealed([]);
    setGuess("");
    setBank(0);
    setMessage("New round. Face-off and begin.");
  }

  function startMainGame() {
    setStage("play");
    resetMainRoundState(0);
  }

  function submitGuess() {
    const g = guess.trim();
    if (!g || !round) return;

    const match = (round.answers || []).find((a) => isMatch(g, a));
    if (!match) {
      setGuess("");
      setMessage("Not on the board.");
      sfx.wrong();
      return;
    }
    if (revealedSet.has(match.text)) {
      setGuess("");
      setMessage("Already revealed.");
      return;
    }

    setRevealed((prev) => [...prev, match.text]);
    setBank((b) => b + match.points);
    setGuess("");
    setMessage(`On the board: ${match.text} (+${match.points})`);
    sfx.correct();
  }

  function awardBank(to: "A" | "B") {
    if (bank <= 0) {
      setMessage("Nothing to award.");
      return;
    }
    if (to === "A") setScoreA((s) => s + bank);
    else setScoreB((s) => s + bank);
    setBank(0);
    setMessage(`Awarded ${bank} points to ${to === "A" ? teamAName : teamBName}.`);
  }

  function revealAll() {
    setRevealed((round?.answers || []).map((a) => a.text));
    setMessage("All answers revealed.");
  }

  function nextRound() {
    if (!rounds.length) return;
    if (roundIndex >= rounds.length - 1) {
      setMessage("Game complete. Final scores are on the board.");
      return;
    }
    resetMainRoundState(roundIndex + 1);
  }

  function resetToSetup() {
    setStage("setup");
    setMessage("Back to setup.");
  }

  function resetDeckToStarter() {
    setRounds(deepClone(STARTER_ROUNDS));
    setMessage("Deck reset to starter.");
  }

  // -----------------------------
  // Deck Builder (main deck)
  // -----------------------------
  const [draftDeck, setDraftDeck] = useState<Round[]>([]);
  const [importText, setImportText] = useState("");

  function openDeckBuilder() {
    setDraftDeck(deepClone(rounds));
    setStage("deck");
    setMessage("Deck Builder: edit rounds, then Save Deck.");
  }

  function saveDeckBuilder() {
    if (!draftDeck || draftDeck.length === 0) {
      setMessage("Deck is empty — add at least one round.");
      return;
    }
    setRounds(sanitizeDeck(draftDeck));
    setStage("setup");
    setMessage(`Deck saved (${sanitizeDeck(draftDeck).length} rounds).`);
  }

  function updateRound(idx: number, patch: Partial<Round>) {
    setDraftDeck((prev) => {
      const next = prev.map((r) => ({
        ...r,
        answers: (r.answers || []).map((a) => ({ ...a, aliases: Array.isArray(a.aliases) ? a.aliases : [] })),
      }));
      next[idx] = { ...next[idx], ...patch };
      // keep answers typed consistently if patch contains answers
      if ((patch as any)?.answers) next[idx].answers = sanitizeDeck([next[idx]])[0].answers;
      return next;
    });
  }

  function updateAnswer(rIdx: number, aIdx: number, patch: Partial<Answer>) {
    setDraftDeck((prev) => {
      const next = prev.map((r) => ({
        ...r,
        answers: (r.answers || []).map((a) => ({ ...a, aliases: Array.isArray(a.aliases) ? a.aliases : [] })),
      }));
      const r = next[rIdx] || newRound();
      const answers = Array.isArray(r.answers) ? [...r.answers] : [];
      answers[aIdx] = {
        ...(answers[aIdx] || { text: "", points: 0, aliases: [] }),
        ...patch,
        aliases: Array.isArray((patch as any)?.aliases)
          ? (patch as any).aliases
          : Array.isArray((answers[aIdx] as any)?.aliases)
          ? (answers[aIdx] as any).aliases
          : [],
      };
      next[rIdx] = { ...r, answers };
      return next;
    });
  }

  function addRound() {
    setDraftDeck((prev) => [...prev, newRound()]);
  }

  function deleteRound(idx: number) {
    setDraftDeck((prev) => prev.filter((_, i) => i !== idx));
  }

  function addAnswer(rIdx: number) {
    setDraftDeck((prev) => {
      const next = prev.map((r) => ({ ...r }));
      const r = next[rIdx] || newRound();
      const answers = Array.isArray(r.answers) ? [...r.answers] : [];
      answers.push({ text: "", points: 0, aliases: [] });
      next[rIdx] = { ...r, answers };
      return next;
    });
  }

  function deleteAnswer(rIdx: number, aIdx: number) {
    setDraftDeck((prev) => {
      const next = prev.map((r) => ({ ...r }));
      const r = next[rIdx] || newRound();
      const answers = Array.isArray(r.answers) ? r.answers.filter((_, i) => i !== aIdx) : [];
      next[rIdx] = { ...r, answers };
      return next;
    });
  }

  async function importFromFile(file: File) {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      setDraftDeck(sanitizeDeck(parsed));
      setMessage("Imported deck into builder. Click Save Deck.");
    } catch (e: any) {
      alert(`Import failed: ${e?.message || "Invalid JSON"}`);
    }
  }

  function importFromTextbox() {
    try {
      const parsed = JSON.parse(importText);
      setDraftDeck(sanitizeDeck(parsed));
      setImportText("");
      setMessage("Imported deck into builder. Click Save Deck.");
    } catch (e: any) {
      setMessage(`Import failed: ${e?.message || "Invalid JSON"}`);
    }
  }

  // -----------------------------
  // Fast Money state
  // -----------------------------
  const [fmRoundId, setFmRoundId] = useState(FAST_MONEY_ROUNDS[0].id);
  const fmRound = FAST_MONEY_ROUNDS.find((r) => r.id === fmRoundId) || FAST_MONEY_ROUNDS[0];

  const [fmPlayer, setFmPlayer] = useState<1 | 2>(1);
  const [fmQIndex, setFmQIndex] = useState(0);
  const fmQ = fmRound.questions[fmQIndex];

  const [fmInput, setFmInput] = useState("");
  const [fmP1, setFmP1] = useState<{ answers: string[]; points: number[]; total: number }>({
    answers: [],
    points: [],
    total: 0,
  });
  const [fmP2, setFmP2] = useState<{ answers: string[]; points: number[]; total: number }>({
    answers: [],
    points: [],
    total: 0,
  });

  const [fmTimerSeconds, setFmTimerSeconds] = useState(25);
  const [fmTimeLeft, setFmTimeLeft] = useState(25);
  const [fmRunning, setFmRunning] = useState(false);
  const fmRef = useRef<number | null>(null);

  useEffect(() => {
    if (!fmRunning) return;
    fmRef.current = window.setInterval(() => setFmTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => {
      if (fmRef.current) window.clearInterval(fmRef.current);
      fmRef.current = null;
    };
  }, [fmRunning]);

  useEffect(() => {
    if (fmRunning && fmTimeLeft === 0) {
      setFmRunning(false);
      sfx.wrong();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    if (ans && pts > 0) sfx.correct();
    else if (ans) sfx.wrong();

    if (fmPlayer === 1) {
      setFmP1((p) => ({
        answers: [...p.answers, ans || "(blank)"],
        points: [...p.points, pts],
        total: p.total + pts,
      }));
    } else {
      setFmP2((p) => ({
        answers: [...p.answers, ans || "(blank)"],
        points: [...p.points, pts],
        total: p.total + pts,
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

  // -----------------------------
  // Styling (no Tailwind)
  // -----------------------------
  const styles: Record<string, React.CSSProperties> = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(180deg, #064e3b 0%, #065f46 45%, #7f1d1d 100%)",
      color: "white",
      padding: 18,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    wrap: { maxWidth: 1200, margin: "0 auto", display: "grid", gap: 14 },
    title: { textAlign: "center", fontWeight: 900, fontSize: tvMode ? 46 : 40, margin: "8px 0 0" },
    sub: { textAlign: "center", opacity: 0.85, marginTop: 6 },
    card: {
      border: "1px solid rgba(255,255,255,0.18)",
      background: "rgba(255,255,255,0.10)",
      borderRadius: 24,
      padding: 16,
    },
    row: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" },
    boardRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
      padding: "12px 14px",
      borderRadius: 18,
      border: "1px solid rgba(255,255,255,0.18)",
      background: "rgba(0,0,0,0.10)",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: 14,
      border: "1px solid rgba(255,255,255,0.25)",
      background: "rgba(0,0,0,0.20)",
      color: "white",
      outline: "none",
      fontSize: 16,
    },
    btn: {
      padding: "10px 14px",
      borderRadius: 14,
      border: "1px solid rgba(255,255,255,0.25)",
      background: "rgba(255,255,255,0.16)",
      color: "white",
      fontWeight: 800,
      cursor: "pointer",
    },
    btnGhost: {
      padding: "10px 14px",
      borderRadius: 14,
      border: "1px solid rgba(255,255,255,0.35)",
      background: "transparent",
      color: "white",
      fontWeight: 800,
      cursor: "pointer",
    },
    big: { fontSize: tvMode ? 42 : 26, fontWeight: 900 },
    small: { opacity: 0.85, fontSize: 13 },
    pill: {
      padding: "6px 10px",
      borderRadius: 999,
      border: "1px solid rgba(255,255,255,0.22)",
      background: "rgba(255,255,255,0.10)",
      fontWeight: 800,
    },
  };

  // -----------------------------
  // Render header (includes mode buttons)
  // -----------------------------
  const header = (
    <div>
      <div style={styles.title}>Christmas Friendly Feud</div>
      <div style={styles.sub}>
        {tvMode ? "TV Board" : "Host Mode"} — TV: <b>?mode=tv</b> | Host: <b>?mode=host</b>
      </div>

      <div style={{ marginTop: 10, display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
        {tvMode ? (
          <>
            <button style={styles.btn} onClick={() => navigateToMode("host", false)}>
              Go to Host Mode
            </button>
            <button style={styles.btnGhost} onClick={() => navigateToMode("host", true)}>
              Open Host in New Tab
            </button>
          </>
        ) : (
          <>
            <button style={styles.btnGhost} onClick={() => navigateToMode("tv", true)}>
              Open TV Board (New Tab)
            </button>
            <button style={styles.btnGhost} onClick={() => navigateToMode("tv", false)}>
              Switch to TV Mode
            </button>
          </>
        )}
      </div>
    </div>
  );

  // -----------------------------
  // Setup (Host only)
  // -----------------------------
  if (stage === "setup") {
    return (
      <div style={styles.page}>
        <div style={styles.wrap}>
          {header}

          {tvMode ? (
            <div style={styles.card}>
              <div style={{ textAlign: "center", opacity: 0.9 }}>
                TV mode is board-only. Use the button above to go to Host mode for controls.
              </div>
            </div>
          ) : (
            <div style={styles.card}>
              <div style={styles.row}>
                <div>
                  <div style={styles.small}>Setup</div>
                  <div style={{ fontSize: 26, fontWeight: 900 }}>Teams, deck, and sound</div>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button style={styles.btnGhost} onClick={() => setStage("fastmoney")}>
                    Fast Money
                  </button>
                  <button style={styles.btn} onClick={startMainGame}>
                    Start Main Game
                  </button>
                </div>
              </div>

              <div style={{ height: 12 }} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <div style={styles.small}>Team A name</div>
                  <input style={styles.input} value={teamAName} onChange={(e) => setTeamAName(e.target.value)} />
                </div>
                <div>
                  <div style={styles.small}>Team B name</div>
                  <input style={styles.input} value={teamBName} onChange={(e) => setTeamBName(e.target.value)} />
                </div>
              </div>

              <div style={{ height: 14 }} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, alignItems: "end" }}>
                <div>
                  <div style={styles.small}>Sound</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button style={soundMode === "on" ? styles.btn : styles.btnGhost} onClick={() => setSoundMode("on")}>
                      On
                    </button>
                    <button style={soundMode === "off" ? styles.btn : styles.btnGhost} onClick={() => setSoundMode("off")}>
                      Off
                    </button>
                  </div>
                </div>
                <div>
                  <div style={styles.small}>Volume</div>
                  <input
                    style={{ width: "100%" }}
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={soundVolume}
                    onChange={(e) => setSoundVolume(Number(e.target.value))}
                  />
                </div>
                <div>
                  <div style={styles.small}>Test sounds</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button style={styles.btnGhost} onClick={() => sfx.correct()}>
                      Chime
                    </button>
                    <button style={styles.btnGhost} onClick={() => sfx.wrong()}>
                      Buzz
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ height: 14 }} />

              <div style={styles.row}>
                <div style={styles.small}>
                  Main-game deck currently has <b>{rounds.length}</b> rounds (stored in this browser).
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button style={styles.btnGhost} onClick={openDeckBuilder}>
                    Deck Builder (Easy Edit)
                  </button>
                  <button style={styles.btnGhost} onClick={resetDeckToStarter}>
                    Reset Deck to Starter
                  </button>
                </div>
              </div>

              <div style={{ marginTop: 10, textAlign: "center", opacity: 0.9 }}>{message}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -----------------------------
  // Deck Builder (Host only)
  // -----------------------------
  if (stage === "deck") {
    return (
      <div style={styles.page}>
        <div style={styles.wrap}>
          {header}

          <div style={styles.card}>
            <div style={styles.row}>
              <div>
                <div style={styles.small}>Deck Builder</div>
                <div style={{ fontSize: 26, fontWeight: 900 }}>Add / edit rounds without coding</div>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button style={styles.btnGhost} onClick={resetToSetup}>
                  Back
                </button>
                <button style={styles.btn} onClick={saveDeckBuilder}>
                  Save Deck
                </button>
              </div>
            </div>

            <div style={{ height: 12 }} />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button style={styles.btnGhost} onClick={addRound}>
                Add Round
              </button>
              <button style={styles.btnGhost} onClick={() => downloadJson("christmas-friendly-feud-deck.json", draftDeck)}>
                Export JSON
              </button>

              <label style={{ display: "inline-flex", gap: 10, alignItems: "center" }}>
                <input
                  type="file"
                  accept="application/json"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) importFromFile(f);
                    e.currentTarget.value = "";
                  }}
                />
                <span style={styles.btnGhost}>Import JSON File</span>
              </label>

              <button
                style={styles.btnGhost}
                onClick={() => {
                  setDraftDeck(deepClone(STARTER_ROUNDS));
                  setMessage("Loaded starter deck into builder. Click Save Deck.");
                }}
              >
                Load Starter Deck
              </button>
            </div>

            <div style={{ height: 12 }} />
            <div style={{ ...styles.small, marginBottom: 8 }}>Optional: paste deck JSON below, then click Import.</div>

            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='Example: [{"id":"r1","title":"Round 1","question":"...","answers":[{"text":"...","points":30,"aliases":["..."]}]}]'
              style={{
                width: "100%",
                height: 120,
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.25)",
                background: "rgba(0,0,0,0.25)",
                color: "white",
                padding: 12,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                fontSize: 12,
              }}
            />
            <div style={{ height: 10 }} />
            <button style={styles.btnGhost} onClick={importFromTextbox}>
              Import from Textbox
            </button>

            <div style={{ marginTop: 10, textAlign: "center", opacity: 0.9 }}>{message}</div>
          </div>

          {draftDeck.map((r, rIdx) => (
            <div key={r.id || rIdx} style={styles.card}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div style={styles.small}>Title</div>
                  <input style={styles.input} value={r.title || ""} onChange={(e) => updateRound(rIdx, { title: e.target.value })} />
                </div>
                <div style={{ flex: 2, minWidth: 320 }}>
                  <div style={styles.small}>Question</div>
                  <input
                    style={styles.input}
                    value={r.question || ""}
                    onChange={(e) => updateRound(rIdx, { question: e.target.value })}
                  />
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "end" }}>
                  <button style={styles.btnGhost} onClick={() => addAnswer(rIdx)}>
                    Add Answer
                  </button>
                  <button style={styles.btnGhost} onClick={() => deleteRound(rIdx)}>
                    Delete Round
                  </button>
                </div>
              </div>

              <div style={{ height: 12 }} />

              <div style={{ display: "grid", gap: 10 }}>
                {(r.answers || []).map((a, aIdx) => (
                  <div key={`${rIdx}-${aIdx}`} style={{ ...styles.boardRow, background: "rgba(255,255,255,0.12)" }}>
                    <div style={{ flex: 2, minWidth: 240 }}>
                      <div style={styles.small}>Answer</div>
                      <input style={styles.input} value={a.text || ""} onChange={(e) => updateAnswer(rIdx, aIdx, { text: e.target.value })} />
                    </div>
                    <div style={{ width: 120 }}>
                      <div style={styles.small}>Points</div>
                      <input
                        style={styles.input}
                        type="number"
                        value={Number(a.points || 0)}
                        onChange={(e) => updateAnswer(rIdx, aIdx, { points: Number(e.target.value || 0) })}
                      />
                    </div>
                    <div style={{ flex: 2, minWidth: 240 }}>
                      <div style={styles.small}>Aliases (comma separated)</div>
                      <input
                        style={styles.input}
                        value={(a.aliases || []).join(", ")}
                        onChange={(e) =>
                          updateAnswer(rIdx, aIdx, {
                            aliases: (e.target.value || "")
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "end" }}>
                      <button style={styles.btnGhost} onClick={() => deleteAnswer(rIdx, aIdx)}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // -----------------------------
  // Fast Money
  // -----------------------------
  if (stage === "fastmoney") {
    if (tvMode) {
      return (
        <div style={styles.page}>
          <div style={styles.wrap}>
            {header}
            <div style={styles.card}>
              <div style={styles.row}>
                <div>
                  <div style={styles.small}>Fast Money</div>
                  <div style={styles.big}>{fmRound.title}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={styles.small}>Timer</div>
                  <div style={styles.big}>{fmTimeLeft}</div>
                </div>
              </div>

              <div style={{ marginTop: 14, fontSize: 34, fontWeight: 900 }}>
                Player {fmPlayer} — Question {fmQIndex + 1} of {fmRound.questions.length}
              </div>
              <div style={{ marginTop: 10, fontSize: 38, fontWeight: 900 }}>{fmQ?.prompt}</div>

              <div style={{ marginTop: 14, textAlign: "center", opacity: 0.9 }}>
                {teamAName} vs {teamBName}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={styles.page}>
        <div style={styles.wrap}>
          {header}

          <div style={styles.card}>
            <div style={styles.row}>
              <div>
                <div style={styles.small}>Fast Money</div>
                <div style={{ fontSize: 26, fontWeight: 900 }}>{fmRound.title}</div>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button style={styles.btnGhost} onClick={resetToSetup}>
                  Back to Setup
                </button>
                <button style={styles.btnGhost} onClick={fmResetAll}>
                  Reset FM
                </button>
              </div>
            </div>

            <div style={{ height: 12 }} />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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

            <div style={{ height: 14 }} />

            <div style={styles.row}>
              <div>
                <div style={styles.small}>Player / Question</div>
                <div style={{ fontSize: 22, fontWeight: 900 }}>
                  Player {fmPlayer} — Q{fmQIndex + 1} of {fmRound.questions.length}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={styles.small}>Timer</div>
                <div style={{ fontSize: 26, fontWeight: 900 }}>{fmTimeLeft}</div>
              </div>
            </div>

            <div style={{ marginTop: 12, fontSize: 24, fontWeight: 900 }}>{fmQ?.prompt}</div>

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

            <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
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
              Fast Money scores using your aliases in <code>FAST_MONEY_ROUNDS</code>.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Main Game (Play)
  // -----------------------------
  const boardRows = (round?.answers || []).map((a, i) => {
    const r = revealedSet.has(a.text);
    return (
      <div key={`${a.text}-${i}`} style={styles.boardRow}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ width: 26, opacity: 0.85 }}>{i + 1}</div>
          <div style={{ fontSize: tvMode ? 30 : 18, fontWeight: 900 }}>{r ? a.text : "______________"}</div>
        </div>
        <div style={{ width: 90, textAlign: "right", fontWeight: 900, fontSize: tvMode ? 34 : 18 }}>{r ? a.points : ""}</div>
      </div>
    );
  });

  if (tvMode) {
    return (
      <div style={styles.page}>
        <div style={styles.wrap}>
          {header}

          <div style={styles.card}>
            <div style={styles.row}>
              <div>
                <div style={styles.small}>
                  {round?.title} (Round {roundIndex + 1} of {rounds.length})
                </div>
                <div style={{ fontSize: 34, fontWeight: 900, marginTop: 6 }}>{round?.question}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={styles.small}>Round bank</div>
                <div style={styles.big}>{bank}</div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 10 }}>{boardRows}</div>

          <div style={styles.card}>
            <div style={styles.row}>
              <div>
                <div style={styles.small}>Scores</div>
                <div style={{ fontSize: 28, fontWeight: 900 }}>
                  {teamAName}: {scoreA} | {teamBName}: {scoreB}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={styles.small}>Active</div>
                <div style={styles.pill}>{activeTeam === "A" ? teamAName : teamBName}</div>
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: 8, opacity: 0.9 }}>{message}</div>
          </div>
        </div>
      </div>
    );
  }

  // Host play view
  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        {header}

        <div style={styles.card}>
          <div style={styles.row}>
            <div>
              <div style={styles.small}>Scoreboard</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <span style={styles.pill}>
                  {teamAName}: {scoreA}
                </span>
                <span style={styles.pill}>
                  {teamBName}: {scoreB}
                </span>
                <span style={styles.pill}>Bank: {bank}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button style={styles.btnGhost} onClick={resetToSetup}>
                Setup
              </button>
              <button style={styles.btnGhost} onClick={openDeckBuilder}>
                Deck Builder
              </button>
              <button style={styles.btnGhost} onClick={() => setStage("fastmoney")}>
                Fast Money
              </button>
            </div>
          </div>

          <div style={{ height: 10 }} />

          <div style={styles.row}>
            <div>
              <div style={styles.small}>
                {round?.title} (Round {roundIndex + 1} of {rounds.length})
              </div>
              <div style={{ fontSize: 28, fontWeight: 900 }}>{round?.question}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={styles.small}>Active team</div>
              <div style={styles.pill}>{activeTeam === "A" ? teamAName : teamBName}</div>
            </div>
          </div>

          <div style={{ height: 12 }} />
          <div style={{ display: "grid", gap: 10 }}>{boardRows}</div>

          <div style={{ height: 12 }} />

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              style={styles.input}
              placeholder="Host: type a guess and press Enter"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitGuess()}
            />
            <button style={styles.btn} onClick={submitGuess}>
              Submit
            </button>
          </div>

          <div style={{ height: 10 }} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
            <button style={styles.btnGhost} onClick={() => setActiveTeam(activeTeam === "A" ? "B" : "A")}>
              Switch Active Team
            </button>
            <button style={styles.btn} onClick={() => awardBank(activeTeam)}>
              Award Bank to Active Team
            </button>
            <button style={styles.btnGhost} onClick={() => awardBank(activeTeam === "A" ? "B" : "A")}>
              Steal: Award to Other Team
            </button>
            <button style={styles.btnGhost} onClick={revealAll}>
              Reveal All
            </button>
            <button style={styles.btnGhost} onClick={nextRound}>
              Next Round
            </button>
            <button style={styles.btnGhost} onClick={() => setBank(0)}>
              Clear Bank
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: 10, opacity: 0.9 }}>{message}</div>
        </div>

        <div style={{ textAlign: "center", opacity: 0.75, fontSize: 12 }}>
          TV mode: open a second tab at <span style={{ fontFamily: "monospace" }}>?mode=tv</span>.
        </div>
      </div>
    </div>
  );
}

