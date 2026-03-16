import React, { useEffect, useState, useRef } from "react";
import {
  SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Animated, Dimensions, PanResponder,
} from "react-native";
import { useRouter } from "expo-router";
import { usePetStore } from "@/store/usePetStore";
import { GameColors } from "@/constants/theme";
import TopHUD from "@/components/game/TopHUD";
import EffectsOverlay, { EffectsOverlayRef } from "@/components/game/EffectsOverlay";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = 580;
const BIRD_SIZE = 60;
const SEED_SIZE = 48;

export default function BirdSeedMinigame() {
  const router = useRouter();
  const { winMinigame } = usePetStore();

  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [birdX, setBirdX] = useState(SCREEN_WIDTH / 2 - BIRD_SIZE / 2);
  const [seeds, setSeeds] = useState<{ id: string; x: number; yAnim: Animated.Value }[]>([]);

  const effectsRef = useRef<EffectsOverlayRef>(null);
  const spawnerId = useRef<ReturnType<typeof setInterval> | null>(null);
  const birdXRef = useRef(birdX);

  useEffect(() => {
    birdXRef.current = birdX;
  }, [birdX]);

  // Pan responder for bird movement
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        const newX = Math.max(0, Math.min(SCREEN_WIDTH - BIRD_SIZE, gesture.moveX - BIRD_SIZE / 2));
        setBirdX(newX);
      },
    })
  ).current;

  useEffect(() => {
    if (gameOver) return;

    spawnerId.current = setInterval(() => {
      const x = 20 + Math.random() * (SCREEN_WIDTH - SEED_SIZE - 20);
      const yAnim = new Animated.Value(-SEED_SIZE);
      const id = Math.random().toString();

      setSeeds((prev) => [...prev, { id, x, yAnim }]);

      Animated.timing(yAnim, {
        toValue: SCREEN_HEIGHT - 100,
        duration: 2200,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          // Check if bird is below the seed
          const birdLeft = birdXRef.current;
          const birdRight = birdLeft + BIRD_SIZE;
          const seedLeft = x;
          const seedRight = x + SEED_SIZE;

          if (seedRight >= birdLeft && seedLeft <= birdRight) {
            // caught!
            effectsRef.current?.triggerEffect("sparkle", x + SEED_SIZE / 2, SCREEN_HEIGHT - 120);
            setScore((s) => s + 1);
          } else {
            setMissed((m) => m + 1);
          }
          setSeeds((prev) => prev.filter((s) => s.id !== id));
        }
      });
    }, 1000);

    return () => {
      if (spawnerId.current) clearInterval(spawnerId.current);
    };
  }, [gameOver]);

  useEffect(() => {
    if (missed >= 5) setGameOver(true);
  }, [missed]);

  const restart = () => {
    setScore(0);
    setMissed(0);
    setGameOver(false);
    setSeeds([]);
    setBirdX(SCREEN_WIDTH / 2 - BIRD_SIZE / 2);
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

      <View style={styles.gameArea} {...(!gameOver ? panResponder.panHandlers : {})}>
        {/* Falling seeds */}
        {!gameOver && seeds.map((seed) => (
          <Animated.Text
            key={seed.id}
            style={[styles.seed, { left: seed.x, top: seed.yAnim }]}
          >
            🌻
          </Animated.Text>
        ))}

        {/* Bird at bottom */}
        {!gameOver && (
          <View style={[styles.bird, { left: birdX }]}>
            <Text style={styles.birdEmoji}>🐦</Text>
          </View>
        )}

        {!gameOver && (
          <Text style={styles.hint}>Kuşu sürükleyerek tohumları topla!</Text>
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
  safe: { flex: 1, backgroundColor: "#B3E5FC" },
  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreText: { fontSize: 24, fontWeight: "900", color: "#01579B" },
  missedText: { fontSize: 24, fontWeight: "900", color: "#E53935" },
  gameArea: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  seed: {
    position: "absolute",
    fontSize: 36,
  },
  bird: {
    position: "absolute",
    bottom: 30,
    width: BIRD_SIZE,
    height: BIRD_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  birdEmoji: { fontSize: 44 },
  hint: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    color: "rgba(0,0,0,0.3)",
    fontSize: 13,
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
