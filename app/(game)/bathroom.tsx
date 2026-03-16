import React, { useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from "react-native";
import { useRouter } from "expo-router";
import { usePetStore } from "@/store/usePetStore";
import { GameColors } from "@/constants/theme";
import TopHUD from "@/components/game/TopHUD";
import PetAvatar from "@/components/game/PetAvatar";
import RoomBackground from "@/components/game/RoomBackground";
import BottomActionBar from "@/components/game/BottomActionBar";
import EffectsOverlay, { EffectsOverlayRef } from "@/components/game/EffectsOverlay";
import { playSound } from "@/utils/audio";

export default function BathroomScreen() {
  const router = useRouter();
  const { bathe } = usePetStore();
  const effectsRef = useRef<EffectsOverlayRef>(null);

  // State ve Referanslar (Closure hatasını önlemek için)
  const [activeTool, _setActiveTool] = useState<"none" | "soap" | "water">("none");
  const activeToolRef = useRef(activeTool);
  const setActiveTool = (t: "none" | "soap" | "water") => {
    activeToolRef.current = t;
    _setActiveTool(t);
  };

  const [isClean, setIsClean] = useState(false);
  const [foamLevel, _setFoamLevel] = useState(0);
  const foamLevelRef = useRef(foamLevel);
  const setFoamLevel = (v: number) => {
    foamLevelRef.current = v;
    _setFoamLevel(v);
  };

  // Sürüklenen aletin pozisyonu
  const pan = useRef(new Animated.ValueXY()).current;
  
  // Sürükleme (Drag) algılayıcı
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const px = gestureState.dx;
        const py = gestureState.dy;
        pan.setValue({ x: px, y: py });
        
        const currentTool = activeToolRef.current;
        const currentFoam = foamLevelRef.current;

        // Köpük ve temizleme mantığı
        if (currentTool === "soap") {
          const nextFoam = Math.min(currentFoam + 1.5, 100);
          setFoamLevel(nextFoam);
          
          if (nextFoam >= 100) {
            setActiveTool("water");
          }
          if (Math.random() > 0.8) effectsRef.current?.triggerEffect("bubble", gestureState.moveX - 20, gestureState.moveY - 20);
        } 
        else if (currentTool === "water" && currentFoam > 0) {
          const nextFoam = Math.max(currentFoam - 2, 0);
          setFoamLevel(nextFoam);
          
          if (nextFoam <= 0) {
            setIsClean(true);
            playSound("bath");
            bathe();
            setActiveTool("none");
            setTimeout(() => {
              if (router.canGoBack()) router.back();
            }, 1800);
          }
          if (Math.random() > 0.8) effectsRef.current?.triggerEffect("sparkle", gestureState.moveX - 20, gestureState.moveY - 20);
        }
      },
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return (
    <SafeAreaView style={styles.safe}>
      <TopHUD />
      <RoomBackground
        bgColor={GameColors.bathroom}
        bgImage={require("@/assets/images/rooms/bathroom.png")}
      >
        <EffectsOverlay ref={effectsRef} />

        <View style={styles.tubContainer}>
          <Text style={styles.tubBack}>🛁</Text>
          <View style={styles.petWrap}>
            <PetAvatar />
            {/* Köpük Efektleri (10 parçaya bölünerek level'a göre gösterilir) */}
            {foamLevel > 0 && Array.from({ length: Math.floor(foamLevel / 10) }).map((_, i) => (
              <Text 
                key={i} 
                style={[
                  styles.foamBubble, 
                  { 
                    left: 20 + (i * 37) % 80, 
                    top: 20 + (i * 23) % 80, 
                    transform: [{ scale: 1 + (i % 3) * 0.2 }] 
                  }
                ]}
              >
                🫧
              </Text>
            ))}
            {isClean && <Text style={styles.bubbles}>✨✨</Text>}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>
            {activeTool === "none" && !isClean && "Banyo Zamanı!"}
            {activeTool === "soap" && "Süngeri Sürükle 🧽"}
            {activeTool === "water" && "Şimdi Durula 🚿"}
            {isClean && "Tertemiz Oldu! ✨"}
          </Text>

          {activeTool === "none" && !isClean && (
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.btnSoap}
                onPress={() => setActiveTool("soap")}
                activeOpacity={0.8}
              >
                <Text style={styles.btnText}>🧽 Sabunla</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTool === "soap" && (
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.btnWater}
                onPress={() => setActiveTool("water")}
                activeOpacity={0.8}
              >
                <Text style={styles.btnText}>🚿 Durulamaya Geç</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Sürüklenebilir Nesne (Sünger / Su) */}
          {activeTool !== "none" && (
            <Animated.View
              {...panResponder.panHandlers}
              style={[
                pan.getLayout(),
                styles.draggableTool,
              ]}
            >
              <Text style={styles.toolEmoji}>
                {activeTool === "soap" ? "🧽" : "💧"}
              </Text>
            </Animated.View>
          )}
        </View>
      </RoomBackground>
      <BottomActionBar
        buttons={[
          { emoji: "◀️", label: "Geri", color: GameColors.shopBtn, onPress: () => router.back() },
        ]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: GameColors.bathroom },
  tubContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: 300,
  },
  tubBack: {
    position: "absolute",
    fontSize: 160,
    bottom: -40,
    zIndex: 0,
    opacity: 0.5,
  },
  petWrap: {
    zIndex: 1,
    marginBottom: 20,
    alignItems: "center",
  },
  bubbles: {
    position: "absolute",
    fontSize: 40,
    bottom: -10,
    zIndex: 2,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginHorizontal: 24,
    marginTop: 16,
    gap: 12,
    zIndex: 10,
  },
  title: { fontSize: 24, fontWeight: "700", color: "#333" },
  actions: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
  btnSoap: {
    backgroundColor: "#FFB74D",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 20,
  },
  btnWater: {
    backgroundColor: GameColors.bathBtn,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 20,
  },
  btnText: { fontSize: 16, fontWeight: "700", color: "#FFF" },
  draggableTool: {
    position: "absolute",
    zIndex: 999,
    top: -150, // Card içeriğinden bir miktar yukarıda başlasın
    padding: 20,
  },
  toolEmoji: {
    fontSize: 80,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 6,
  },
  foamBubble: {
    position: "absolute",
    fontSize: 24,
    opacity: 0.9,
    zIndex: 5,
  }
});

