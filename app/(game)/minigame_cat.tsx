import React, { useEffect, useState, useRef } from "react";
import {
  SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Animated, Dimensions
} from "react-native";
import { useRouter } from "expo-router";
import { usePetStore } from "@/store/usePetStore";
import { GameColors } from "@/constants/theme";
import TopHUD from "@/components/game/TopHUD";
import EffectsOverlay, { EffectsOverlayRef } from "@/components/game/EffectsOverlay";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = 600;

export default function CatMinigame() {
  const router = useRouter();
  const { winMinigame } = usePetStore();
  
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15); // 15 seconds to catch as many as possible
  const [gameOver, setGameOver] = useState(false);
  
  // Yarn targets
  const [targets, setTargets] = useState<{ id: string; x: number; y: number }[]>([]);
  
  const effectsRef = useRef<EffectsOverlayRef>(null);
  const timerId = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnerId = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (gameOver) return;

    timerId.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    spawnerId.current = setInterval(() => {
      setTargets((prev) => {
        if (prev.length >= 5) return prev; // Max 5 on screen
        const newTarget = {
          id: Math.random().toString(),
          x: 40 + Math.random() * (SCREEN_WIDTH - 120),
          y: 80 + Math.random() * (SCREEN_HEIGHT - 200),
        };
        return [...prev, newTarget];
      });
    }, 800);

    return () => {
      if (timerId.current) clearInterval(timerId.current);
      if (spawnerId.current) clearInterval(spawnerId.current);
    };
  }, [gameOver]);

  const handleCatch = (id: string, x: number, y: number) => {
    if (gameOver) return;
    effectsRef.current?.triggerEffect("sparkle", x, y);
    setScore((s) => s + 1);
    setTargets((prev) => prev.filter((t) => t.id !== id));
  };

  const restart = () => {
    setScore(0);
    setTimeLeft(15);
    setGameOver(false);
    setTargets([]);
  };

  const handleFinish = () => {
    if (score >= 5) winMinigame(); // En az 5 puanda kazandır
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TopHUD />
      <EffectsOverlay ref={effectsRef} />
      
      <View style={styles.header}>
        <Text style={styles.scoreText}>Skor: {score}</Text>
        <Text style={styles.timeText}>Süre: {timeLeft}s</Text>
      </View>

      <View style={styles.gameArea}>
        {!gameOver && targets.map((t) => (
          <TouchableOpacity
            key={t.id}
            activeOpacity={0.5}
            style={[styles.target, { left: t.x, top: t.y }]}
            onPress={() => handleCatch(t.id, t.x, t.y)}
          >
            <Text style={styles.emoji}>🧶</Text>
          </TouchableOpacity>
        ))}

        {gameOver && (
          <View style={styles.gameOverPanel}>
            <Text style={styles.gameOverText}>Süre Doldu!</Text>
            <Text style={styles.finalScore}>Skorun: {score}</Text>
            <TouchableOpacity style={styles.btn} onPress={restart}>
              <Text style={styles.btnText}>Tekrar Oyna</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={handleFinish}>
              <Text style={styles.btnText}>Bitir</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#E1BEE7" }, // Soft purple
  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreText: { fontSize: 24, fontWeight: "900", color: "#4A148C" },
  timeText: { fontSize: 24, fontWeight: "900", color: "#E53935" },
  gameArea: {
    flex: 1,
    position: "relative",
  },
  target: {
    position: "absolute",
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 30,
  },
  emoji: { fontSize: 40 },
  gameOverPanel: {
    position: "absolute",
    top: "30%",
    left: 40,
    right: 40,
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 32,
    borderRadius: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  gameOverText: { fontSize: 32, fontWeight: "800", color: "#E53935", marginBottom: 8 },
  finalScore: { fontSize: 24, fontWeight: "700", color: "#333", marginBottom: 24 },
  btn: {
    backgroundColor: GameColors.playBtn,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  btnSecondary: { backgroundColor: GameColors.shopBtn },
  btnText: { color: "#FFF", fontSize: 18, fontWeight: "800" },
});
