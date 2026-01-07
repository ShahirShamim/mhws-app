"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { ContentViewer } from "@/components/content-viewer"

const niceGuidelines = [
  {
    title: "Depression & Anxiety",
    description: "Evidence-based guidance on managing depression and anxiety disorders",
    url: "https://www.nice.org.uk/guidance/ng222",
  },
  {
    title: "Sleep Disorders",
    description: "Comprehensive guidance on assessment and management of sleep disorders",
    url: "https://www.nice.org.uk/guidance/ng195",
  },
  {
    title: "Weight Management",
    description: "Evidence-based approaches to weight management and obesity",
    url: "https://www.nice.org.uk/guidance/ng189",
  },
  {
    title: "Physical Activity",
    description: "Recommendations for physical activity and exercise benefits",
    url: "https://www.nice.org.uk/guidance/ng180",
  },
  {
    title: "Nutrition & Diet",
    description: "Nutritional guidance for healthy eating and disease prevention",
    url: "https://www.nice.org.uk/guidance/cg189",
  },
  {
    title: "Stress & Resilience",
    description: "Building resilience and managing workplace stress effectively",
    url: "https://www.nice.org.uk/guidance/ng205",
  },
]

export default function KnowledgePage() {
  const [selectedContent, setSelectedContent] = useState<{ url: string; title: string } | null>(null)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4 text-balance">Health Knowledge</h1>
          <p className="text-lg text-muted-foreground">
            Access evidence-based NICE guidelines for various health topics
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {niceGuidelines.map((guideline) => (
            <Card key={guideline.url} className="bg-card border-border hover:shadow-md transition-shadow flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl">{guideline.title}</CardTitle>
                <CardDescription>{guideline.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button
                  onClick={() => setSelectedContent({ url: guideline.url, title: guideline.title })}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Read Guideline
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {selectedContent && (
        <ContentViewer
          url={selectedContent.url}
          title={selectedContent.title}
          onClose={() => setSelectedContent(null)}
        />
      )}
    </div>
  )
}
