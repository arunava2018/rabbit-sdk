import fs from "fs"
import path from "path"
import matter from "gray-matter"

const docsDirectory = path.join(process.cwd(), "content/docs")

export async function getDocBySlug(slug: string[]) {
  const realSlug = slug.join("/")
  const fullPath = path.join(docsDirectory, `${realSlug}.mdx`)
  
  if (!fs.existsSync(fullPath)) {
    return null
  }
  
  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(fileContents)
  
  return {
    slug: realSlug,
    meta: data,
    content,
  }
}

/**
 * Extract headings from raw MDX content for table of contents.
 * Returns h2 and h3 headings with their text and generated IDs.
 */
export function extractHeadings(content: string): { level: number; text: string; id: string }[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const headings: { level: number; text: string; id: string }[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")

    headings.push({ level, text, id })
  }

  return headings
}
