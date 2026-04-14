"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sword, Sparkles, Star, Plus, Trash2, Crown, ScrollText, Zap, CheckCircle2, Pencil, CalendarDays, Flag, ListTree, Wand2, ListPlus, Skull } from "lucide-react";
import { motion } from "framer-motion";
import { AdventureBackdrop } from "@/components/rpg/AdventureBackdrop";
import { BossBattleDialog } from "@/components/rpg/BossBattleDialog";
import { PixelHeroTiered } from "@/components/rpg/PixelArt";
import {
  ROADMAP_HORIZONS,
  emptyRoadmap,
  suggestRoadmap,
  type RoadmapHorizon,
  type RoadmapItem,
} from "@/lib/roadmap";
import { getCharacterTier, nextTierBucket } from "@/lib/characterTiers";

const STORAGE_KEY = "goal-rpg-app-v1";
/** \u30af\u30a8\u30b9\u30c8\u9054\u6210\u7387\u304c\u3053\u306e\u5024\u4ee5\u4e0a\u3067\u9b54\u738b\u6226\u89e3\u653e */
const BOSS_UNLOCK_PERCENT = 80;

function oneYearLater() {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
}

const starterData = {
  player: {
    name: "冒険者",
    level: 3,
    xp: 180,
    gold: 420,
    title: "継続の旅人",
  },
  yearGoal: {
    title: "",
    why: "",
    deadline: oneYearLater(),
    achieved: false,
  },
  quests: [
    {
      id: crypto.randomUUID(),
      title: "ショート動画を1本投稿する",
      category: "YouTube",
      difficulty: "normal",
      description: "1本完成させて投稿まで行う。",
      xpReward: 60,
      goldReward: 40,
      done: false,
    },
    {
      id: crypto.randomUUID(),
      title: "競合動画を3本分析する",
      category: "分析",
      difficulty: "easy",
      description: "勝ちパターンをメモする。",
      xpReward: 30,
      goldReward: 20,
      done: true,
    },
    {
      id: crypto.randomUUID(),
      title: "ロング動画の構成を1本作る",
      category: "制作",
      difficulty: "hard",
      description: "冒頭フックからオチまで骨組みを作る。",
      xpReward: 100,
      goldReward: 70,
      done: false,
    },
  ],
  roadmap: emptyRoadmap(),
};

function normalizeRoadmap(raw: unknown) {
  const base = emptyRoadmap();
  if (!raw || typeof raw !== "object") return base;
  const o = raw as Record<string, unknown>;
  for (const { key } of ROADMAP_HORIZONS) {
    const arr = o[key];
    if (!Array.isArray(arr)) continue;
    base[key] = arr
      .filter((x) => x && typeof x === "object")
      .map((x) => {
        const it = x as Record<string, unknown>;
        return {
          id: typeof it.id === "string" ? it.id : crypto.randomUUID(),
          title: typeof it.title === "string" ? it.title : "",
          detail: typeof it.detail === "string" ? it.detail : "",
        } satisfies RoadmapItem;
      });
  }
  return base;
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return starterData;
    const parsed = JSON.parse(raw);
    if (!parsed?.player || !Array.isArray(parsed?.quests)) return starterData;
    // 旧データに yearGoal がない場合はデフォルト値を補完
    if (!parsed.yearGoal) {
      parsed.yearGoal = { title: "", why: "", deadline: oneYearLater(), achieved: false };
    }
    if (typeof parsed.yearGoal.achieved !== "boolean") {
      parsed.yearGoal.achieved = false;
    }
    parsed.roadmap = normalizeRoadmap(parsed.roadmap);
    return parsed;
  } catch {
    return starterData;
  }
}

function getLevelFromXp(totalXp: number) {
  return Math.floor(totalXp / 100) + 1;
}

function getXpInLevel(totalXp: number) {
  return totalXp % 100;
}

function getXpNeeded() {
  return 100;
}

function difficultyLabel(difficulty: string) {
  if (difficulty === "easy") return "かんたん";
  if (difficulty === "hard") return "むずかしい";
  return "ふつう";
}

