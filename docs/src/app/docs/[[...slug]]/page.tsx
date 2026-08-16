import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { getDocBySlug, extractHeadings } from "@/lib/mdx"
import { components } from "@/components/mdx-components"
import { Metadata } from "next"
import { DocPager } from "@/components/doc-pager"
import { TableOfContents } from "@/components/toc"
import rehypePrettyCode from "rehype-pretty-code"
import type { Options as RehypePrettyCodeOptions } from "rehype-pretty-code"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"

interface DocPageProps {
  params: Promise<{
    slug?: string[]
  }>
}

export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams.slug || ["getting-started", "introduction"]
  const doc = await getDocBySlug(slug)
  if (!doc) return {}
  return {
    title: `${doc.meta.title || "Docs"} — Rabbit Agent SDK`,
    description: doc.meta.description,
  }
}

const prettyCodeOptions: RehypePrettyCodeOptions = {
  // Use dual theme: github-dark-dimmed in dark, github-light in light
  theme: {
    dark: "github-dark-dimmed",
    light: "github-light",
  },
  keepBackground: false,
}

function getSectionLabel(slug: string[]): string {
  const section = slug[0] ?? ""
  const map: Record<string, string> = {
    "getting-started": "Getting Started",
    "core-concepts": "Core Concepts",
    "features": "Features",
    "advanced": "Advanced",
  }
  return map[section] ?? "Docs"
}

export default async function DocPage({ params }: DocPageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug || ["getting-started", "introduction"]
  const doc = await getDocBySlug(slug)

  if (!doc) notFound()

  const headings = extractHeadings(doc.content)
  const sectionLabel = getSectionLabel(slug)

  return (
    <>
      {/* Main content column */}
      <div className="min-w-0 max-w-3xl">
        {/* Section breadcrumb — matches reference "GETTING STARTED" label */}
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-blue-500">
          {sectionLabel}
        </p>

        {/* Page title */}
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight mb-3">
          {doc.meta.title}
        </h1>

        {doc.meta.description && (
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed border-b border-border pb-8">
            {doc.meta.description}
          </p>
        )}

        {/* MDX content */}
        <article className="prose prose-slate dark:prose-invert max-w-none
          prose-headings:scroll-m-20
          prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8
          prose-p:text-[15px] prose-p:leading-7
          prose-li:text-[15px]
          prose-a:text-blue-500 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-foreground
          prose-code:before:content-none prose-code:after:content-none
        ">
          <MDXRemote
            source={doc.content}
            components={components}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug, [rehypePrettyCode as any, prettyCodeOptions]],
              },
            }}
          />
        </article>

        <DocPager />
      </div>

      {/* TOC column */}
      {headings.length > 0 && (
        <div className="hidden xl:block">
          <div className="sticky top-20">
            <TableOfContents headings={headings} />
          </div>
        </div>
      )}
    </>
  )
}
