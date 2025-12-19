"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* ---------- Simple UI helpers (no extra libraries) ---------- */

function Button({ children, onClick, variant = "primary", disabled }: any) {
  const base =
    "px-4 py-2 rounded-xl font-semibold transition border";
  const styles: any = {
    primary: "bg-white/20 text-white border-white/20 hover:bg-white/30",
    outline: "bg-transparent text-white border-white/40 hover:bg-white/10",
    destructive: "bg-red-600/80 text-white border-red-700 hover:bg-red-700"
  };
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${styles[variant]} ${disabled ? "opacity-50" : ""}`}
    >
      {children}
    </button>
  );
}

function Input(props: any) {
  return (
    <input
      {...props}
      className="w-full px-3 py-2 rounded-xl bg-white/10 text-white border border-white/30"
    />
  );
}

function Card({ children }: any) {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/10 p-4">
      {children}
    </div>
  );
}

/* ---------- Game Data ---------- */

const STARTER_ROUNDS = [
  {
    id: "r1",
    title: "Round 1",
    question: "Name something people do before Christmas.",
    answers: [
      { text: "Buy gifts", points: 35, aliases: ["shopping"] },
      { text: "Decorate", points: 25, aliases: ["tree", "lights"] },
      { text: "Wrap presents", points: 20, aliases: ["wrap"] },
      { text: "Bake", points: 10, aliases: ["cookies"] },
      { text: "Travel", points: 10, aliases: ["drive", "fly"] }
    ]
  }
];

function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim();
}

/* ---------- Main App ---------- */

export default function ChristmasFriendlyFeud() {
  const [rounds, setRounds] = useState<any[]>(STARTER_ROUNDS);
  const [roundIndex, setRoundIndex] = useState(0);
  const [revealed, setRevealed] = useState<string[]>([]);
  const [guess, setGuess] = useState("");
  const [bank, setBank] = useState(0);
  const [teamA, setTeamA] = useState(0);
  const [teamB, setTeamB] = useState(0);
  const [activeTeam, setActiveTeam] = useState<"A" | "B">("A");

  const round = rounds[roundIndex];

  function submitGuess() {
    const g = normalize(guess);
    const match = round.answers.find(
      (a: any) =>
        normalize(a.text) === g ||
        (a.aliases || []).map(normalize).includes(g)
    );

    if (!match || revealed.includes(match.text)) {
      setGuess("");
      return;
    }

    setRevealed([...revealed, match.text]);
    setBank(bank + match.points);
    setGuess("");
  }

  function award() {
    if (activeTeam === "A") setTeamA(teamA + bank);
    else setTeamB(teamB + bank);
    setBank(0);
    setRevealed([]);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-red-950 text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        <h1 className="text-4xl md:text-5xl font-extrabold text-center">
          🎄 Christmas Friendly Feud 🎄
        </h1>

        <Card>
          <div className="text-xl font-bold mb-2">{round.question}</div>
          <div className="space-y-2">
            {round.answers.map((a: any, i: number) => (
              <div
                key={i}
                className="flex justify-between border border-white/20 rounded-xl px-4 py-2"
              >
                <span>
                  {revealed.includes(a.text) ? a.text : "__________"}
                </span>
                <span>
                  {revealed.includes(a.text) ? a.points : ""}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex gap-2">
            <Input
              placeholder="Type an answer"
              value={guess}
              onChange={(e: any) => setGuess(e.target.value)}
              onKeyDown={(e: any) => e.key === "Enter" && submitGuess()}
            />
            <Button onClick={submitGuess}>Submit</Button>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center">
            <div>Team A: {teamA}</div>
            <div className="font-bold text-xl">Bank: {bank}</div>
            <div>Team B: {teamB}</div>
          </div>
          <div className="flex gap-2 mt-3">
            <Button onClick={() => setActiveTeam("A")} variant="outline">
              Active: Team A
            </Button>
            <Button onClick={() => setActiveTeam("B")} variant="outline">
              Active: Team B
            </Button>
            <Button onClick={award}>Award Points</Button>
          </div>
        </Card>

      </div>
    </div>
  );
}
