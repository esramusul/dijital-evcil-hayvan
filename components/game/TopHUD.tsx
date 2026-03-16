import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { usePetStore } from "@/store/usePetStore";
import { GameColors } from "@/constants/theme";
import { LEVEL_XP_THRESHOLDS, MAX_LEVEL } from "@/constants/game";

export default function TopHUD() {
  const { level, xp, coins } = usePetStore();

  const currentLevelXp = LEVEL_XP_THRESHOLDS[level] ?? 0;
  const nextLevelXp    = LEVEL_XP_THRESHOLDS[Math.min(level + 1, MAX_LEVEL)] ?? xp;
  const progress       = level >= MAX_LEVEL
    ? 1
    : (xp - currentLevelXp) / (nextLevelXp - currentLevelXp);

  return (
    <View style={styles.container}>
      {/* Level dairesi */}
      <View style={styles.levelCircle}>
        <Text style={styles.levelNumber}>{level}</Text>
        {/* Basit progress yay — doluluk göstergesi */}
        <View style={[styles.levelArc, { width: `${Math.round(progress * 100)}%` as any }]} />
      </View>

      {/* Orta: XP + Coin */}
      <View style={styles.center}>
        <View style={styles.badge}>
          <Text style={styles.badgeEmoji}>💎</Text>
          <Text style={styles.badgeText}>{xp}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeEmoji}>🪙</Text>
          <Text style={styles.badgeText}>{coins}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "space-between",
    paddingHorizontal: 16,
    paddingVertical:   10,
    backgroundColor:   GameColors.hudBg,
  },
  levelCircle: {
    width:           52,
    height:          52,
    borderRadius:    26,
    borderWidth:     4,
    borderColor:     GameColors.levelRing,
    justifyContent:  "center",
    alignItems:      "center",
    overflow:        "hidden",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  levelArc: {
    position:   "absolute",
    bottom:     0,
    left:       0,
    height:     4,
    backgroundColor: GameColors.levelRing,
  },
  levelNumber: {
    color:      "#FFF",
    fontSize:   20,
    fontWeight: "800",
  },
  center: {
    flexDirection: "row",
    gap:           10,
  },
  badge: {
    flexDirection:   "row",
    alignItems:      "center",
    gap:             4,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius:    20,
    paddingHorizontal: 10,
    paddingVertical:    4,
  },
  badgeEmoji: { fontSize: 16 },
  badgeText:  { color: "#FFF", fontWeight: "700", fontSize: 14 },
});
