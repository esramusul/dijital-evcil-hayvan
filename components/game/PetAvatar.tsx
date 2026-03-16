import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View, Image } from "react-native";
import { usePetStore } from "@/store/usePetStore";
import { SPECIES_EMOJI, SPECIES_IMAGES, NEED_WARNING_THRESHOLD } from "@/constants/game";

export default function PetAvatar() {
  const { selectedPet, hunger, happiness, energy } = usePetStore();

  let stateEmoji = "😄";
  if (hunger <= NEED_WARNING_THRESHOLD)    stateEmoji = "😩";
  else if (happiness <= NEED_WARNING_THRESHOLD) stateEmoji = "😒";
  else if (energy <= NEED_WARNING_THRESHOLD)    stateEmoji = "😴";

  const speciesEmoji = SPECIES_EMOJI[selectedPet] ?? "🐾";

  const swing = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(swing, { toValue:  1, duration: 800, useNativeDriver: true }),
        Animated.timing(swing, { toValue: -1, duration: 800, useNativeDriver: true }),
        Animated.timing(swing, { toValue:  0, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const rotate = swing.interpolate({ inputRange: [-1, 1], outputRange: ["-5deg", "5deg"] });
  // Küçük zıplama efekti
  const translateY = swing.interpolate({ inputRange: [-1, 0, 1], outputRange: [0, -8, 0] });

  const petImage = SPECIES_IMAGES[selectedPet];

  return (
    <Animated.View style={[styles.container, { transform: [{ rotate }, { translateY }] }]}>
      {petImage ? (
        <Image source={petImage} style={styles.petImage} resizeMode="contain" />
      ) : (
        <Text style={styles.speciesEmoji}>{speciesEmoji}</Text>
      )}
      <View style={styles.stateBadge}>
        <Text style={styles.stateEmoji}>{stateEmoji}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
    // Hayvanın arkasına hafif gölge
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  speciesEmoji: {
    fontSize: 140,
    lineHeight: 160,
  },
  petImage: {
    width: 250,
    height: 250,
    // Arka plan transparan olduğu için gölge Animated.View'de (container) işleyecek
  },
  stateBadge: {
    position: "absolute",
    bottom: 10,
    right: 15,
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  stateEmoji: {
    fontSize: 32,
  },
});
