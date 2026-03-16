import math
import wave
import struct
import os

def generate_beep(filename, freq, duration, volume=0.5, type="square"):
    sample_rate = 44100.0
    num_samples = int(duration * sample_rate)
    
    # ensure dir
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    wav_file = wave.open(filename, "w")
    wav_file.setparams((1, 2, int(sample_rate), num_samples, "NONE", "not compressed"))
    
    for i in range(num_samples):
        t = float(i) / sample_rate
        if type == "square":
            value = 1.0 if math.sin(2.0 * math.pi * freq * t) > 0 else -1.0
        elif type == "sine":
            value = math.sin(2.0 * math.pi * freq * t)
        elif type == "saw":
            value = 2.0 * (t * freq - math.floor(t * freq + 0.5))
        
        # Envelope to avoid clicks
        envelope = 1.0
        if i < 0.1 * sample_rate:
            envelope = i / (0.1 * sample_rate)
        elif i > num_samples - 0.1 * sample_rate:
            envelope = (num_samples - i) / (0.1 * sample_rate)
            
        sample = max(-32768, min(32767, int(value * envelope * volume * 32767.0)))
        wav_file.writeframes(struct.pack('h', sample))
    
    wav_file.close()

# Eat: Short high pitch
generate_beep("assets/sounds/eat.wav", 880, 0.15, 0.5, "square")
# Full/Happy: Ascending arpeggio
# We'll do a simple high beep for now, or maybe sequence it later
generate_beep("assets/sounds/full.wav", 1200, 0.3, 0.5, "sine")
# Play: Bounce
generate_beep("assets/sounds/play.wav", 600, 0.2, 0.5, "saw")
# Bath
generate_beep("assets/sounds/bath.wav", 400, 0.4, 0.5, "sine")
# Toilet
generate_beep("assets/sounds/toilet.wav", 300, 0.6, 0.5, "saw")
# Sleep
generate_beep("assets/sounds/sleep.wav", 200, 0.8, 0.5, "sine")
# Wake
generate_beep("assets/sounds/wake.wav", 800, 0.5, 0.5, "sine")
# Level up
generate_beep("assets/sounds/levelup.wav", 1000, 0.6, 0.5, "square")
# Grow older
generate_beep("assets/sounds/grow.wav", 500, 0.7, 0.5, "saw")

print("Sounds generated in assets/sounds/")