function difficultyColor(difficulty: string) {
  if (difficulty === "easy") return "bg-emerald-100 text-emerald-700";
  if (difficulty === "hard") return "bg-rose-100 text-rose-700";
  return "bg-amber-100 text-amber-700";
}

export default function GoalRpgApp() {
  const [data, setData] = useState(starterData);
  const [open, setOpen] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);
  const [roadmapTab, setRoadmapTab] = useState<RoadmapHorizon>("halfYear");
  const [bossOpen, setBossOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({
    title: "",
    category: "YouTube",
    difficulty: "normal",
    description: "",
  });
  const [goalForm, setGoalForm] = useState({
    title: "",
    why: "",
    deadline: oneYearLater(),
  });

  useEffect(() => {
    setData(loadData());
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const player = useMemo(() => {
    const totalXp = data.player.xp;
    return {
      ...data.player,
      level: getLevelFromXp(totalXp),
      xpInLevel: getXpInLevel(totalXp),
      xpNeeded: getXpNeeded(),
    };
  }, [data]);

  const categories = useMemo(() => {
    const values = new Set(data.quests.map((q) => q.category));
    return ["all", ...Array.from(values)];
  }, [data.quests]);

  const filteredQuests = useMemo(() => {
    if (filter === "all") return data.quests;
    return data.quests.filter((q) => q.category === filter);
  }, [data.quests, filter]);

  const completedCount = data.quests.filter((q) => q.done).length;
  const activeCount = data.quests.filter((q) => !q.done).length;

  const questProgressPercent = useMemo(() => {
    if (data.quests.length === 0) return 0;
    return Math.round((completedCount / data.quests.length) * 100);
  }, [data.quests.length, completedCount]);

  const bossBattleUnlocked =
    Boolean(data.yearGoal.title.trim()) &&
    data.quests.length > 0 &&
    questProgressPercent >= BOSS_UNLOCK_PERCENT &&
    !data.yearGoal.achieved;

  const characterTier = useMemo(
    () => getCharacterTier(questProgressPercent, data.yearGoal.achieved),
    [questProgressPercent, data.yearGoal.achieved],
  );

  const questsUntilNextTier = useMemo(() => {
    const nextB = nextTierBucket(characterTier.bucket);
    if (nextB === null || data.quests.length === 0) return null;
    const doneAtNext = Math.ceil((nextB / 100) * data.quests.length);
    return Math.max(0, doneAtNext - completedCount);
  }, [characterTier.bucket, data.quests.length, completedCount]);

  function rewardByDifficulty(difficulty: string) {
    if (difficulty === "easy") return { xpReward: 20, goldReward: 15 };
    if (difficulty === "hard") return { xpReward: 90, goldReward: 60 };
    return { xpReward: 50, goldReward: 30 };
  }

  function createQuest() {
    if (!form.title.trim()) return;
    const reward = rewardByDifficulty(form.difficulty);
    const quest = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      category: form.category,
      difficulty: form.difficulty,
      description: form.description.trim(),
      xpReward: reward.xpReward,
      goldReward: reward.goldReward,
      done: false,
    };

    setData((prev) => ({ ...prev, quests: [quest, ...prev.quests] }));
    setForm({ title: "", category: "YouTube", difficulty: "normal", description: "" });
    setOpen(false);
  }

  function toggleQuest(id: string) {
    const quest = data.quests.find((q) => q.id === id);
    if (!quest) return;

    setData((prev) => {
      const updatedQuests = prev.quests.map((q) =>
        q.id === id ? { ...q, done: !q.done } : q
      );

      const gainedXp = !quest.done ? quest.xpReward : -quest.xpReward;
      const gainedGold = !quest.done ? quest.goldReward : -quest.goldReward;

      return {
        ...prev,
        player: {
          ...prev.player,
          xp: Math.max(0, prev.player.xp + gainedXp),
          gold: Math.max(0, prev.player.gold + gainedGold),
        },
        quests: updatedQuests,
      };
    });
  }

  function openGoalDialog() {
    setGoalForm({
      title: data.yearGoal.title,
      why: data.yearGoal.why,
      deadline: data.yearGoal.deadline,
    });
    setGoalOpen(true);
  }

  function saveGoal() {
    setData((prev) => ({
      ...prev,
      yearGoal: { ...goalForm, achieved: prev.yearGoal.achieved },
    }));
    setGoalOpen(false);
  }

  function deleteQuest(id: string) {
    const quest = data.quests.find((q) => q.id === id);
    setData((prev) => ({
      ...prev,
      quests: prev.quests.filter((q) => q.id !== id),
      player: quest && quest.done
        ? {
            ...prev.player,
            xp: Math.max(0, prev.player.xp - quest.xpReward),
            gold: Math.max(0, prev.player.gold - quest.goldReward),
          }
        : prev.player,
    }));
  }

  function roadmapHasAny() {
    return ROADMAP_HORIZONS.some(({ key }) => data.roadmap[key].length > 0);
  }

  function applyRoadmapSuggestion() {
    if (!data.yearGoal.title.trim()) {
      window.alert("先に「1年後の目標」のタイトルを設定してください。");
      return;
    }
    if (roadmapHasAny()) {
      const ok = window.confirm("いまのロードマップをすべて置き換えて、新しく提案を生成しますか？");
      if (!ok) return;
    }
    setData((prev) => ({
      ...prev,
      roadmap: suggestRoadmap(prev.yearGoal.title, prev.yearGoal.why),
    }));
  }

  function addRoadmapItem(horizon: RoadmapHorizon) {
    setData((prev) => ({
      ...prev,
      roadmap: {
        ...prev.roadmap,
        [horizon]: [
          ...prev.roadmap[horizon],
          { id: crypto.randomUUID(), title: "", detail: "" },
        ],
      },
    }));
  }

  function updateRoadmapItem(horizon: RoadmapHorizon, id: string, patch: Partial<Pick<RoadmapItem, "title" | "detail">>) {
    setData((prev) => ({
      ...prev,
      roadmap: {
        ...prev.roadmap,
        [horizon]: prev.roadmap[horizon].map((it) => (it.id === id ? { ...it, ...patch } : it)),
      },
    }));
  }

  function removeRoadmapItem(horizon: RoadmapHorizon, id: string) {
    setData((prev) => ({
      ...prev,
      roadmap: {
        ...prev.roadmap,
        [horizon]: prev.roadmap[horizon].filter((it) => it.id !== id),
      },
    }));
  }

  function addHorizonToQuests(horizon: RoadmapHorizon) {
    const label = ROADMAP_HORIZONS.find((h) => h.key === horizon)?.label ?? "";
    const items = data.roadmap[horizon].filter((it) => it.title.trim());
    if (items.length === 0) {
      window.alert("タイトルが入力された行がありません。");
      return;
    }
    const reward = rewardByDifficulty("normal");
    const newQuests = items.map((it) => ({
      id: crypto.randomUUID(),
      title: it.title.trim(),
      category: "ロードマップ",
      difficulty: "normal",
      description: [it.detail.trim(), `（${label}）`].filter((s) => s.length > 0).join("\n"),
      xpReward: reward.xpReward,
      goldReward: reward.goldReward,
      done: false,
    }));
    setData((prev) => ({ ...prev, quests: [...newQuests, ...prev.quests] }));
  }

  function handleBossVictory() {
    setData((prev) => ({
      ...prev,
      yearGoal: { ...prev.yearGoal, achieved: true },
      player: {
        ...prev.player,
        xp: prev.player.xp + 200,
        gold: prev.player.gold + 150,
      },
    }));
  }

  return (
    <div className="relative min-h-screen text-white">
      <AdventureBackdrop />
      <div className="relative z-10 p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
            <CardContent className="p-0">
              <div className="grid gap-0 lg:grid-cols-[1.1fr,0.9fr]">
                <div className="p-6 md:p-8">
                  <div className="mb-4 flex items-center gap-2 text-sm text-slate-300">
                    <Crown className="h-4 w-4" />
                    目標達成RPG
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                    行動すると、
                    <br />
                    レベルが上がる。
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                    やることをクエスト化して、完了するたびに経験値とゴールドを獲得。目標達成をゲームのように続けられるアプリです。
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Badge className="rounded-xl bg-violet-500/20 px-3 py-1 text-violet-200 hover:bg-violet-500/20">
                      <Zap className="mr-1 h-3.5 w-3.5" /> レベル制
                    </Badge>
                    <Badge className="rounded-xl bg-amber-500/20 px-3 py-1 text-amber-200 hover:bg-amber-500/20">
                      <Star className="mr-1 h-3.5 w-3.5" /> 経験値
                    </Badge>
                    <Badge className="rounded-xl bg-emerald-500/20 px-3 py-1 text-emerald-200 hover:bg-emerald-500/20">
                      <ScrollText className="mr-1 h-3.5 w-3.5" /> クエスト管理
                    </Badge>
                  </div>
                </div>

                <div className="border-t border-white/10 bg-black/20 p-6 md:border-l md:border-t-0 md:p-8">
                  <div className="mb-4 flex flex-wrap items-start gap-3">
                    <div className="flex shrink-0">
                      <div className="flex h-[88px] w-[88px] shrink-0 items-end justify-center rounded-2xl border border-white/10 bg-slate-950/50 pb-1">
                        <PixelHeroTiered tierStep={characterTier.tierStep} scale={4} />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="text-lg font-semibold">{player.name}</div>
                      <div className="text-xs text-amber-200/90">
                        <span className="text-slate-500">装備：</span>
                        {characterTier.equipment}
                      </div>
                      <div className="text-sm font-medium text-violet-200">
                        <span className="text-slate-500">称号：</span>
                        {characterTier.displayTitle}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        目標達成度 {questProgressPercent}%
                        {!data.yearGoal.achieved && <>（{characterTier.rank}）</>}
                        {data.yearGoal.achieved && (
                          <span>{"\uff08\u9b54\u738b\u6483\u9000\u30fb\u6700\u7d42\u88c5\u5099\uff09"}</span>
                        )}
                      </div>
                      {!data.yearGoal.achieved &&
                        questsUntilNextTier !== null &&
                        questsUntilNextTier > 0 && (
                        <div className="text-[11px] text-slate-400">
                          {"\u6b21\u306e\u88c5\u5099\u6bb5\u968e\u307e\u3067 \u3042\u3068\u30af\u30a8\u30b9\u30c8\u7d04 "}
                          {questsUntilNextTier}
                          {" \u4ef6"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl bg-white/5 p-4">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-slate-300">レベル</span>
                        <span className="font-semibold text-white">Lv. {player.level}</span>
                      </div>
                      <Progress value={(player.xpInLevel / player.xpNeeded) * 100} className="h-3" />
                      <div className="mt-2 text-xs text-slate-300">
                        次のレベルまで {player.xpNeeded - player.xpInLevel} XP
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-white/5 p-4">
                        <div className="text-sm text-slate-300">総経験値</div>
                        <div className="mt-1 text-2xl font-bold">{player.xp}</div>
                      </div>
                      <div className="rounded-2xl bg-white/5 p-4">
                        <div className="text-sm text-slate-300">ゴールド</div>
                        <div className="mt-1 text-2xl font-bold">{player.gold}</div>
                      </div>
                      <div className="rounded-2xl bg-white/5 p-4">
                        <div className="text-sm text-slate-300">進行中</div>
                        <div className="mt-1 text-2xl font-bold">{activeCount}</div>
                      </div>
                      <div className="rounded-2xl bg-white/5 p-4">
                        <div className="text-sm text-slate-300">達成済み</div>
                        <div className="mt-1 text-2xl font-bold">{completedCount}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 1年後の目標カード */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="overflow-hidden rounded-[28px] border border-amber-400/20 bg-amber-500/5 shadow-2xl backdrop-blur">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/20">
                    <Flag className="h-5 w-5 text-amber-300" />
                  </div>
                  <div>
                    <div className="text-xs text-amber-300/70 font-medium tracking-wide uppercase">1年後の目標</div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <CalendarDays className="h-3 w-3" />
                      {data.yearGoal.deadline}まで
                      {(() => {
                        const days = Math.ceil((new Date(data.yearGoal.deadline).getTime() - Date.now()) / 86400000);
                        return <span className="text-amber-300 font-semibold">（残り{days}日）</span>;
                      })()}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-2xl text-slate-400 hover:bg-white/10 hover:text-white shrink-0"
                  onClick={openGoalDialog}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>

              {data.yearGoal.title ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-bold text-white md:text-3xl">{data.yearGoal.title}</h2>
                    {data.yearGoal.achieved && (
                      <Badge className="rounded-xl bg-emerald-500/25 text-emerald-200 hover:bg-emerald-500/25">
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                        {"\u9b54\u738b\u6483\u9000\u30fb\u76ee\u6a19\u9054\u6210"}
                      </Badge>
                    )}
                  </div>
                  {data.yearGoal.why && (
                    <p className="text-sm leading-6 text-slate-300">
                      <span className="text-amber-300 font-medium">なぜ：</span>{data.yearGoal.why}
                    </p>
                  )}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span>クエスト達成率</span>
                      <span className="text-white font-medium">{questProgressPercent}%</span>
                    </div>
                    <Progress
                      value={data.quests.length > 0 ? (completedCount / data.quests.length) * 100 : 0}
                      className="h-2"
                    />
                  </div>
                  {bossBattleUnlocked && (
                    <div className="pt-2">
                      <Button
                        type="button"
                        className="rounded-2xl border-2 border-rose-500/50 bg-rose-600/80 hover:bg-rose-600"
                        onClick={() => setBossOpen(true)}
                      >
                        <Skull className="mr-2 h-4 w-4" />
                        {"\u9b54\u738b\u57ce\u3078\u2026\uff08\u6700\u7d42\u6c7a\u6226\uff09"}
                      </Button>
                    </div>
                  )}
                  {!data.yearGoal.achieved &&
                    data.quests.length > 0 &&
                    questProgressPercent < BOSS_UNLOCK_PERCENT && (
                      <p className="pt-1 text-xs text-slate-500">
                        {"\u30af\u30a8\u30b9\u30c8\u9054\u6210\u7387\u304c "}
                        {BOSS_UNLOCK_PERCENT}
                        {"% \u4ee5\u4e0a\u3067\u9b54\u738b\u6226\u304c\u89e3\u653e\u3055\u308c\u307e\u3059\u3002"}
                      </p>
                    )}
                </div>
              ) : (
                <button
                  onClick={openGoalDialog}
                  className="w-full rounded-2xl border border-dashed border-amber-400/30 p-6 text-center text-slate-400 hover:border-amber-400/60 hover:text-slate-300 transition-colors"
                >
                  <Plus className="mx-auto mb-2 h-5 w-5" />
                  <div className="text-sm">1年後に達成したい目標を設定する</div>
                </button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* 目標分解ロードマップ */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <Card className="overflow-hidden rounded-[28px] border border-cyan-400/20 bg-cyan-500/5 shadow-2xl backdrop-blur">
            <CardContent className="p-6 md:p-8">
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20">
                    <ListTree className="h-5 w-5 text-cyan-200" />
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-cyan-200/80">ロードマップ</div>
                    <h2 className="mt-0.5 text-lg font-semibold text-white md:text-xl">
                      {ROADMAP_HORIZONS.map((h) => h.short).join(" \u2192 ")}
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      1年目標から期間別のたたき台を自動生成。文言は自由に編集・追加できます。
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    className="rounded-2xl bg-cyan-500 hover:bg-cyan-600"
                    onClick={applyRoadmapSuggestion}
                    disabled={!data.yearGoal.title.trim()}
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
 自動で提案
                  </Button>
                </div>
              </div>

              {!data.yearGoal.title.trim() && (
                <p className="mb-4 rounded-2xl bg-black/25 p-3 text-sm text-slate-400">
                  上の「1年後の目標」でタイトルを保存すると、自動提案が使えるようになります。
                </p>
              )}

              <Tabs value={roadmapTab} onValueChange={(v) => setRoadmapTab(v as RoadmapHorizon)} className="space-y-4">
                <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-2xl bg-white/10 p-1">
                  {ROADMAP_HORIZONS.map(({ key, short }) => (
                    <TabsTrigger
                      key={key}
                      value={key}
                      className="rounded-xl px-3 py-2 text-xs data-[state=active]:bg-white data-[state=active]:text-slate-900 md:text-sm"
                    >
                      {short}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {ROADMAP_HORIZONS.map(({ key, label }) => (
                  <TabsContent key={key} value={key} className="space-y-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-sm text-slate-300">
                        <span className="font-medium text-white">{label}</span>
                        <span className="text-slate-500"> · {data.roadmap[key].length} 件</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10"
                          onClick={() => addRoadmapItem(key)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          行を追加
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10"
                          onClick={() => addHorizonToQuests(key)}
                        >
                          <ListPlus className="mr-2 h-4 w-4" />
                          クエストに追加
                        </Button>
                      </div>
                    </div>

                    {data.roadmap[key].length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-cyan-400/25 p-6 text-center text-sm text-slate-400">
                        まだ行がありません。「自動で提案」か「行を追加」から始められます。
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {data.roadmap[key].map((item) => (
                          <div key={item.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <div className="mb-2 flex items-start justify-between gap-2">
                              <label className="text-xs font-medium text-slate-400">タイトル</label>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0 rounded-xl text-slate-400 hover:bg-white/10 hover:text-white"
                                onClick={() => removeRoadmapItem(key, item.id)}
                                aria-label="この行を削除"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <Textarea
                              value={item.title}
                              onChange={(e) => updateRoadmapItem(key, item.id, { title: e.target.value })}
                              placeholder="この期間で達成したいことを具体的に"
                              className="min-h-[72px] rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                            />
                            <label className="mt-3 block text-xs font-medium text-slate-400">メモ（任意）</label>
                            <Textarea
                              value={item.detail}
                              onChange={(e) => updateRoadmapItem(key, item.id, { detail: e.target.value })}
                              placeholder="完了の定義・数字・次の一手など"
                              className="mt-1 min-h-[64px] rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* 目標編集ダイアログ */}
        <Dialog open={goalOpen} onOpenChange={setGoalOpen}>
          <DialogContent className="rounded-3xl border-slate-200 sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>1年後の目標を設定</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">目標タイトル</label>
                <Input
                  value={goalForm.title}
                  onChange={(e) => setGoalForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="例：チャンネル登録者1万人を達成する"
                  className="rounded-2xl"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">なぜその目標なのか</label>
                <Textarea
                  value={goalForm.why}
                  onChange={(e) => setGoalForm((prev) => ({ ...prev, why: e.target.value }))}
                  placeholder="例：自分の経験を発信して、同じ悩みを持つ人の役に立ちたい"
                  className="min-h-[90px] rounded-2xl"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">期限</label>
                <Input
                  type="date"
                  value={goalForm.deadline}
                  onChange={(e) => setGoalForm((prev) => ({ ...prev, deadline: e.target.value }))}
                  className="rounded-2xl"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setGoalOpen(false)} className="rounded-2xl">
                キャンセル
              </Button>
              <Button onClick={saveGoal} className="rounded-2xl bg-amber-500 hover:bg-amber-600 text-white">
                保存する
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Tabs defaultValue="quests" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-white/10 p-1 md:w-[320px]">
            <TabsTrigger value="quests" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-slate-900">
              <Sword className="mr-2 h-4 w-4" />
              クエスト
            </TabsTrigger>
            <TabsTrigger value="status" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-slate-900">
              <Sparkles className="mr-2 h-4 w-4" />
              ステータス
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quests" className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <Select value={filter} onValueChange={(v) => setFilter(v ?? "all")}>
                <SelectTrigger className="w-full rounded-2xl border-white/10 bg-white/5 text-white md:w-[220px]">
                  <SelectValue placeholder="カテゴリ" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "すべて" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button className="rounded-2xl bg-violet-500 hover:bg-violet-600" onClick={() => setOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                クエスト追加
              </Button>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="rounded-3xl border-slate-200 sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>新しいクエストを作成</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium">クエスト名</label>
                      <Input
                        value={form.title}
                        onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="例：ショート動画のタイトルを5案出す"
                        className="rounded-2xl"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">カテゴリ</label>
                      <Select value={form.category} onValueChange={(value) => setForm((prev) => ({ ...prev, category: value ?? prev.category }))}>
                        <SelectTrigger className="rounded-2xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="YouTube">YouTube</SelectItem>
                          <SelectItem value="分析">分析</SelectItem>
                          <SelectItem value="制作">制作</SelectItem>
                          <SelectItem value="学習">学習</SelectItem>
                          <SelectItem value="健康">健康</SelectItem>
                          <SelectItem value="ロードマップ">ロードマップ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">難易度</label>
                      <Select value={form.difficulty} onValueChange={(value) => setForm((prev) => ({ ...prev, difficulty: value ?? prev.difficulty }))}>
                        <SelectTrigger className="rounded-2xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">かんたん</SelectItem>
                          <SelectItem value="normal">ふつう</SelectItem>
                          <SelectItem value="hard">むずかしい</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium">説明</label>
                      <Textarea
                        value={form.description}
                        onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="例：動画案を5つ出して、そのうち1つを冒頭まで作る"
                        className="min-h-[110px] rounded-2xl"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={createQuest} className="rounded-2xl bg-violet-500 hover:bg-violet-600">
                      作成する
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {filteredQuests.map((quest, index) => (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className="rounded-[26px] border border-white/10 bg-white/5 shadow-xl backdrop-blur">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Badge className="rounded-xl bg-white/10 text-white hover:bg-white/10">{quest.category}</Badge>
                            <span className={`rounded-xl px-2.5 py-1 text-xs font-medium ${difficultyColor(quest.difficulty)}`}>
                              {difficultyLabel(quest.difficulty)}
                            </span>
                            {quest.done && (
                              <Badge className="rounded-xl bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/20">
                                <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> 完了
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-xl font-semibold text-white">{quest.title}</h3>
                          <p className="mt-2 text-sm leading-6 text-slate-300">{quest.description || "説明はまだありません。"}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-2xl text-white hover:bg-white/10 hover:text-white" onClick={() => deleteQuest(quest.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-black/20 p-3">
                          <div className="text-xs text-slate-400">報酬 XP</div>
                          <div className="mt-1 text-lg font-bold text-white">+{quest.xpReward}</div>
                        </div>
                        <div className="rounded-2xl bg-black/20 p-3">
                          <div className="text-xs text-slate-400">報酬 Gold</div>
                          <div className="mt-1 text-lg font-bold text-white">+{quest.goldReward}</div>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-white/5 p-3">
                        <div className="flex items-center gap-3">
                          <Checkbox checked={quest.done} onCheckedChange={() => toggleQuest(quest.id)} />
                          <span className={`text-sm ${quest.done ? "text-slate-400 line-through" : "text-white"}`}>
                            クエスト達成にする
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="status">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="rounded-[26px] border border-white/10 bg-white/5 shadow-xl md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">冒険の進み具合</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.quests.map((quest) => (
                    <div key={quest.id} className="rounded-2xl bg-black/20 p-4">
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <div>
                          <div className="font-medium text-white">{quest.title}</div>
                          <div className="text-sm text-slate-400">{quest.category}</div>
                        </div>
                        <div className="text-sm font-medium text-slate-300">
                          {quest.done ? "達成済み" : "進行中"}
                        </div>
                      </div>
                      <div className="h-3 rounded-full bg-white/10">
                        <div className={`h-3 rounded-full ${quest.done ? "bg-emerald-400" : "bg-violet-400"}`} style={{ width: quest.done ? "100%" : "28%" }} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-[26px] border border-white/10 bg-white/5 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white">称号メモ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm leading-6 text-slate-300">
                  <p>・小さなクエストを積むほど、レベルアップが早くなります。</p>
                  <p>・難しいクエストは報酬が大きいので、ここぞで入れるのがおすすめです。</p>
                  <p>・毎日1つでも達成すると、継続がゲーム感覚で見えやすくなります。</p>
                  <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-200">
                    次に追加すると相性がいい機能：連続達成ボーナス、装備、称号、ボス戦。
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </div>

      <BossBattleDialog
        open={bossOpen}
        onOpenChange={setBossOpen}
        playerName={data.player.name}
        goalTitle={data.yearGoal.title}
        heroTierStep={characterTier.tierStep}
        onVictory={handleBossVictory}
      />
    </div>
  );
}
