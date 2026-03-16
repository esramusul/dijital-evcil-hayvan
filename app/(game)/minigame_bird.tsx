import React, { useEffect, useState, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { usePetStore } from "@/store/usePetStore";
import { GameColors } from "@/constants/theme";
import TopHUD from "@/components/game/TopHUD";

const SCREEN_HEIGHT = 600;
const GRAVITY = 3;
const JUMP_FORCE = -15;
const OBSTACLE_WIDTH = 50;
const OBSTACLE_SPEED = 5;

const OBSTACLE_EMOJIS = ["🌵", "☁️", "🦅", "🦇"];

export default function FlappyMinigame() {
  const router = useRouter();
  const { winMinigame, selectedPet } = usePetStore();

  const [birdY, setBirdY] = useState(SCREEN_HEIGHT / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  
  const [obstacleX, setObstacleX] = useState(Dimensions.get("window").width);
  const [obstacleY, setObstacleY] = useState(SCREEN_HEIGHT / 2);
  const [obstacleEmoji, setObstacleEmoji] = useState("🌵");

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const timerId = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetObstacle = () => {
    setObstacleX(Dimensions.get("window").width);
    setObstacleY(100 + Math.random() * (SCREEN_HEIGHT - 200));
    setObstacleEmoji(OBSTACLE_EMOJIS[Math.floor(Math.random() * OBSTACLE_EMOJIS.length)]);
  };

  useEffect(() => {
    if (gameOver) return;

    timerId.current = setInterval(() => {
      setBirdVelocity((v) => v + GRAVITY * 0.2);
      setBirdY((y) => Math.max(0, Math.min(SCREEN_HEIGHT, y + birdVelocity)));

      setObstacleX((x) => {
        if (x < -OBSTACLE_WIDTH) {
          setScore((s) => s + 1);
          resetObstacle();
          return Dimensions.get("window").width;
        }
        return x - OBSTACLE_SPEED;
      });
    }, 24);

    return () => {
      if (timerId.current) clearInterval(timerId.current);
    };
  }, [birdVelocity, gameOver]);

  // Çarpışma kontrolü
  useEffect(() => {
    if (gameOver) return;
    
    // Kuş sabit X: 80, Genişlik/Yükseklik: ~40
    const birdRect = { x: 80, y: birdY, w: 40, h: 40 };
    const obsRect  = { x: obstacleX, y: obstacleY, w: OBSTACLE_WIDTH, h: OBSTACLE_WIDTH };

    if (
      birdRect.x < obsRect.x + obsRect.w &&
      birdRect.x + birdRect.w > obsRect.x &&
      birdRect.y < obsRect.y + obsRect.h &&
      birdRect.y + birdRect.h > obsRect.y
    ) {
      setGameOver(true);
    }
    
    // Yere veya tavana çarpma
    if (birdY >= SCREEN_HEIGHT - 40 || birdY <= 0) {
      setGameOver(true);
    }
  }, [birdY, obstacleX, obstacleY, gameOver]);

  const jump = () => {
    if (!gameOver) setBirdVelocity(JUMP_FORCE);
  };

  const restart = () => {
    setBirdY(SCREEN_HEIGHT / 2);
    setBirdVelocity(0);
    resetObstacle();
    setScore(0);
    setGameOver(false);
  };

  const handleFinish = () => {
    if (score >= 3) winMinigame(); // En az 3 puanda kazandır
    router.back();
  };

  const playerEmoji = selectedPet === "Kuş" ? "🐦" : selectedPet === "Kedi" ? "🐱" : "🐶";

  return (
    <SafeAreaView style={styles.safe}>
      <TopHUD />
      <View style={styles.header}>
        <Text style={styles.scoreText}>Skor: {score}</Text>
      </View>

      <TouchableOpacity activeOpacity={1} style={styles.gameArea} onPress={jump}>
        {!gameOver && (
          <>
            <View style={[styles.bird, { top: birdY }]}>
              <Text style={styles.emoji}>{playerEmoji}</Text>
            </View>
            <View style={[styles.obstacle, { left: obstacleX, top: obstacleY }]}>
              <Text style={styles.emoji}>{obstacleEmoji}</Text>
            </View>
          </>
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
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#81D4FA" }, // Gökyüzü mavisi
  header: {
    padding: 16,
    alignItems: "center",
  },
  scoreText: { fontSize: 28, fontWeight: "900", color: "#FFF" },
  gameArea: {
    flex: 1,
    overflow: "hidden",
    position: "relative",
  },
  bird: {
    position: "absolute",
    left: 80,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  obstacle: {
    position: "absolute",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
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
