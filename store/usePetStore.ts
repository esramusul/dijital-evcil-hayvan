import { create } from "zustand";
import {
  MAX_STAT, MIN_STAT,
  FEED_HUNGER_FILL, FEED_TOILET_INCREASE,
  PLAY_HAPPINESS_FILL, PLAY_ENERGY_DECREASE,
  BATHE_CLEANLINESS_FILL,
  TOILET_NEED_REDUCE,
  SLEEP_ENERGY_FILL,
  XP_PER_FEED, XP_PER_PLAY, XP_PER_BATHE, XP_PER_TOILET, XP_PER_SLEEP,
  XP_PER_MINIGAME, COINS_PER_MINIGAME,
  LEVEL_XP_THRESHOLDS, MAX_LEVEL,
  NEED_DECAY_AMOUNT, NEED_DECAY_INTERVAL_MS,
} from "@/constants/game";
import { playSound } from "@/utils/audio";

// ─── Yardımcılar ──────────────────────────────────────────────────────────────
const clamp = (v: number) => Math.min(MAX_STAT, Math.max(MIN_STAT, v));

function calcLevel(xp: number): number {
  let lvl = 0;
  for (let i = 1; i <= MAX_LEVEL; i++) {
    if (xp >= LEVEL_XP_THRESHOLDS[i]) lvl = i;
    else break;
  }
  return lvl;
}

// ─── Tipler ───────────────────────────────────────────────────────────────────
export type PetSpecies = "Kuş" | "Kedi" | "Köpek" | "Tavşan";

interface PetState {
  // İhtiyaçlar (0–100, yüksek = iyi)
  hunger:      number; // düşük = aç
  happiness:   number;
  cleanliness: number;
  energy:      number;
  toilet:      number; // yüksek = tuvalet ihtiyacı var

  // İlerleme
  xp:    number;
  level: number;
  coins: number;

  // Hayvan
  selectedPet: PetSpecies;
  petName: string;
  hasConfigured: boolean;
  justLeveledUp: boolean;

  // Aksiyonlar
  setupPet:   (species: PetSpecies, name: string) => void;
  resetPet:   () => void;
  feed:       () => void;
  play:       () => void;
  bathe:      () => void;
  useToilet:  () => void;
  sleep:      () => void;
  winMinigame:() => void;
  decayNeeds: () => void;
  dismissLevelUp: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const usePetStore = create<PetState>((set) => {
  // Otomatik bozunma interval'ini store oluşturulduğunda başlat
  setInterval(() => {
    usePetStore.getState().decayNeeds();
  }, NEED_DECAY_INTERVAL_MS);

  return {
    hunger:      30,
    happiness:   30,
    cleanliness: 40,
    energy:      30,
    toilet:      80,
    xp:          0,
    level:       0,
    coins:       0,
    selectedPet: "Kuş",
    petName:     "İsimsiz",
    hasConfigured: false,
    justLeveledUp: false,

    setupPet: (species, name) =>
      set({
        selectedPet: species,
        petName: name,
        hasConfigured: true,
        // Yeni hayvan seçildiğinde istatistikleri sıfırla
        hunger:      30,
        happiness:   30,
        cleanliness: 40,
        energy:      30,
        toilet:      80,
        xp:          0,
        level:       0,
        coins:       0,
        justLeveledUp: false,
      }),

    resetPet: () =>
      set({
        hasConfigured: false,
      }),

    feed: () =>
      set((s) => {
        const newXp    = s.xp + XP_PER_FEED;
        const newLevel = calcLevel(newXp);
        if (newLevel > s.level) playSound("levelup");
        return {
          hunger:      clamp(s.hunger + FEED_HUNGER_FILL),
          toilet:      clamp(s.toilet + FEED_TOILET_INCREASE),
          xp:          newXp,
          level:       newLevel,
          justLeveledUp: newLevel > s.level,
        };
      }),

    play: () =>
      set((s) => {
        const newXp    = s.xp + XP_PER_PLAY;
        const newLevel = calcLevel(newXp);
        if (newLevel > s.level) playSound("levelup");
        return {
          happiness: clamp(s.happiness + PLAY_HAPPINESS_FILL),
          energy:    clamp(s.energy - PLAY_ENERGY_DECREASE),
          xp:        newXp,
          level:     newLevel,
          justLeveledUp: newLevel > s.level,
        };
      }),

    bathe: () =>
      set((s) => {
        const newXp    = s.xp + XP_PER_BATHE;
        const newLevel = calcLevel(newXp);
        if (newLevel > s.level) playSound("levelup");
        return {
          cleanliness: clamp(s.cleanliness + BATHE_CLEANLINESS_FILL),
          xp:          newXp,
          level:       newLevel,
          justLeveledUp: newLevel > s.level,
        };
      }),

    useToilet: () =>
      set((s) => {
        const newXp    = s.xp + XP_PER_TOILET;
        const newLevel = calcLevel(newXp);
        if (newLevel > s.level) playSound("levelup");
        return {
          toilet:   clamp(s.toilet - TOILET_NEED_REDUCE),
          xp:       newXp,
          level:    newLevel,
          justLeveledUp: newLevel > s.level,
        };
      }),

    sleep: () =>
      set((s) => {
        const newXp    = s.xp + XP_PER_SLEEP;
        const newLevel = calcLevel(newXp);
        if (newLevel > s.level) playSound("levelup");
        return {
          energy: clamp(s.energy + SLEEP_ENERGY_FILL),
          xp:     newXp,
          level:  newLevel,
          justLeveledUp: newLevel > s.level,
        };
      }),

    winMinigame: () =>
      set((s) => {
        const newXp    = s.xp + XP_PER_MINIGAME;
        const newLevel = calcLevel(newXp);
        playSound("play");
        if (newLevel > s.level) playSound("levelup");
        return {
          coins:    s.coins + COINS_PER_MINIGAME,
          xp:       newXp,
          level:    newLevel,
          happiness: clamp(s.happiness + 10),
          justLeveledUp: newLevel > s.level,
        };
      }),

    decayNeeds: () =>
      set((s) => ({
        hunger:      clamp(s.hunger - NEED_DECAY_AMOUNT),
        happiness:   clamp(s.happiness - NEED_DECAY_AMOUNT),
        cleanliness: clamp(s.cleanliness - NEED_DECAY_AMOUNT),
        energy:      clamp(s.energy - NEED_DECAY_AMOUNT),
      })),

    dismissLevelUp: () => set({ justLeveledUp: false }),
  };
});
