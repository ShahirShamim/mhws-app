"use client"

import { useState, useRef, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, Clock, Zap, Music } from "lucide-react"

type SoundType = "brown" | "rain" | "forest" | "ocean" | "wind"

export default function SoundsPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [frequency, setFrequency] = useState(0.5)
  const [timer, setTimer] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [soundType, setSoundType] = useState<SoundType>("brown")
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<AudioBufferSourceNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const generateNatureSound = (type: SoundType) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const ctx = audioContextRef.current
    const bufferSize = ctx.sampleRate * 4
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const output = noiseBuffer.getChannelData(0)

    let lastOut = 0

    switch (type) {
      case "rain":
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1
        }
        break

      case "forest":
        const forestFilter = 0.03
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1
          output[i] = (lastOut + forestFilter * white) / (1 + forestFilter)
          lastOut = output[i]
          output[i] *= 2.5
        }
        break

      case "ocean":
        const oceanFilter = 0.05
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1
          output[i] = (lastOut + oceanFilter * white) / (1 + oceanFilter)
          lastOut = output[i]
          output[i] *= 4
        }
        break

      case "wind":
        const windFilter = 0.02
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1
          const variation = Math.sin(i / 1000) * 0.5 + 0.5
          output[i] = (lastOut + windFilter * white * variation) / (1 + windFilter)
          lastOut = output[i]
          output[i] *= 3
        }
        break

      case "brown":
      default:
        const filterStrength = 0.01 + frequency * 0.03
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1
          output[i] = (lastOut + filterStrength * white) / (1 + filterStrength)
          lastOut = output[i]
          output[i] *= 3.5
        }
    }

    const noiseSource = ctx.createBufferSource()
    noiseSource.buffer = noiseBuffer
    noiseSource.loop = true

    gainNodeRef.current = ctx.createGain()
    gainNodeRef.current.gain.value = volume

    noiseSource.connect(gainNodeRef.current)
    gainNodeRef.current.connect(ctx.destination)
    noiseSource.start(0)
    oscillatorRef.current = noiseSource
  }

  const togglePlayback = () => {
    if (isPlaying) {
      if (audioContextRef.current && oscillatorRef.current) {
        oscillatorRef.current.stop()
        audioContextRef.current.close()
        audioContextRef.current = null
        oscillatorRef.current = null
      }
      if (timerRef.current) clearInterval(timerRef.current)
      setIsPlaying(false)
      setTimeLeft(0)
    } else {
      generateNatureSound(soundType)
      setIsPlaying(true)
      if (timer > 0) {
        setTimeLeft(timer * 60)
      }
    }
  }

  useEffect(() => {
    if (isPlaying && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (audioContextRef.current && oscillatorRef.current) {
              oscillatorRef.current.stop()
              audioContextRef.current.close()
              audioContextRef.current = null
              oscillatorRef.current = null
            }
            setIsPlaying(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, timer])

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume
    }
  }, [volume])

  useEffect(() => {
    return () => {
      if (audioContextRef.current && isPlaying) {
        oscillatorRef.current?.stop()
        audioContextRef.current.close()
      }
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const soundLabels: Record<SoundType, string> = {
    brown: "Brown Noise",
    rain: "Rain",
    forest: "Forest",
    ocean: "Ocean Waves",
    wind: "Wind",
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4 text-balance">Sound Generator</h1>
          <p className="text-lg text-muted-foreground">
            Relax with soothing ambient sounds for focus, sleep, or meditation
          </p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>{soundLabels[soundType]}</CardTitle>
            <CardDescription>
              {soundType === "brown" && "Brown noise is a deep, rumbling sound that can help mask distracting noises."}
              {soundType === "rain" && "The crisp patter of rainfall creates a peaceful, natural atmosphere."}
              {soundType === "forest" && "Forest ambience with gentle rustling and natural woodland sounds."}
              {soundType === "ocean" && "Waves crashing gently on the shore provide calming ocean sounds."}
              {soundType === "wind" && "Soft wind sounds with natural variations for relaxation."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Music className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Sound Type</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {(["brown", "rain", "forest", "ocean", "wind"] as SoundType[]).map((type) => (
                  <Button
                    key={type}
                    onClick={() => {
                      setSoundType(type)
                      if (isPlaying) {
                        if (audioContextRef.current && oscillatorRef.current) {
                          oscillatorRef.current.stop()
                          audioContextRef.current.close()
                          audioContextRef.current = null
                          oscillatorRef.current = null
                        }
                        generateNatureSound(type)
                      }
                    }}
                    disabled={isPlaying}
                    variant={soundType === type ? "default" : "outline"}
                    className={soundType === type ? "bg-primary text-primary-foreground" : ""}
                    size="sm"
                  >
                    {soundLabels[type].split(" ")[0]}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-6">
              <Button
                onClick={togglePlayback}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-16 h-16 flex items-center justify-center"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </Button>
              <span className="text-center">
                <p className="text-2xl font-semibold">{isPlaying ? "Playing" : "Paused"}</p>
                {timeLeft > 0 && <p className="text-primary font-medium">{formatTime(timeLeft)}</p>}
                {timeLeft === 0 && <p className="text-muted-foreground">{soundLabels[soundType]}</p>}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Volume</span>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                />
                <span className="text-sm font-semibold w-8 text-right">{Math.round(volume * 100)}%</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Tone Depth</span>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={frequency}
                  onChange={(e) => setFrequency(Number.parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                />
                <span className="text-sm font-semibold w-8 text-right">
                  {frequency < 0.33 ? "Deep" : frequency < 0.66 ? "Mid" : "Bright"}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Duration (minutes)</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[15, 30, 45, 60].map((mins) => (
                  <Button
                    key={mins}
                    onClick={() => setTimer(mins)}
                    disabled={isPlaying}
                    variant={timer === mins ? "default" : "outline"}
                    className={timer === mins ? "bg-primary text-primary-foreground" : ""}
                  >
                    {mins}m
                  </Button>
                ))}
              </div>
              {timer > 0 && !isPlaying && <p className="text-sm text-muted-foreground">Timer set to {timer} minutes</p>}
            </div>

            <div className="bg-muted p-4 rounded border border-border space-y-2">
              <p className="font-semibold text-sm">Tips for best results:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use headphones for an immersive experience</li>
                <li>• Adjust volume to a comfortable level</li>
                <li>• Brown noise works great for focus sessions and sleep</li>
                <li>• Let it play continuously for best effect</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
