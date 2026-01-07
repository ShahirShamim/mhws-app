"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, ExternalLink } from "lucide-react"

interface ContentViewerProps {
  url: string
  title: string
  onClose: () => void
}

export function ContentViewer({ url, title, onClose }: ContentViewerProps) {
  const [content, setContent] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch("/api/fetch-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        })

        if (!response.ok) throw new Error("Failed to fetch content")

        const data = await response.json()
        setContent(data.content)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load content")
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [url])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto bg-card">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle className="text-2xl">{title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          {loading && <p className="text-muted-foreground">Loading content...</p>}
          {error && <p className="text-destructive">{error}</p>}
          {!loading && !error && (
            <div className="space-y-4">
              <div
                className="prose prose-sm max-w-none text-foreground text-sm leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br />") }}
              />
              <div className="pt-4 border-t">
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <Button className="gap-2 bg-transparent" variant="outline">
                    <ExternalLink className="w-4 h-4" />
                    View Full Page
                  </Button>
                </a>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
