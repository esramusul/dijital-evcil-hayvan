import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { GameColors } from "@/constants/theme";

interface NeedSegmentProps {
  emoji: string;
  value: number; // 0-100
  color: string;
}

export default function CircularNeeds({ needs }: { needs: NeedSegmentProps[] }) {
  // Basit dairesel pozisyonlama: 5 elementi yarıçap etrafına diziyoruz
  const radius = 120;
  const angleStep = (Math.PI * 2) / needs.length;
  // -PI/2 offset ile en üstten başlatıyoruz
  const startAngle = -Math.PI / 2;

  return (
    <View style={styles.container}>
      {needs.map((need, index) => {
        const angle = startAngle + index * angleStep;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        const isWarning = need.value <= 30;
        const barColor = isWarning ? GameColors.barWarning : need.color;

        return (
          <View
            key={index}
            style={[styles.needBubble, { transform: [{ translateX: x }, { translateY: y }] }]}
          >
            <View style={[styles.progressRing, { borderColor: barColor }]} />
            <Text style={styles.emoji}>{need.emoji}</Text>
            {isWarning && <View style={styles.warningDot} />}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  needBubble: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  progressRing: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 4,
    opacity: 0.8,
  },
  emoji: {
    fontSize: 26,
  },
  warningDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: GameColors.barWarning,
    borderWidth: 2,
    borderColor: "#FFF",
  },
});
