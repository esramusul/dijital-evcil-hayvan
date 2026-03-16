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
const CARROT_SIZE = 56;
const FALL_SPEED = 2000;

export default function RabbitCarrotMinigame() {
  const router = useRouter();
  const { winMinigame } = usePetStore();

  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const [carrots, setCarrots] = useState<{ id: string; x: number; yAnim: Animated.Value }[]>([]);

  const effectsRef = useRef<EffectsOverlayRef>(null);
  const spawnerId = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (gameOver) return;

    spawnerId.current = setInterval(() => {
      const x = 20 + Math.random() * (SCREEN_WIDTH - CARROT_SIZE - 20);
      const yAnim = new Animated.Value(-CARROT_SIZE);
      const id = Math.random().toString();

      setCarrots((prev) => [...prev, { id, x, yAnim }]);

      Animated.timing(yAnim, {
        toValue: SCREEN_HEIGHT + CARROT_SIZE,
        duration: FALL_SPEED + Math.random() * 500,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          setMissed((m) => m + 1);
          setCarrots((prev) => prev.filter((c) => c.id !== id));
        }
      });
    }, 1100);

    return () => {
      if (spawnerId.current) clearInterval(spawnerId.current);
    };
  }, [gameOver]);

  useEffect(() => {
    if (missed >= 4) setGameOver(true);
  }, [missed]);

  const handleCatch = (id: string, x: number) => {
    if (gameOver) return;
    effectsRef.current?.triggerEffect("heart", x + CARROT_SIZE / 2, 200);
    setScore((s) => s + 1);
    setCarrots((prev) => prev.filter((c) => c.id !== id));
  };

  const restart = () => {
    setScore(0);
    setMissed(0);
    setGameOver(false);
    setCarrots([]);
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
        {!gameOver && carrots.map((carrot) => (
          <Animated.View
            key={carrot.id}
            style={[styles.carrotContainer, { left: carrot.x, top: carrot.yAnim }]}
          >
            <TouchableOpacity activeOpacity={0.7} onPress={() => handleCatch(carrot.id, carrot.x)}>
              <Text style={styles.emoji}>🥕</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}

        {!gameOver && (
          <Text style={styles.hint}>🐰 Düşen havuçları yakala!</Text>
        )}

        {gameOver && (
          <View style={styles.gameOverPanel}>
            <Text style={styles.gameOverText}>Çok Kaçırdın!</Text>
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
  safe: { flex: 1, backgroundColor: "#F1F8E9" },
  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreText: { fontSize: 24, fontWeight: "900", color: "#33691E" },
  missedText: { fontSize: 24, fontWeight: "900", color: "#E53935" },
  gameArea: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  carrotContainer: {
    position: "absolute",
    width: CARROT_SIZE,
    height: CARROT_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: { fontSize: 44 },
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
