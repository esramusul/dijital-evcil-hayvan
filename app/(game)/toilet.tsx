import React, { useEffect, useRef } from "react";
import {
  Animated, SafeAreaView, StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import { useRouter }   from "expo-router";
import { usePetStore } from "@/store/usePetStore";
import { GameColors }  from "@/constants/theme";
import TopHUD          from "@/components/game/TopHUD";
import PetAvatar       from "@/components/game/PetAvatar";
import RoomBackground  from "@/components/game/RoomBackground";
import BottomActionBar from "@/components/game/BottomActionBar";
import { playSound }   from "@/utils/audio";

export default function ToiletScreen() {
  const router = useRouter();
  const { useToilet } = usePetStore();
  const walkAnim = useRef(new Animated.Value(-200)).current;

  useEffect(() => {
    Animated.timing(walkAnim, {
      toValue: 0,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleToilet = () => {
    playSound("flush");
    useToilet();
    setTimeout(() => {
      if (router.canGoBack()) router.back();
    }, 500);
  };


  return (
    <SafeAreaView style={styles.safe}>
      <TopHUD />
      <RoomBackground 
        bgColor={GameColors.toilet} 
        bgImage={require("@/assets/images/rooms/toilet.png")}
      >
        
        <View style={styles.scene}>
          <Text style={styles.toiletBack}>🚽</Text>
          <Animated.View style={{ transform: [{ translateX: walkAnim }] }}>
            <PetAvatar />
          </Animated.View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Tuvalet Zamanı!</Text>
          <TouchableOpacity style={styles.btn} onPress={handleToilet} activeOpacity={0.8}>
            <Text style={styles.btnText}>🚽 Rahatla!</Text>
          </TouchableOpacity>
        </View>
      </RoomBackground>
      <BottomActionBar buttons={[
        { emoji: "◀️", label: "Geri", color: GameColors.shopBtn, onPress: () => router.back() },
      ]} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: GameColors.toilet },
  scene: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: -40, // Tuvaletin yanına geçmeli
  },
  toiletBack: {
    fontSize: 120,
    zIndex: 0,
    transform: [{ scaleX: -1 }], // Tuvalet sola baksın
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginHorizontal: 24,
    marginTop: 32,
    gap: 12,
  },
  title: { fontSize: 24, fontWeight: "700", color: "#333" },
  btn: {
    backgroundColor: GameColors.toiletBtn,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 20,
  },
  btnText: { fontSize: 18, fontWeight: "700", color: "#FFF" },
});
