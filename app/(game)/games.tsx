import React from "react";
import {
  SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import { useRouter }   from "expo-router";
import { usePetStore } from "@/store/usePetStore";
import { GameColors }  from "@/constants/theme";
import TopHUD          from "@/components/game/TopHUD";
import BottomActionBar from "@/components/game/BottomActionBar";

const GAME_CATALOG: Record<string, { emoji: string; name: string; desc: string; route: string }[]> = {
  "Kuş":   [
    { emoji: "🐦", name: "Uçuş Macerası",   desc: "Engellerden kaçarak ilerle!",        route: "minigame_bird" },
    { emoji: "🌻", name: "Tohum Toplama",    desc: "Kuşunu sürükle, tohumları topla!",   route: "minigame_bird2" },
    { emoji: "🏆", name: "Uçuş Yarışı",     desc: "Yakında...",                          route: "locked" },
  ],
  "Kedi":  [
    { emoji: "🧶", name: "Yumak Avı",        desc: "Ekranda beliren yumakları yakala!",  route: "minigame_cat" },
    { emoji: "🔴", name: "Lazer Takibi",     desc: "Lazer noktasını hızla yakala!",      route: "minigame_cat2" },
    { emoji: "🐭", name: "Fare Avı",          desc: "Yakında...",                          route: "locked" },
  ],
  "Köpek": [
    { emoji: "🦴", name: "Kemik Avcısı",     desc: "Düşen kemiklere tıkla!",             route: "minigame_dog" },
    { emoji: "🎾", name: "Top Kapmaca",       desc: "Uçan tenis toplarını yakala!",       route: "minigame_dog2" },
    { emoji: "🥏", name: "Frizbi",            desc: "Yakında...",                          route: "locked" },
  ],
  "Tavşan": [
    { emoji: "🥕", name: "Havuç Toplama",    desc: "Düşen havuçları hızla yakala!",      route: "minigame_rabbit" },
    { emoji: "🌿", name: "Yaprak Atlamaca",   desc: "Yakında...",                          route: "locked" },
  ],
};

export default function GamesScreen() {
  const router = useRouter();
  const { selectedPet } = usePetStore();

  const games = GAME_CATALOG[selectedPet] ?? GAME_CATALOG["Kuş"];

  return (
    <SafeAreaView style={styles.safe}>
      <TopHUD />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎮 Oyunlar</Text>
        <Text style={styles.headerSub}>Bir oyun seç ve para kazan!</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {games.map((game) => {
          const isLocked = game.route === "locked";
          return (
            <TouchableOpacity
              key={game.name}
              style={[styles.card, isLocked && styles.cardLocked]}
              onPress={() => !isLocked && router.push(`/(game)/${game.route}` as any)}
              activeOpacity={isLocked ? 1 : 0.8}
            >
              <Text style={styles.cardEmoji}>{game.emoji}</Text>
              <View style={styles.cardText}>
                <Text style={styles.cardName}>{game.name}</Text>
                <Text style={styles.cardDesc}>{game.desc}</Text>
              </View>
              {isLocked
                ? <Text style={styles.lockIcon}>🔒</Text>
                : <Text style={styles.playIcon}>▶️</Text>
              }
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <BottomActionBar buttons={[
        { emoji: "◀️", label: "Geri", color: GameColors.shopBtn, onPress: () => router.back() },
      ]} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: GameColors.games },
  header: {
    paddingHorizontal: 20,
    paddingVertical:   16,
  },
  headerTitle: { fontSize: 28, fontWeight: "800", color: "#5E35B1" },
  headerSub:   { fontSize: 14, color: "#7E57C2", marginTop: 2 },
  list: {
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 12,
  },
  card: {
    flexDirection:   "row",
    alignItems:      "center",
    backgroundColor: "#FFF",
    borderRadius:    20,
    padding:         16,
    gap:             14,
    shadowColor:     "#5E35B1",
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.15,
    shadowRadius:    8,
    elevation:       4,
  },
  cardLocked: { opacity: 0.5 },
  cardEmoji:  { fontSize: 44 },
  cardText:   { flex: 1 },
  cardName:   { fontSize: 16, fontWeight: "700", color: "#333" },
  cardDesc:   { fontSize: 12, color: "#888", marginTop: 2 },
  lockIcon:   { fontSize: 22 },
  playIcon:   { fontSize: 22 },
});
