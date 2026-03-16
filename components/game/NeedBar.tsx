import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { GameColors } from "@/constants/theme";
import { NEED_WARNING_THRESHOLD } from "@/constants/game";

interface NeedBarProps {
  emoji:  string;
  label:  string;
  value:  number; // 0–100
  color:  string;
}

export default function NeedBar({ emoji, label, value, color }: NeedBarProps) {
  const isWarning = value <= NEED_WARNING_THRESHOLD;
  const barColor  = isWarning ? GameColors.barWarning : color;

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <View style={styles.right}>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${value}%` as any, backgroundColor: barColor }]} />
        </View>
        <Text style={[styles.percent, isWarning && styles.percentWarning]}>
          {value}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           8,
    marginVertical: 3,
  },
  emoji: { fontSize: 20, width: 28, textAlign: "center" },
  right: {
    flex:          1,
    flexDirection: "row",
    alignItems:    "center",
    gap:           6,
  },
  barTrack: {
    flex:            1,
    height:          12,
    backgroundColor: GameColors.barBg,
    borderRadius:    6,
    overflow:        "hidden",
  },
  barFill: {
    height:       12,
    borderRadius: 6,
  },
  percent: {
    fontSize:   11,
    color:      "#555",
    width:      32,
    textAlign:  "right",
    fontWeight: "600",
  },
  percentWarning: { color: GameColors.barWarning },
});
