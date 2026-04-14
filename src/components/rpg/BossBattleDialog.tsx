"use client";

import { useCallback, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PixelBoss, PixelHeroTiered } from "./PixelArt";

type Phase = "intro" | "fight" | "won";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playerName: string;
  goalTitle: string;
  heroTierStep: number;
  onVictory: () => void;
};

const BOSS_HP_MAX = 100;
const PLAYER_HP_MAX = 64;

function roll(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function BossBattleDialog({ open, onOpenChange, playerName, goalTitle, heroTierStep, onVictory }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [bossHp, setBossHp] = useState(BOSS_HP_MAX);
  const [playerHp, setPlayerHp] = useState(PLAYER_HP_MAX);
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const reset = useCallback(() => {
    setPhase("intro");
    setBossHp(BOSS_HP_MAX);
    setPlayerHp(PLAYER_HP_MAX);
    setLog([]);
    setBusy(false);
  }, []);

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  function pushLine(line: string) {
    setLog((prev) => [...prev.slice(-5), line]);
  }

  function startFight() {
    setPhase("fight");
    pushLine(`\u9b54\u738b\u304c\u300c${goalTitle}\u300d\u3092\u3070\u304f\u3060\u3064\u3068\u3057\u3066\u3044\u308b\u2026\uff01`);
    pushLine("\u305f\u305f\u304b\u3048\uff01");
  }

  function attack() {
    if (phase !== "fight" || busy || bossHp <= 0) return;
    setBusy(true);
    const dmg = roll(14, 26);
    const nextBoss = Math.max(0, bossHp - dmg);
    pushLine(`\u300c${playerName}\u300d\u306e\u653b\u6483\uff01 \u9b54\u738b\u306b ${dmg} \u306e\u30c0\u30e1\u30fc\u30b8\uff01`);
    setBossHp(nextBoss);

    window.setTimeout(() => {
      if (nextBoss <= 0) {
        setPhase("won");
        pushLine("\u9b54\u738b\u3092\u305f\u304a\u3057\u305f\uff01 1\u5e74\u306e\u76ee\u6a19\u3092\u304b\u3061\u3068\u3063\u305f\uff01");
        setBusy(false);
        return;
      }
      const bite = roll(6, 14);
      pushLine(`\u9b54\u738b\u306e\u653b\u6483\uff01 ${bite} \u306e\u30c0\u30e1\u30fc\u30b8\uff01`);
      setPlayerHp((hp) => {
        const nh = hp - bite;
        if (nh <= 0) {
          window.setTimeout(() => {
            pushLine(
              "\u3064\u3089\u3044\u2026 \u3067\u3082\u8ae6\u3081\u306a\u3044\uff01 \u6c17\u5408\u3067\u7acb\u3061\u76f4\u3063\u305f\uff01 HP\u5168\u56de\u5fa9\uff01",
            );
          }, 80);
          return PLAYER_HP_MAX;
        }
        return nh;
      });
      setBusy(false);
    }, 520);
  }

  function handleVictoryClose() {
    onVictory();
    onOpenChange(false);
    reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="max-h-[90vh] overflow-y-auto rounded-none border-4 border-amber-700 bg-[#1a1528] p-0 text-amber-100 shadow-[0_0_0_4px_#292524,8px_8px_0_#0c0a09] sm:max-w-lg"
      >
        <DialogHeader className="border-b-4 border-amber-800 bg-[#2d2640] px-4 py-3">
          <DialogTitle className="font-mono text-lg tracking-wide text-amber-200">
            {"\u9b54\u738b\u3068\u306e\u6c7a\u6226"}
          </DialogTitle>
        </DialogHeader>

        <div className="relative min-h-[200px] bg-gradient-to-b from-indigo-950 to-slate-950 px-4 py-6">
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col items-center gap-2">
              <PixelHeroTiered tierStep={heroTierStep} scale={5} className="drop-shadow-[4px_4px_0_#000]" />
              <span className="font-mono text-xs text-sky-200">{playerName}</span>
              <Progress value={(playerHp / PLAYER_HP_MAX) * 100} className="h-2 w-24 border border-slate-600 bg-slate-800" />
              <span className="font-mono text-[10px] text-slate-400">HP {playerHp}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <PixelBoss scale={5} className="drop-shadow-[4px_4px_0_#000]" />
              <span className="font-mono text-xs text-rose-300">{"\u9b54\u738b"}</span>
              <Progress value={(bossHp / BOSS_HP_MAX) * 100} className="h-2 w-24 border border-slate-600 bg-slate-800 [&>div]:bg-rose-600" />
              <span className="font-mono text-[10px] text-slate-400">HP {bossHp}</span>
            </div>
          </div>
        </div>

        <div className="border-t-4 border-amber-800 bg-[#0c0a09] p-4">
          <div className="min-h-[100px] rounded border-2 border-slate-600 bg-[#1e293b] p-3 font-mono text-sm leading-relaxed text-white">
            {log.length === 0 && phase === "intro" && (
              <p>
                {"\u3068\u3046\u3068\u3001\u524d\u306b\u9b54\u738b\u304c\u3061\u3089\u3064\u304f\uff01"}
                <br />
                {"\u6700\u5f8c\u306e\u4e00\u6483\u3092\u304f\u3089\u3048\uff01"}
              </p>
            )}
            {log.map((line, i) => (
              <p key={i} className="mb-1 last:mb-0">
                {line}
              </p>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap justify-end gap-2">
            {phase === "intro" && (
              <Button
                type="button"
                className="rounded-none border-2 border-amber-600 bg-amber-700 font-mono text-amber-100 hover:bg-amber-600"
                onClick={startFight}
              >
                {"\u6226\u3046\uff01"}
              </Button>
            )}
            {phase === "fight" && (
              <Button
                type="button"
                disabled={busy}
                className="rounded-none border-2 border-sky-600 bg-sky-700 font-mono text-white hover:bg-sky-600 disabled:opacity-50"
                onClick={attack}
              >
                {"\u3053\u3046\u3052\u304d"}
              </Button>
            )}
            {phase === "won" && (
              <Button
                type="button"
                className="rounded-none border-2 border-emerald-600 bg-emerald-700 font-mono text-white hover:bg-emerald-600"
                onClick={handleVictoryClose}
              >
                {"\u76ee\u6a19\u9054\u6210\u3092\u8a18\u9332\u3059\u308b"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
