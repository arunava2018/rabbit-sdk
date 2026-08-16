import Link from "next/link"
import {
  ArrowRight, Brain, Network, ShieldCheck, Zap,
  Globe, Gauge, Radio, Wrench, ChevronDown, CheckCircle2, Workflow, Code2, Bot
} from "lucide-react"
import { InstallCommand } from "@/components/install-command"
import { HeroCodeTabs } from "@/components/hero-code-tabs"

async function getPackageVersion() {
  try {
    const res = await fetch("https://registry.npmjs.org/@rabbit-agent-sdk/rabbit-agent-sdk", {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return "0.1.0"
    const data = await res.json()
    return data["dist-tags"]?.latest || "0.1.0"
  } catch (e) {
    return "0.1.0"
  }
}

const features = [
  { icon: Network, title: "Provider Agnostic", desc: "Swap between OpenAI, Groq, Gemini, Anthropic with a single line change.", color: "text-blue-400", bg: "bg-blue-500/10" },
  { icon: Brain, title: "Built-in Memory", desc: "Automatic conversational history management with BufferMemory or custom backends.", color: "text-purple-400", bg: "bg-purple-500/10" },
  { icon: Wrench, title: "Zod-Powered Tools", desc: "Define tools with zod schemas — automatic JSON Schema conversion and runtime validation.", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { icon: ShieldCheck, title: "Safety Guardrails", desc: "8 built-in guardrails for PII, profanity, prompt injection, tone enforcement, and more.", color: "text-rose-400", bg: "bg-rose-500/10" },
  { icon: Zap, title: "Provider Fallbacks", desc: "Self-healing agent loops with automatic fallback to backup providers on failure.", color: "text-yellow-400", bg: "bg-yellow-500/10" },
  { icon: Radio, title: "Streaming", desc: "First-class support for streaming responses via async generators.", color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { icon: Globe, title: "Built-in Toolkit", desc: "Pre-built FetchTool and WebSearchTool ready to use out of the box.", color: "text-orange-400", bg: "bg-orange-500/10" },
  { icon: Gauge, title: "Budget Control", desc: "maxSteps limiter prevents infinite agentic loops from running away.", color: "text-pink-400", bg: "bg-pink-500/10" },
]

const faqs = [
  { q: "Is the SDK tied to a specific framework?", a: "No, Rabbit SDK is a pure TypeScript library. You can use it in Next.js, Express, Fastify, NestJS, or even a simple Node script." },
  { q: "Does it support streaming?", a: "Yes! Streaming is natively supported via async generators, making it trivial to build real-time UI typing effects." },
  { q: "How do guardrails work?", a: "Guardrails intercept the LLM input and output. If a guardrail (like PII detection) fails, it can either throw an error or automatically retry the LLM with a correction prompt." },
  { q: "Can I bring my own LLM?", a: "Absolutely. You can build a Custom Provider by implementing a simple interface, allowing you to connect to local models like Ollama or vLLM." },
]

export default async function Home() {
  const version = await getPackageVersion()

  return (
    <div className="min-h-screen selection:bg-blue-500/30">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 lg:pb-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[calc(100vh-12rem)] lg:min-h-[calc(100vh-10rem)]">

            {/* Left — text */}
            <div className="flex flex-col gap-6 sm:gap-8">
              <Link
                href="https://github.com/arunava2018/rabbit-agent-sdk"
                target="_blank"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-muted/40 backdrop-blur-md px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/80 transition-colors shadow-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                v{version} — Open source on GitHub
              </Link>

              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] text-foreground">
                  Build agents<br />
                  you can trust{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500">
                    in production.
                  </span>
                </h1>
                <p className="mt-5 text-muted-foreground text-base sm:text-lg leading-relaxed max-w-[480px]">
                  Type-safe tools. Provider-agnostic design. Real guardrails.
                  <br className="hidden sm:block" />
                  No framework bloat — just{" "}
                  <code className="text-foreground bg-muted border border-border rounded px-1.5 py-0.5 text-sm font-mono shadow-sm">TypeScript</code>{" "}
                  and{" "}
                  <code className="text-foreground bg-muted border border-border rounded px-1.5 py-0.5 text-sm font-mono shadow-sm">Zod</code>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href="/docs/getting-started/introduction"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-foreground text-background px-8 text-sm font-semibold transition-all hover:bg-foreground/90 hover:shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 active:translate-y-0 border border-foreground/10"
                >
                  <span className="font-bold">Read the docs</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <InstallCommand />
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-4 sm:gap-8 pt-6 border-t border-border/60">
                {[
                  { val: "< 50kb", label: "gzipped" },
                  { val: "MIT", label: "License" },
                  { val: `v${version}`, label: "Stable" },
                  { val: "4", label: "Providers" },
                ].map(({ val, label }) => (
                  <div key={label}>
                    <p className="text-sm sm:text-base font-bold text-foreground">{val}</p>
                    <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 font-medium uppercase tracking-wider">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — code block */}
            <div className="w-full max-w-full overflow-hidden">
              <HeroCodeTabs />
            </div>

          </div>
        </div>
      </section>

      {/* ── LOGOS ── */}
      <section className="border-y border-border/50 bg-muted/20 py-8">
        <div className="container mx-auto px-6 lg:px-10">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
            Supported Language Models Out of the Box
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Replace with actual SVG logos if available, using text for now */}
            <span className="text-xl font-bold tracking-tighter">OpenAI</span>
            <span className="text-xl font-bold tracking-tighter text-orange-500">Groq</span>
            <span className="text-xl font-bold tracking-tighter text-blue-500">Google Gemini</span>
            <span className="text-xl font-bold tracking-tighter text-amber-700">Anthropic Claude</span>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS (TIMELINE) ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-10 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">The Agent Loop, Demystified</h2>
            <p className="text-muted-foreground text-lg">Rabbit SDK handles the complex lifecycle of tool execution and validation automatically.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-8 left-12 right-12 h-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20" />
            
            {[
              { title: "1. Input", icon: Bot, color: "text-blue-500", bg: "bg-blue-500/10", desc: "User prompt and context are passed to the agent." },
              { title: "2. Validation", icon: ShieldCheck, color: "text-purple-500", bg: "bg-purple-500/10", desc: "Input guardrails check for PII, secrets, or prompt injection." },
              { title: "3. Execution", icon: Workflow, color: "text-orange-500", bg: "bg-orange-500/10", desc: "LLM determines if tools are needed. SDK auto-executes Zod tools." },
              { title: "4. Output", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", desc: "Output guardrails verify the final response before sending it back." },
            ].map((step, i) => (
              <div key={i} className="relative bg-card border border-border/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className={`${step.bg} ${step.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 relative z-10 mx-auto md:mx-0`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center md:text-left">{step.title}</h3>
                <p className="text-sm text-muted-foreground text-center md:text-left">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEEP DIVES ── */}
      <section className="py-24 bg-muted/10 border-y border-border/50">
        <div className="container mx-auto px-6 lg:px-10 flex flex-col gap-24">
          
          {/* Row 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-6">
                <Code2 className="w-3.5 h-3.5 mr-1.5" /> Type-Safe
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">Zod as a First-Class Citizen</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Stop writing verbose JSON Schemas by hand. Define your tools using Zod, and the SDK automatically converts them for the LLM, handles runtime validation, and provides strict TypeScript types for your execute functions.
              </p>
              <ul className="space-y-3">
                {['Automatic JSON Schema generation', 'Runtime argument validation', 'Self-healing tool retries on bad JSON'].map(item => (
                  <li key={item} className="flex items-center text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative rounded-xl border border-[#2a2a2a] bg-[#0d1117] p-6 shadow-2xl overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
              <pre className="text-[13px] font-mono leading-relaxed text-[#c9d1d9] overflow-x-auto">
<span className="text-[#f47067]">const</span> <span className="text-[#6cb6ff]">schema</span> <span className="text-[#f47067]">=</span> z.object(&#123;{"\n"}
{"  "}email: z.string().email(),{"\n"}
{"  "}count: z.number().min(<span className="text-[#96d0ff]">1</span>),{"\n"}
&#125;);{"\n\n"}
<span className="text-[#636e7b]">// The SDK passes this to OpenAI:</span>{"\n"}
<span className="text-[#636e7b]">// &#123; type: "object", properties: ... &#125;</span>{"\n"}
              </pre>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative rounded-xl border border-[#2a2a2a] bg-[#0d1117] p-6 shadow-2xl overflow-hidden">
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
              <pre className="text-[13px] font-mono leading-relaxed text-[#c9d1d9] overflow-x-auto">
<span className="text-[#f47067]">const</span> <span className="text-[#6cb6ff]">agent</span> <span className="text-[#f47067]">=</span> <span className="text-[#f47067]">new</span> <span className="text-[#dcbdfb]">Agent</span>(&#123;{"\n"}
{"  "}provider: <span className="text-[#f47067]">new</span> <span className="text-[#dcbdfb]">AnthropicProvider</span>(),{"\n"}
{"  "}fallbackProviders: [{"\n"}
{"    "}<span className="text-[#f47067]">new</span> <span className="text-[#dcbdfb]">OpenAIProvider</span>(),{"\n"}
{"    "}<span className="text-[#f47067]">new</span> <span className="text-[#dcbdfb]">GroqProvider</span>(){"\n"}
{"  "}]{"\n"}
&#125;);
              </pre>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-6">
                <Network className="w-3.5 h-3.5 mr-1.5" /> Provider Agnostic
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">Write Once, Run Anywhere</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Never get locked into a single AI provider again. Rabbit SDK abstracts the differences between OpenAI, Anthropic, Groq, and Gemini tool-calling formats into a single, unified interface.
              </p>
              <ul className="space-y-3">
                {['Unified tool execution interface', 'Automatic format translation', 'Seamless fallback cascades on rate limits'].map(item => (
                  <li key={item} className="flex items-center text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-blue-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">Everything you need</h2>
            <p className="text-muted-foreground">Built from the ground up for production reliability without the bloat.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, desc, color, bg }) => (
              <div
                key={title}
                className="group relative rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md p-6 hover:bg-accent/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`mb-4 inline-flex p-2.5 rounded-xl ${bg} ${color} group-hover:scale-110 transition-transform`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-[15px] font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 bg-muted/10 border-y border-border/50">
        <div className="container mx-auto px-6 lg:px-10 max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group border border-border/50 bg-card rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-5 font-semibold hover:bg-accent/30 transition-colors">
                  {faq.q}
                  <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-open:-rotate-180" />
                </summary>
                <div className="px-6 pb-5 pt-1 text-muted-foreground leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-foreground dark:bg-[#0a0a0a] z-0" />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-emerald-600/20 z-0 opacity-50" />
        <div className="container mx-auto px-6 lg:px-10 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto py-12 px-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">Ready to build better agents?</h2>
            <p className="text-white/70 mb-8 text-lg">Start building with the most developer-friendly Agent SDK in under 3 minutes.</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/docs/getting-started/quick-start"
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-lg bg-white text-black px-8 text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <div className="flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-black/40 px-6 py-3 text-sm font-mono text-white">
                <span className="text-emerald-400 select-none">$</span>
                npm i @rabbit-agent-sdk/rabbit-agent-sdk
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
