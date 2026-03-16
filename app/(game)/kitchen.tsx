import React, { useRef, useState } from "react";
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  GestureResponderEvent
} from "react-native";
import { useRouter } from "expo-router";

import { usePetStore }   from "@/store/usePetStore";
import { GameColors }    from "@/constants/theme";
import TopHUD            from "@/components/game/TopHUD";
import PetAvatar         from "@/components/game/PetAvatar";
import RoomBackground    from "@/components/game/RoomBackground";
import BottomActionBar   from "@/components/game/BottomActionBar";
import EffectsOverlay, { EffectsOverlayRef } from "@/components/game/EffectsOverlay";
import { playSound } from "@/utils/audio";

const SCREEN_WIDTH = Dimensions.get("window").width;

const FOODS = [
  { emoji: "🍓", name: "Çilek",    hungerGain: 20 },
  { emoji: "🍟", name: "Patates",  hungerGain: 35 },
  { emoji: "🎂", name: "Pasta",    hungerGain: 50 },
  { emoji: "🍎", name: "Elma",     hungerGain: 25 },
  { emoji: "🍗", name: "Tavuk",    hungerGain: 40 },
  { emoji: "🐟", name: "Balık",    hungerGain: 30 },
];

export default function KitchenScreen() {
  const router = useRouter();
  const { feed } = usePetStore();
  const effectsRef = useRef<EffectsOverlayRef>(null);

  // Yemek yeme tepki animasyonu
  const biteAnim = useRef(new Animated.Value(1)).current;

  // Uçma animasyon state'leri
  const [flyingFood, setFlyingFood] = useState<{ emoji: string; startX: number; startY: number } | null>(null);
  const flyAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const flyScale = useRef(new Animated.Value(1)).current;

  // Store'dan hunger gibi statları direkt çekmiyoruz ama feed'in dönüşüne göre test edebiliriz
  // Şimdilik feed çağrısından sonra hayvanın 100'ü geçtiği varsayımı store tarafından hallediliyor. 
  // Biz store'u güncel değeriyle react state olarak bağlayalım.
  const hunger = usePetStore(s => s.hunger);

  const handleFoodPress = (food: typeof FOODS[0], event: GestureResponderEvent) => {
    if (flyingFood) return; // Aynı anda 1 yemek uçsun

    const { pageX, pageY } = event.nativeEvent;
    setFlyingFood({ emoji: food.emoji, startX: pageX - 25, startY: pageY - 25 });
    
    // Geriye dönük state takıntısı olmasın diye initial value veriyoruz
    flyAnim.setValue({ x: pageX - 30, y: pageY - 30 });
    flyScale.setValue(1);

    // Pet ağzı (ekranın tam ortası civarı)
    const targetX = SCREEN_WIDTH / 2 - 30;
    const targetY = 320; 

    Animated.parallel([
      Animated.timing(flyAnim, {
        toValue: { x: targetX, y: targetY },
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(flyScale, {
        toValue: 0.2, // Küçülerek ağza girsin
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Uçuş bitti
      setFlyingFood(null);
      playSound("eat");
      effectsRef.current?.triggerEffect("heart", targetX, targetY);
      
      // Pet Büyüme (Çiğneme) animasyonu
      Animated.sequence([
        Animated.timing(biteAnim, { toValue: 1.15, duration: 150, useNativeDriver: true }),
        Animated.timing(biteAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start(() => {
        feed();
        // Yemekten sonra doydu mu testi
        if (hunger + food.hungerGain >= 100) {
           playSound("full");
           effectsRef.current?.triggerEffect("sparkle", targetX, targetY);
           // Doyma animasyonu (hafif zıplama vs yapılabilir)
           Animated.sequence([
              Animated.timing(biteAnim, { toValue: 1.2, duration: 200, useNativeDriver: true }),
              Animated.timing(biteAnim, { toValue: 1, duration: 200, useNativeDriver: true })
           ]).start();
        }
      });
    });
  };

  const actionButtons = [
    { emoji: "◀️", label: "Geri", color: GameColors.shopBtn, onPress: () => router.back() },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <TopHUD />
      <RoomBackground
        bgColor={GameColors.kitchen}
        bgImage={require("@/assets/images/rooms/kitchen.png")}
      >
        <EffectsOverlay ref={effectsRef} />
        
        {/* Karakter Z-index olarak arkada ama uçar nesneden bağımsız */}
        <Animated.View style={[{ transform: [{ scale: biteAnim }] }, styles.petWrapper]}>
          <PetAvatar />
        </Animated.View>
        
        <View style={styles.panel}>
          <Text style={styles.title}>🍽 Ne yemek istersin?</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.foodCarousel}
          >
            {FOODS.map((food) => (
              <TouchableOpacity
                key={food.name}
                style={styles.foodCard}
                onPress={(e) => handleFoodPress(food, e)}
                activeOpacity={0.75}
              >
                <Text style={styles.foodEmoji}>{food.emoji}</Text>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodStat}>+{food.hungerGain}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Uçuş yapan yemek kopyası */}
        {flyingFood && (
          <Animated.View
            style={[
              styles.flyingFoodContainer,
              {
                transform: [
                  { translateX: flyAnim.x },
                  { translateY: flyAnim.y },
                  { scale: flyScale }
                ],
              },
            ]}
          >
            <Text style={styles.flyingEmoji}>{flyingFood.emoji}</Text>
          </Animated.View>
        )}
      </RoomBackground>
      <BottomActionBar buttons={actionButtons} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: GameColors.kitchen },
  petWrapper: {
    marginTop: 40,
  },
  panel: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius:    20,
    padding:         12,
    margin:          10,
    alignItems:      "center",
    position:        "absolute",
    bottom:          80, // Aşağıya daha yakın otur
    width:           "95%",
  },
  title:     { fontSize: 16, fontWeight: "700", marginBottom: 8, color: "#333" },
  foodCarousel: { 
    gap: 8, 
    paddingHorizontal: 4 
  },
  foodCard: {
    alignItems:      "center",
    backgroundColor: "#FFF",
    borderRadius:    14,
    padding:         8,
    width:           65,
    shadowColor:     "#000",
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.1,
    shadowRadius:    2,
    elevation:       2,
  },
  foodEmoji: { fontSize: 28 },
  foodName:  { fontSize: 10, fontWeight: "600", marginTop: 4, color: "#333" },
  foodStat:  { fontSize: 9, color: GameColors.feedBtn, marginTop: 2 },
  flyingFoodContainer: {
    position: "absolute",
    zIndex: 999,
    top: 0,
    left: 0,
    pointerEvents: "none",
  },
  flyingEmoji: {
    fontSize: 60,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  }
});
