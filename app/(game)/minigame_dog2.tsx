import React, { useEffect, useState, useRef } from "react";
import {
  SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Animated, Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { usePetStore } from "@/store/usePetStore";
import { GameColors } from "@/constants/theme";
import TopHUD from "@/components/game/TopHUD";
import EffectsOverlay, { EffectsOverlayRef } from "@/components/game/EffectsOverlay";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = 580;
const BALL_SIZE = 64;

export default function DogBallMinigame() {
  const router = useRouter();
  const { winMinigame } = usePetStore();

  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const [balls, setBalls] = useState<{ id: string; fromLeft: boolean; y: number; xAnim: Animated.Value }[]>([]);

  const effectsRef = useRef<EffectsOverlayRef>(null);
  const spawnerId = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (gameOver) return;

    spawnerId.current = setInterval(() => {
      const fromLeft = Math.random() > 0.5;
      const y = 80 + Math.random() * (SCREEN_HEIGHT - 220);
      const startX = fromLeft ? -BALL_SIZE : SCREEN_WIDTH + BALL_SIZE;
      const endX = fromLeft ? SCREEN_WIDTH + BALL_SIZE : -BALL_SIZE;
      const xAnim = new Animated.Value(startX);
      const id = Math.random().toString();

      setBalls((prev) => [...prev, { id, fromLeft, y, xAnim }]);

      Animated.timing(xAnim, {
        toValue: endX,
        duration: 1600 + Math.random() * 600,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          setMissed((m) => m + 1);
          setBalls((prev) => prev.filter((b) => b.id !== id));
        }
      });
    }, 1400);

    return () => {
      if (spawnerId.current) clearInterval(spawnerId.current);
    };
  }, [gameOver]);

  useEffect(() => {
    if (missed >= 4) setGameOver(true);
  }, [missed]);

  const handleCatch = (id: string, y: number) => {
    if (gameOver) return;
    effectsRef.current?.triggerEffect("sparkle", SCREEN_WIDTH / 2, y);
    setScore((s) => s + 1);
    setBalls((prev) => prev.filter((b) => b.id !== id));
  };

  const restart = () => {
    setScore(0);
    setMissed(0);
    setGameOver(false);
    setBalls([]);
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
        <Text style={styles.missedText}>Kaçan: {missed} / 4</Text>
      </View>

      <View style={styles.gameArea}>
        {!gameOver && balls.map((ball) => (
          <Animated.View
            key={ball.id}
            style={[styles.ballContainer, { left: ball.xAnim, top: ball.y }]}
          >
            <TouchableOpacity activeOpacity={0.7} onPress={() => handleCatch(ball.id, ball.y)}>
              <Text style={styles.emoji}>🎾</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}

        {!gameOver && (
          <Text style={styles.hint}>🐶 Uçan topları yakala!</Text>
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
  safe: { flex: 1, backgroundColor: "#A5D6A7" },
  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreText: { fontSize: 24, fontWeight: "900", color: "#1B5E20" },
  missedText: { fontSize: 24, fontWeight: "900", color: "#E53935" },
  gameArea: { flex: 1, position: "relative", overflow: "hidden" },
  ballContainer: {
    position: "absolute",
    width: BALL_SIZE,
    height: BALL_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: { fontSize: 48 },
  hint: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    color: "rgba(0,0,0,0.3)",
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
