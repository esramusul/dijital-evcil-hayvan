import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GameColors } from "@/constants/theme";

interface ActionButton {
  emoji:   string;
  label:   string;
  color:   string;
  onPress: () => void;
  active?: boolean;
}

interface BottomActionBarProps {
  buttons: ActionButton[];
}

export default function BottomActionBar({ buttons }: BottomActionBarProps) {
  return (
    <View style={styles.container}>
      {buttons.map((btn) => (
        <TouchableOpacity
          key={btn.label}
          style={[styles.btn, { backgroundColor: btn.color }, btn.active && styles.btnActive]}
          onPress={btn.onPress}
          activeOpacity={0.75}
        >
          <Text style={styles.btnEmoji}>{btn.emoji}</Text>
          <Text style={styles.btnLabel}>{btn.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:    "row",
    justifyContent:   "space-around",
    alignItems:       "flex-end",
    paddingHorizontal: 8,
    paddingBottom:    12,
    paddingTop:        8,
    backgroundColor:  "rgba(255,255,255,0.95)",
    borderTopLeftRadius:  20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius:  8,
    elevation: 10,
  },
  btn: {
    alignItems:    "center",
    justifyContent:"center",
    width:          60,
    height:         60,
    borderRadius:   30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius:  4,
    elevation: 5,
  },
  btnActive: {
    transform:  [{ scale: 1.18 }],
    shadowOpacity: 0.45,
  },
  btnEmoji: { fontSize: 22 },
  btnLabel: { fontSize: 9, color: "#FFF", fontWeight: "700", marginTop: 1 },
});
