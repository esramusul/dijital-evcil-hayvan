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

export default function SleepScreen() {
  const router = useRouter();
  const { sleep } = usePetStore();
  
  // ZZZ animasyonu
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    playSound("sleep");
    
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
          Animated.timing(fadeAnim, { toValue: 0, duration: 800, useNativeDriver: true })
        ]),
        Animated.sequence([
          Animated.timing(translateY, { toValue: -20, duration: 1600, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 20, duration: 0, useNativeDriver: true })
        ])
      ])
    ).start();
  }, []);

  const handleWakeUp = () => {
    playSound("wake");
    sleep();
    if (router.canGoBack()) router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Gece modu karartması */}
      <View style={styles.nightOverlay} pointerEvents="none" />
      
      <TopHUD />
      <RoomBackground 
        bgColor={"#1A237E"} 
        bgImage={require("@/assets/images/rooms/bedroom.png")}
      >
        
        <View style={styles.scene}>
          <View style={styles.petWrap}>
            <PetAvatar />
            <Text style={styles.nightCap}>💤</Text>
            <Animated.Text style={[styles.zzz, { opacity: fadeAnim, transform: [{ translateY }] }]}>
              Zzz...
            </Animated.Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>İyi Geceler!</Text>
          <TouchableOpacity style={styles.btn} onPress={handleWakeUp} activeOpacity={0.8}>
            <Text style={styles.btnText}>🌞 Uyan</Text>
          </TouchableOpacity>
        </View>
      </RoomBackground>
      {/* Gece modunda altta buton olmasın istiyorsak kaldırabiliriz veya sadece geri koyabiliriz */}
      <BottomActionBar buttons={[
         { emoji: "◀️", label: "Geri", color: GameColors.shopBtn, onPress: () => router.back() }
      ]} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#1A237E" },
  nightOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,10,0.4)",
    zIndex: 10,
  },
  scene: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  petWrap: {
    zIndex: 1,
    position: "relative",
    bottom: 20,
  },
  nightCap: {
    position: "absolute",
    top: -20,
    right: 20,
    fontSize: 40,
    transform: [{ rotate: "20deg" }],
  },
  zzz: {
    position: "absolute",
    top: -50,
    right: -20,
    fontSize: 32,
    fontWeight: "800",
    color: "#CFD8DC",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginHorizontal: 24,
    marginTop: 32,
    gap: 12,
    zIndex: 11, // Overlayin üzerinde kalması için
  },
  title: { fontSize: 24, fontWeight: "700", color: "#333" },
  btn: {
    backgroundColor: "#FFCA28",
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 20,
  },
  btnText: { fontSize: 18, fontWeight: "700", color: "#333" },
});
