import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { url } = await request.json()

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`)
    }

    const html = await response.text()

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/)
    const title = titleMatch ? titleMatch[1].replace(/[|–-]/g, " ").split(" ")[0] : "Content"

    // Remove unnecessary elements
    const cleanHtml = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
      .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, "")
      .replace(/<button[^>]*>[\s\S]*?<\/button>/gi, "")

    // Extract main content container (usually article or main)
    let mainContent = ""
    const mainMatch = cleanHtml.match(/<main[^>]*>([\s\S]*?)<\/main>/i)
    const articleMatch = cleanHtml.match(/<article[^>]*>([\s\S]*?)<\/article>/i)
    mainContent = mainMatch ? mainMatch[1] : articleMatch ? articleMatch[1] : cleanHtml

    // Extract headings and paragraphs while preserving structure
    const elements: string[] = []

    // Get main headings (h1, h2)
    const mainHeadings = mainContent.match(/<h[1-2][^>]*>([^<]+(?:<[^>]*>[^<]*)*)<\/h[1-2]>/gi) || []
    elements.push(...mainHeadings.slice(0, 5))

    // Get relevant paragraphs (filter out short ones likely to be UI text)
    const paragraphs = mainContent.match(/<p[^>]*>([^<]{30,}(?:<[^>]*>[^<]*)*)<\/p>/gi) || []
    elements.push(...paragraphs.slice(0, 15))

    // Get list items (often contain recommendations)
    const lists = mainContent.match(/<(?:ul|ol)[^>]*>[\s\S]*?<\/(?:ul|ol)>/gi) || []
    elements.push(...lists.slice(0, 3))

    // Clean HTML tags but preserve structure
    const content = elements
      .map((el) => {
        return el
          .replace(/<[^>]+>/g, "") // Remove all HTML tags
          .replace(/&nbsp;/g, " ")
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, "&")
          .replace(/\s+/g, " ") // Normalize whitespace
          .trim()
      })
      .filter((text) => text.length > 10) // Remove very short items
      .join("\n\n")

    return NextResponse.json({
      title,
      content: content.substring(0, 4000), // Limit to ~4000 chars
      url,
    })
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch content: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
