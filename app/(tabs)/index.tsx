import React, { useEffect } from "react";
import {
  Alert,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import { usePetStore } from "@/store/usePetStore";
import { GameColors } from "@/constants/theme";

import TopHUD         from "@/components/game/TopHUD";
import PetAvatar      from "@/components/game/PetAvatar";
import CircularNeeds  from "@/components/game/CircularNeeds";
import RoomBackground from "@/components/game/RoomBackground";
import BottomActionBar from "@/components/game/BottomActionBar";

export default function AnaOda() {
  const router = useRouter();
  const { hunger, happiness, cleanliness, energy, toilet, justLeveledUp, dismissLevelUp, level } =
    usePetStore();

  // Level atlama bildirimi
  useEffect(() => {
    if (justLeveledUp) {
      Alert.alert("🎉 Seviye Atladın!", `Tebrikler! Artık Level ${level} 🏆`, [
        { text: "Harika!", onPress: dismissLevelUp },
      ]);
    }
  }, [justLeveledUp, level, dismissLevelUp]);

  const actionButtons = [
    { emoji: "🍽", label: "Besle",   color: GameColors.feedBtn,   onPress: () => router.push("/(game)/kitchen") },
    { emoji: "😊", label: "Oyna",    color: GameColors.playBtn,   onPress: () => router.push("/(game)/games") },
    { emoji: "🚿", label: "Banyo",   color: GameColors.bathBtn,   onPress: () => router.push("/(game)/bathroom") },
    { emoji: "🚽", label: "Tuvalet", color: GameColors.toiletBtn, onPress: () => router.push("/(game)/toilet") },
    { emoji: "🌙", label: "Uyu",     color: GameColors.sleepBtn,  onPress: () => router.push("/(game)/sleep") },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopHUD />

      <RoomBackground
        bgColor={GameColors.room}
        bgImage={require("@/assets/images/rooms/living_room.png")}
      >
        <PetAvatar />
        <CircularNeeds
          needs={[
            { emoji: "🍽️", value: hunger, color: GameColors.barHunger },
            { emoji: "😊", value: happiness, color: GameColors.barHappiness },
            { emoji: "🚿", value: cleanliness, color: GameColors.barCleanliness },
            { emoji: "⚡", value: energy, color: GameColors.barEnergy },
            { emoji: "🚽", value: 100 - toilet, color: GameColors.barToilet },
          ]}
        />
      </RoomBackground>



      <BottomActionBar buttons={actionButtons} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex:            1,
    backgroundColor: GameColors.room,
  },
  needsPanel: {
    backgroundColor: "rgba(255,255,255,0.88)",
    paddingHorizontal: 20,
    paddingVertical:   10,
    borderTopLeftRadius:  16,
    borderTopRightRadius: 16,
  },
});
