"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, CheckSquare, Waves } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-serif font-bold text-primary">Wellness Hub</h1>
          <div className="flex gap-4">
            <Link href="/">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Home
              </Button>
            </Link>
            <Link href="/knowledge">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Knowledge
              </Button>
            </Link>
            <Link href="/planner">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Planner
              </Button>
            </Link>
            <Link href="/sounds">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Sounds
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold mb-4 text-balance">Your Wellness Companion</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Access evidence-based health knowledge, organize your tasks, and find calm through sound.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Knowledge Card */}
          <Card className="bg-card hover:shadow-md transition-shadow border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-primary" />
                <CardTitle>Health Knowledge</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>Access evidence-based NICE guidelines on various health topics.</CardDescription>
              <Link href="/knowledge">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Explore Knowledge
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Planner Card */}
          <Card className="bg-card hover:shadow-md transition-shadow border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckSquare className="w-6 h-6 text-primary" />
                <CardTitle>Task Planner</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>Break down your goals into manageable steps and track progress.</CardDescription>
              <Link href="/planner">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Start Planning
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Sounds Card */}
          <Card className="bg-card hover:shadow-md transition-shadow border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Waves className="w-6 h-6 text-primary" />
                <CardTitle>Brown Noise</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>Relax with soothing brown noise for focus or sleep.</CardDescription>
              <Link href="/sounds">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Listen Now</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
