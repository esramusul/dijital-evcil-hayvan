import React, { forwardRef, useImperativeHandle, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  runOnJS,
} from "react-native-reanimated";

export interface EffectsOverlayRef {
  triggerEffect: (type: "heart" | "bubble" | "sparkle", x?: number, y?: number) => void;
}

interface Particle {
  id: string;
  type: string;
  x: number;
  y: number;
}

const EMOJI_MAP: Record<string, string> = {
  heart: "❤️",
  bubble: "🫧",
  sparkle: "✨",
};

const EffectsOverlay = forwardRef<EffectsOverlayRef>((props, ref) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useImperativeHandle(ref, () => ({
    triggerEffect: (type, x = 150, y = 300) => {
      const id = Math.random().toString();
      setParticles((prev) => [...prev, { id, type, x, y }]);
    },
  }));

  const removeParticle = (id: string) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p) => (
        <ParticleView key={p.id} particle={p} onFinish={() => removeParticle(p.id)} />
      ))}
    </View>
  );
});

export default EffectsOverlay;

function ParticleView({ particle, onFinish }: { particle: Particle; onFinish: () => void }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0.5);

  React.useEffect(() => {
    translateY.value = withTiming(-100, { duration: 1000 });
    scale.value = withTiming(1.5, { duration: 500 });
    opacity.value = withSequence(
      withTiming(1, { duration: 600 }),
      withTiming(0, { duration: 400 }, (finished) => {
        if (finished) {
          runOnJS(onFinish)();
        }
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.Text
      style={[
        styles.particle,
        { left: particle.x, top: particle.y },
        animatedStyle,
      ]}
    >
      {EMOJI_MAP[particle.type] || "✨"}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: "absolute",
    fontSize: 40,
    zIndex: 999,
  },
});
