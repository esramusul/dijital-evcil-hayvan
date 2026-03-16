// ─── Durum sınırları ──────────────────────────────────────────────────────────
export const MAX_STAT = 100;
export const MIN_STAT = 0;

// ─── İhtiyaç bozunması (saniye başına düşüş) ─────────────────────────────────
export const NEED_DECAY_INTERVAL_MS = 30_000; // 30 saniyede bir
export const NEED_DECAY_AMOUNT      = 5;       // her tick'te 5 puan düşer

// ─── Aksiyon etkileri ─────────────────────────────────────────────────────────
export const FEED_HUNGER_FILL       = 30;
export const FEED_TOILET_INCREASE   = 10; // yemek yedikten sonra tuvalet ihtiyacı artar
export const PLAY_HAPPINESS_FILL    = 25;
export const PLAY_ENERGY_DECREASE   = 15;
export const BATHE_CLEANLINESS_FILL = 40;
export const TOILET_NEED_REDUCE     = 50;
export const SLEEP_ENERGY_FILL      = 60;

// ─── XP & Level ───────────────────────────────────────────────────────────────
export const XP_PER_FEED   = 5;
export const XP_PER_PLAY   = 8;
export const XP_PER_BATHE  = 4;
export const XP_PER_TOILET = 3;
export const XP_PER_SLEEP  = 6;

// Her level için gereken toplam XP (index = level)
export const LEVEL_XP_THRESHOLDS = [0, 50, 120, 220, 350, 520, 730, 990, 1300, 1700, 2200];
export const MAX_LEVEL = LEVEL_XP_THRESHOLDS.length - 1;

// ─── Coin ────────────────────────────────────────────────────────────────────
export const COINS_PER_MINIGAME = 10;
export const XP_PER_MINIGAME    = 15;

// ─── Mini oyun süresi ─────────────────────────────────────────────────────────
export const MINIGAME_DURATION_MS = 20_000; // 20 saniye

// ─── İhtiyaç uyarı eşikleri ───────────────────────────────────────────────────
export const NEED_WARNING_THRESHOLD  = 30; // kırmızıya dönüş
export const NEED_CRITICAL_THRESHOLD = 15; // titreme animasyonu

export const SPECIES_EMOJI: Record<string, string> = {
  "Kuş":       "🐦",
  "Kedi":      "🐱",
  "Köpek":     "🐶",
  "Tavşan":    "🐰",
  "Balık":     "🐟",
  "Hamster":   "🐹",
  "Kaplumbağa":"🐢",
};

export const SPECIES_IMAGES: Record<string, any> = {
  "Kuş":   require("@/assets/images/pets/bird.png"),
  "Kedi":  require("@/assets/images/pets/cat.png"),
  "Köpek": require("@/assets/images/pets/dog.png"),
};
