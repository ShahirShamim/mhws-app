import random
import struct
import wave
import math

def generate_noise(filename, duration=5, volume=0.5, type="white"):
    sample_rate = 44100
    n_samples = int(sample_rate * duration)
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setparams((1, 2, sample_rate, n_samples, 'NONE', 'not compressed'))
        
        last_value = 0
        
        for i in range(n_samples):
            if type == "white":
                value = random.uniform(-1, 1)
            elif type == "brown":
                # Brown noise is integrated white noise
                value = last_value + random.uniform(-0.05, 0.05)
                # Soft clipping to keep it in range
                if value > 1: value = 1
                if value < -1: value = -1
                last_value = value
            elif type == "sine":
                 value = math.sin(2 * math.pi * 440 * i / sample_rate)
            else:
                value = random.uniform(-1, 1)

            # Apply volume and convert to 16-bit integer
            packed_value = struct.pack('h', int(value * volume * 32767))
            wav_file.writeframes(packed_value)

print("Generating sounds...")
generate_noise('public/sounds/brown.wav', type="brown")
generate_noise('public/sounds/rain.wav', type="white") # White noise sounds a bit like rain
generate_noise('public/sounds/wind.wav', type="brown") # Brown noise is closer to wind
generate_noise('public/sounds/ocean.wav', type="brown")
generate_noise('public/sounds/forest.wav', type="white", volume=0.1) # Quiet white noise as placeholder

print("Done!")
