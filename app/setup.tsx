import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { usePetStore, PetSpecies } from "@/store/usePetStore";
import { SPECIES_EMOJI } from "@/constants/game";

const AVAILABLE_PETS: PetSpecies[] = ["Kuş", "Kedi", "Köpek", "Tavşan"];

export default function SetupScreen() {
  const router = useRouter();
  const { setupPet } = usePetStore();

  const [selectedPet, setSelectedPet] = useState<PetSpecies | null>(null);
  const [petName, setPetName]         = useState("");

  const handleStart = () => {
    if (!selectedPet) {
      Alert.alert("Hayvan Seç", "Lütfen önce bir evcil hayvan seç! 🐾");
      return;
    }
    const finalName = petName.trim() || `Benim ${selectedPet}m`;
    setupPet(selectedPet, finalName);
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={styles.title}>Yeni Arkadaşın</Text>
        <Text style={styles.subtitle}>Sanal evcil hayvanını seç ve isim ver!</Text>

        <View style={styles.grid}>
          {AVAILABLE_PETS.map((petStr) => {
            const isSelected = selectedPet === petStr;
            return (
              <TouchableOpacity
                key={petStr}
                style={[styles.petCard, isSelected && styles.petCardSelected]}
                onPress={() => setSelectedPet(petStr)}
                activeOpacity={0.8}
              >
                <Text style={styles.petEmoji}>{SPECIES_EMOJI[petStr]}</Text>
                <Text style={[styles.petName, isSelected && styles.petNameSelected]}>
                  {petStr}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {!selectedPet && (
          <Text style={styles.hintText}>👆 Bir evcil hayvan seç!</Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Ona bir isim ver..."
          placeholderTextColor="#999"
          value={petName}
          onChangeText={setPetName}
          maxLength={15}
        />

        <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
          <Text style={styles.startBtnText}>Maceraya Başla 🚀</Text>
        </TouchableOpacity>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#E3F2FD" },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: { fontSize: 32, fontWeight: "900", color: "#1565C0", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#1E88E5", marginBottom: 32, textAlign: "center" },
  
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    marginBottom: 40,
  },
  petCard: {
    width: 110,
    height: 120,
    backgroundColor: "#FFF",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 3,
    borderColor: "transparent",
  },
  petCardSelected: {
    borderColor: "#1565C0",
    backgroundColor: "#E3F2FD",
    transform: [{ scale: 1.05 }],
  },
  petEmoji: { fontSize: 50 },
  petName: { fontSize: 14, fontWeight: "600", color: "#555", marginTop: 8 },
  petNameSelected: { color: "#1565C0", fontWeight: "800" },

  input: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 24,
    textAlign: "center",
  },
  
  startBtn: {
    backgroundColor: "#FF7043",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 24,
    width: "100%",
    alignItems: "center",
    shadowColor: "#FF7043",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  startBtnText: { color: "#FFF", fontSize: 20, fontWeight: "800" },
  hintText: {
    fontSize: 15,
    color: "#1E88E5",
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
});
