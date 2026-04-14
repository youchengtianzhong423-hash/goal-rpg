/**
 * \u30af\u30a8\u30b9\u30c8\u9054\u6210\u7387\uff080\u2013100\uff09\u306b\u5fdc\u3058\u305f\u6bb5\u968e\u3002
 * Portrait: public/characters/tier-{0|10|...|100}.png
 */

export type CharacterTierView = {
  bucket: number;
  /** \u6bb5\u968e\u540d\uff08\u8868\u306b\u51fa\u3059\u524d\u63d0\u306e\u7a4d\u307f\u4e0a\u3052\u7528\uff09 */
  rank: string;
  /** \u88c5\u5099\u306e\u898b\u305f\u76ee\u30e9\u30d9\u30eb */
  equipment: string;
  /** \u8868\u793a\u7528\u79f0\u53f7\uff08\u9b54\u738b\u6483\u9000\u5f8c\u306f\u5225\u540d\u7fa9\uff09 */
  displayTitle: string;
  portraitSrc: string;
  /** 0\u201310 \u30d4\u30af\u30bb\u30eb\u52c7\u8005\u306e\u8272\u5909\u66f4\u7528 */
  tierStep: number;
};

const TIERS: Record<number, { rank: string; equipment: string }> = {
  0: {
    rank: "\u6751\u4eba",
    equipment: "\u6728\u306e\u679d\u30fb\u9ebb\u306e\u8863",
  },
  10: {
    rank: "\u898b\u7fd2\u3044\u5192\u967a\u8005",
    equipment: "\u7df4\u7fd2\u7528\u77ed\u5263\u30fb\u9769\u30a8\u30d7\u30ed\u30f3",
  },
  20: {
    rank: "\u65c5\u306e\u6226\u58eb",
    equipment: "\u65c5\u88c5\u306e\u7247\u624b\u5263\u30fb\u65c5\u4eba\u306e\u30de\u30f3\u30c8",
  },
  30: {
    rank: "\u99c6\u3051\u51fa\u3057\u52c7\u8005",
    equipment: "\u9285\u306e\u5263\u30fb\u8efd\u9769\u306e\u93a7",
  },
  40: {
    rank: "\u719f\u7df4\u306e\u6226\u58eb",
    equipment: "\u92fc\u306e\u5927\u5263\u30fb\u6226\u58eb\u306e\u93a7",
  },
  50: {
    rank: "\u738b\u56fd\u9a0e\u58eb",
    equipment: "\u738b\u56fd\u9a0e\u58eb\u306e\u5263\u30fb\u9a0e\u58eb\u56e3\u306e\u7532\u5191",
  },
  60: {
    rank: "\u9ec4\u91d1\u306e\u52c7\u8005",
    equipment: "\u9ec4\u91d1\u306e\u5263\u30fb\u592a\u967d\u6587\u69d8\u306e\u93a7",
  },
  70: {
    rank: "\u8056\u9a0e\u58eb",
    equipment: "\u8056\u9280\u306e\u69cd\u30fb\u767d\u9a0e\u58eb\u306e\u93a7",
  },
  80: {
    rank: "\u4f1d\u8aac\u306e\u52c7\u8005",
    equipment: "\u30d7\u30e9\u30c1\u30ca\u306e\u5263\u30fb\u767d\u91d1\u306e\u7532\u5191",
  },
  90: {
    rank: "\u7adc\u3092\u7834\u304f\u8005",
    equipment: "\u7adc\u6bba\u3057\u306e\u5927\u5263\u30fb\u7adc\u9c57\u306e\u93a7",
  },
  100: {
    rank: "\u795e\u306b\u9078\u3070\u308c\u3057\u52c7\u8005",
    equipment: "\u795e\u306e\u8863",
  },
};

const BOSS_SLAYER_TITLE = "\u9b54\u738b\u3092\u8a0e\u3061\u3057\u8005";

export function getCharacterTier(questProgressPercent: number, goalAchieved: boolean): CharacterTierView {
  const p = Math.max(0, Math.min(100, Math.round(questProgressPercent)));
  const bucket = p >= 100 ? 100 : Math.floor(p / 10) * 10;
  const row = TIERS[bucket];
  const visualBucket = goalAchieved ? 100 : bucket;
  const visual = TIERS[visualBucket];
  const displayTitle = goalAchieved ? BOSS_SLAYER_TITLE : row.rank;
  return {
    bucket,
    rank: row.rank,
    equipment: visual.equipment,
    displayTitle,
    portraitSrc: `/characters/tier-${visualBucket}.png`,
    tierStep: visualBucket / 10,
  };
}

export function nextTierBucket(current: number): number | null {
  if (current >= 100) return null;
  return current + 10;
}

/*
 * Portrait file mapping (replace tier-*.png in public/characters anytime):
 * 0%   \u6751\u4eba / villager, unarmed
 * 10%  leather, wood buckler
 * 20%  traveler, iron sword + wood shield
 * 30%  scarf + standard kit
 * 40%  full steel plate
 * 50%  plate + gold trim
 * 60%  gold ornate shield (\u9ec4\u91d1)
 * 70%  cape, regal knight (\u8056\u9a0e\u58eb)
 * 80%  white/platinum (\u4f1d\u8aac / platinum)
 * 90%  crystal sword (\u7adc\u3092\u7834\u304f)
 * 100% white-gold divine robe (\u795e\u306e\u8863)
 */
