import { Audio } from "expo-av";

// Ses Nesneleri Cache
const soundCache: Record<string, Audio.Sound> = {};

// Yüklemesi beklenen ses kaynakları
const SOUND_FILES: Record<string, any> = {
  eat: require("@/assets/sounds/eat.wav"),
  full: require("@/assets/sounds/full.wav"),
  play: require("@/assets/sounds/play.wav"),
  bath: require("@/assets/sounds/bath.wav"),
  flush: require("@/assets/sounds/flush.wav"),
  sleep: require("@/assets/sounds/sleep.wav"),
  wake: require("@/assets/sounds/wake.wav"),
  levelup: require("@/assets/sounds/levelup.wav"),
  grow: require("@/assets/sounds/grow.wav"),
};

export async function preloadSounds() {
  for (const [key, req] of Object.entries(SOUND_FILES)) {
    try {
      const { sound } = await Audio.Sound.createAsync(req);
      soundCache[key] = sound;
    } catch (err) {
      console.error(`Ses yüklenemedi: ${key}`, err);
    }
  }
}

export async function playSound(key: keyof typeof SOUND_FILES) {
  const sound = soundCache[key];
  if (sound) {
    try {
      // Yeniden baştan çalmak için zamanı 0'la
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch (err) {
      console.error(`Ses oynatılamadı: ${key}`, err);
    }
  }
}
