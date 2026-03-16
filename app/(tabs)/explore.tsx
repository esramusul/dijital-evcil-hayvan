import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { usePetStore } from "@/store/usePetStore";
import { SPECIES_EMOJI, LEVEL_XP_THRESHOLDS, MAX_LEVEL } from "@/constants/game";
import { GameColors } from "@/constants/theme";

export default function AyarlarEkrani() {
  const router = useRouter();
  const { selectedPet, petName, level, xp, coins, resetPet } = usePetStore();

  const currentLevelXp = LEVEL_XP_THRESHOLDS[level] ?? 0;
  const nextLevelXp    = LEVEL_XP_THRESHOLDS[Math.min(level + 1, MAX_LEVEL)] ?? xp;
  const progress       = level >= MAX_LEVEL
    ? 1
    : (xp - currentLevelXp) / (nextLevelXp - currentLevelXp);
  const progressPct = Math.max(0, Math.min(100, Math.round(progress * 100)));

  const handleChangeAnimal = () => {
    Alert.alert(
      "Hayvan Değiştir",
      "Mevcut hayvanını bırakıp yeni bir hayvan seçmek istiyor musun? İlerleme sıfırlanacak!",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Evet, Değiştir",
          style: "destructive",
          onPress: () => {
            resetPet();
            router.replace("/setup");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>⚙️ Ayarlar</Text>

        {/* Pet Kartı */}
        <View style={styles.petCard}>
          <Text style={styles.petEmoji}>{SPECIES_EMOJI[selectedPet] ?? "🐾"}</Text>
          <Text style={styles.petName}>{petName}</Text>
          <Text style={styles.petSpecies}>{selectedPet}</Text>
        </View>

        {/* İstatistikler */}
        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>⭐ Seviye</Text>
            <Text style={styles.statValue}>{level}</Text>
          </View>

          {/* XP Bar */}
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>💎 XP</Text>
            <Text style={styles.statValue}>{xp}</Text>
          </View>
          <View style={styles.xpBarBg}>
            <View style={[styles.xpBarFill, { width: `${progressPct}%` as any }]} />
          </View>
          <Text style={styles.xpHint}>
            {level >= MAX_LEVEL
              ? "Maksimum seviyeye ulaştın! 🏆"
              : `Sonraki seviye için ${nextLevelXp - xp} XP daha`}
          </Text>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>🪙 Coin</Text>
            <Text style={styles.statValue}>{coins}</Text>
          </View>
        </View>

        {/* Hayvan Değiştir Butonu */}
        <TouchableOpacity style={styles.changeBtn} onPress={handleChangeAnimal} activeOpacity={0.8}>
          <Text style={styles.changeBtnText}>🔄 Hayvan Değiştir</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F0F4FF" },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1565C0",
    marginBottom: 28,
  },
  petCard: {
    backgroundColor: "#FFF",
    borderRadius: 28,
    paddingVertical: 28,
    paddingHorizontal: 40,
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  petEmoji: { fontSize: 72 },
  petName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1565C0",
    marginTop: 12,
  },
  petSpecies: {
    fontSize: 16,
    color: "#888",
    marginTop: 4,
  },
  statsCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 20,
    width: "100%",
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  statLabel: { fontSize: 16, color: "#555", fontWeight: "600" },
  statValue: { fontSize: 18, fontWeight: "800", color: "#1565C0" },
  xpBarBg: {
    width: "100%",
    height: 10,
    backgroundColor: "#E0E7FF",
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 4,
    overflow: "hidden",
  },
  xpBarFill: {
    height: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 10,
  },
  xpHint: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginBottom: 8,
  },
  changeBtn: {
    backgroundColor: "#EF4444",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 24,
    width: "100%",
    alignItems: "center",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  changeBtnText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "800",
  },
});
