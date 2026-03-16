/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// ─── Oyun Renk Paleti ─────────────────────────────────────────────────────────
export const GameColors = {
  // Oda arka planları
  room:     "#C8E6C9",
  kitchen:  "#FFE0B2",
  bathroom: "#B3E5FC",
  toilet:   "#E1BEE7",
  games:    "#F3E5F5",

  // Butonlar
  feedBtn:    "#FF7043",
  playBtn:    "#42A5F5",
  bathBtn:    "#26C6DA",
  toiletBtn:  "#AB47BC",
  sleepBtn:   "#5C6BC0",
  shopBtn:    "#78909C",

  // İhtiyaç barları
  barHunger:      "#FF7043",
  barHappiness:   "#FFCA28",
  barCleanliness: "#26C6DA",
  barEnergy:      "#66BB6A",
  barToilet:      "#AB47BC",
  barWarning:     "#EF5350",
  barBg:          "#E0E0E0",

  // HUD
  hudBg:      "rgba(0,0,0,0.35)",
  levelRing:  "#69F0AE",
  coinGold:   "#FFC107",
  xpBlue:     "#40C4FF",

  // Kart
  cardBg:     "#FFFFFF",
  cardShadow: "#00000033",
};
