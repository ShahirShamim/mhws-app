"use client"

import { useState, useRef, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, Clock, Zap, Music } from "lucide-react"

type SoundType = "brown" | "rain" | "forest" | "ocean" | "wind"

const SOUND_URLS: Record<SoundType, string> = {
  brown: "/sounds/brown.wav",
  rain: "/sounds/rain.wav",
  forest: "/sounds/forest.wav",
  ocean: "/sounds/ocean.wav",
  wind: "/sounds/wind.wav",
}

export default function SoundsPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  // Frequency/Tone Depth is not easily applicable to static MP3s without Web Audio API filters,
  // preventing complexity, we will hide it or keep it as a placeholder for future implementation if needed,
  // but for "correct sounds" via MP3, it's usually just volume and track selection.
  // We'll remove the "Tone Depth" control as it was specific to the synth.

  const [timer, setTimer] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [soundType, setSoundType] = useState<SoundType>("brown")
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize audio
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio(SOUND_URLS[soundType])
      audioRef.current.loop = true
      audioRef.current.volume = volume
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, []) // Initialize once

  // Handle Sound Type Change
  useEffect(() => {
    if (audioRef.current) {
      const wasPlaying = !audioRef.current.paused
      audioRef.current.src = SOUND_URLS[soundType]
      audioRef.current.volume = volume
      if (wasPlaying) {
        audioRef.current.play().catch(e => console.error("Play error", e))
      }
    }
  }, [soundType])

  // Handle Volume Change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // Handle Play/Pause
  const togglePlayback = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      if (timerRef.current) clearInterval(timerRef.current)
      setTimeLeft(0)
    } else {
      audioRef.current.play().catch(e => console.error("Play error", e))
      setIsPlaying(true)
      if (timer > 0) {
        setTimeLeft(timer * 60)
      }
    }
  }

  // Timer Logic
  useEffect(() => {
    if (isPlaying && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Stop
            if (audioRef.current) {
              audioRef.current.pause()
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
    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])


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
                    onClick={() => setSoundType(type)}
                    disabled={isPlaying && false}
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

            {/* Removed Tone Depth control as it is not applicable to static audio files */}

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
