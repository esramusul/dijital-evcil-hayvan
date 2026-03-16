import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { usePetStore } from "@/store/usePetStore";
import { GameColors } from "@/constants/theme";
import TopHUD from "@/components/game/TopHUD";
import EffectsOverlay, { EffectsOverlayRef } from "@/components/game/EffectsOverlay";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = 580;
const LASER_SIZE = 60;
const DOT_SHOW_MS = 900; // dot disappears after this
const SPAWN_INTERVAL_MS = 1200;

export default function CatLaserMinigame() {
  const router = useRouter();
  const { winMinigame } = usePetStore();

  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [dot, setDot] = useState<{ id: number; x: number; y: number } | null>(null);

  const effectsRef = useRef<EffectsOverlayRef>(null);
  const dotTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spawnTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const dotId = useRef(0);

  const clearDotTimer = () => {
    if (dotTimer.current) clearTimeout(dotTimer.current);
  };

  const spawnDot = useCallback(() => {
    const x = 20 + Math.random() * (SCREEN_WIDTH - LASER_SIZE - 20);
    const y = 60 + Math.random() * (SCREEN_HEIGHT - 180);
    const id = ++dotId.current;
    setDot({ id, x, y });

    clearDotTimer();
    dotTimer.current = setTimeout(() => {
      setDot((prev) => {
        if (prev?.id === id) {
          setMissed((m) => m + 1);
          return null;
        }
        return prev;
      });
    }, DOT_SHOW_MS);
  }, []);

  useEffect(() => {
    if (gameOver) return;
    spawnTimer.current = setInterval(spawnDot, SPAWN_INTERVAL_MS);
    return () => {
      if (spawnTimer.current) clearInterval(spawnTimer.current);
      clearDotTimer();
    };
  }, [gameOver, spawnDot]);

  useEffect(() => {
    if (missed >= 5) setGameOver(true);
  }, [missed]);

  const handleCatch = (id: number, x: number, y: number) => {
    if (gameOver) return;
    if (dot?.id !== id) return;
    clearDotTimer();
    setDot(null);
    effectsRef.current?.triggerEffect("sparkle", x + LASER_SIZE / 2, y + LASER_SIZE / 2);
    setScore((s) => s + 1);
  };

  const restart = () => {
    setScore(0);
    setMissed(0);
    setGameOver(false);
    setDot(null);
  };

  const handleFinish = () => {
    if (score >= 5) winMinigame();
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TopHUD />
      <EffectsOverlay ref={effectsRef} />

      <View style={styles.header}>
        <Text style={styles.scoreText}>Skor: {score}</Text>
        <Text style={styles.missedText}>Kaçan: {missed} / 5</Text>
      </View>

      <View style={styles.gameArea}>
        {!gameOver && dot && (
          <TouchableOpacity
            key={dot.id}
            activeOpacity={0.7}
            style={[styles.laser, { left: dot.x, top: dot.y }]}
            onPress={() => handleCatch(dot.id, dot.x, dot.y)}
          >
            <Text style={styles.laserEmoji}>🔴</Text>
          </TouchableOpacity>
        )}

        {!gameOver && (
          <Text style={styles.hint}>🐱 Lazer noktasını yakala!</Text>
        )}

        {gameOver && (
          <View style={styles.gameOverPanel}>
            <Text style={styles.gameOverText}>Oyun Bitti!</Text>
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
  safe: { flex: 1, backgroundColor: "#3E1F5C" },
  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreText: { fontSize: 24, fontWeight: "900", color: "#E1BEE7" },
  missedText: { fontSize: 24, fontWeight: "900", color: "#FF6090" },
  gameArea: { flex: 1, position: "relative" },
  laser: {
    position: "absolute",
    width: LASER_SIZE,
    height: LASER_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  laserEmoji: { fontSize: 48 },
  hint: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    color: "rgba(255,255,255,0.4)",
    fontSize: 16,
  },
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
