import React from "react";
import { ImageBackground, StyleSheet, Text, View, ImageSourcePropType } from "react-native";

interface RoomBackgroundProps {
  bgColor?:   string;
  bgImage?:   ImageSourcePropType;
  decorations?: string[]; // dekoratif emoji listesi (geriye dönük uyumluluk)
  children:   React.ReactNode;
}

export default function RoomBackground({ bgColor = "#FFF", bgImage, decorations = [], children }: RoomBackgroundProps) {
  if (bgImage) {
    return (
      <ImageBackground source={bgImage} style={styles.room} resizeMode="cover">
        {children}
      </ImageBackground>
    );
  }

  return (
    <View style={[styles.room, { backgroundColor: bgColor }]}>
      {/* Dekoratif emojiler (köşe/arka plan) */}
      {decorations.map((emoji, i) => (
        <Text key={i} style={[styles.decor, decorPositions[i % decorPositions.length]]}>
          {emoji}
        </Text>
      ))}
      {children}
    </View>
  );
}

const decorPositions = [
  { top:  20, left:  20 },
  { top:  20, right: 20 },
  { bottom: 90, left: 20 },
  { bottom: 90, right: 20 },
  { top: "40%", left: 10 },
  { top: "40%", right: 10 },
] as const;

const styles = StyleSheet.create({
  room: {
    flex:           1,
    justifyContent: "center",
    alignItems:     "center",
    position:       "relative",
  },
  decor: {
    position: "absolute",
    fontSize: 32,
    opacity:  0.4,
  },
});
