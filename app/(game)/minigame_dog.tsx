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
const FALL_SPEED = 2000;

export default function DogMinigame() {
  const router = useRouter();
  const { winMinigame } = usePetStore();
  
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  // Falling bones
  const [bones, setBones] = useState<{ id: string; x: number; yAnim: Animated.Value }[]>([]);
  
  const effectsRef = useRef<EffectsOverlayRef>(null);
  const spawnerId = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (gameOver) return;

    spawnerId.current = setInterval(() => {
      const startX = 20 + Math.random() * (SCREEN_WIDTH - 80);
      const yAnim = new Animated.Value(-50);
      
      const newBone = { id: Math.random().toString(), x: startX, yAnim };
      
      setBones((prev) => [...prev, newBone]);

      // Animasyon
      Animated.timing(yAnim, {
        toValue: SCREEN_HEIGHT + 50,
        duration: FALL_SPEED,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          // Düştü ve yakalanamadı
          setMissed((m) => m + 1);
          setBones((prev) => prev.filter((b) => b.id !== newBone.id));
        }
      });

    }, 1200);

    return () => {
      if (spawnerId.current) clearInterval(spawnerId.current);
    };
  }, [gameOver]);

  useEffect(() => {
    if (missed >= 3) {
      setGameOver(true);
    }
  }, [missed]);

  const handleCatch = (id: string, x: number) => {
    if (gameOver) return;
    
    // Y pozisyonunu tam algılamak NativeDriver:false olduğu için `any` kullanıyoruz
    // veya basitçe effects için ortaya bir yer atayabiliriz
    effectsRef.current?.triggerEffect("sparkle", x, 200); 
    
    setScore((s) => s + 1);
    
    // Stop animation by filtering it out, which unmounts it
    setBones((prev) => prev.filter((b) => b.id !== id));
  };

  const restart = () => {
    setScore(0);
    setMissed(0);
    setGameOver(false);
    setBones([]);
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
        <Text style={styles.missedText}>Kaçan: {missed} / 3</Text>
      </View>

      <View style={styles.gameArea}>
        {!gameOver && bones.map((bone) => (
          <Animated.View
            key={bone.id}
            style={[styles.boneContainer, { left: bone.x, top: bone.yAnim }]}
          >
            <TouchableOpacity activeOpacity={0.6} onPress={() => handleCatch(bone.id, bone.x)}>
              <Text style={styles.emoji}>🦴</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}

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
  safe: { flex: 1, backgroundColor: "#C8E6C9" }, // Soft green
  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreText: { fontSize: 24, fontWeight: "900", color: "#1B5E20" },
  missedText: { fontSize: 24, fontWeight: "900", color: "#E53935" },
  gameArea: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  boneContainer: {
    position: "absolute",
    width: 60,
    height: 60,
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
