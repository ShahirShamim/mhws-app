"use client"

import { useTheme } from "next-themes"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useEffect, useState } from "react"

export default function SettingsPage() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const themes = [
        { id: "light", name: "Default Light", color: "#f5f1e6" },
        { id: "dark", name: "Default Dark", color: "#2d2621" },
        { id: "ocean", name: "Ocean", color: "#0077b6" },
        { id: "forest", name: "Forest", color: "#2d6a4f" },
        { id: "sunset", name: "Sunset", color: "#e76f51" },
    ]

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Navigation />

            <main className="max-w-2xl mx-auto px-4 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-serif font-bold mb-4 text-balance">Settings</h1>
                    <p className="text-lg text-muted-foreground">
                        Customize your Wellness Hub experience
                    </p>
                </div>

                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>
                            Choose a color theme that suits your mood
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {themes.map((t) => (
                                <Button
                                    key={t.id}
                                    variant="outline"
                                    className={`h-24 flex flex-col items-center justify-center gap-2 border-2 ${theme === t.id ? "border-primary bg-accent/20" : "border-border"
                                        }`}
                                    onClick={() => setTheme(t.id)}
                                >
                                    <div
                                        className="w-8 h-8 rounded-full border border-border shadow-sm"
                                        style={{ backgroundColor: t.color }}
                                    />
                                    <span className="font-medium">{t.name}</span>
                                    {theme === t.id && <Check className="w-4 h-4 text-primary absolute top-2 right-2" />}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
