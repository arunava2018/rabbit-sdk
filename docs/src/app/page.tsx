import Link from "next/link"
import {
  ArrowRight, Brain, Network, ShieldCheck, Zap,
  Globe, Gauge, Radio, Wrench, ChevronDown, CheckCircle2, Workflow, Code2, Bot,
  Activity, GitBranch, MessageSquareQuote
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
  { icon: Network, title: "Provider Agnostic", desc: "Swap between OpenAI, Groq, Gemini, Anthropic with a single line change.", color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: Brain, title: "Built-in Memory", desc: "Automatic conversational history management with BufferMemory or custom backends.", color: "text-purple-500", bg: "bg-purple-500/10" },
  { icon: Wrench, title: "Zod-Powered Tools", desc: "Define tools with zod schemas — automatic JSON Schema conversion and runtime validation.", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { icon: ShieldCheck, title: "Safety Guardrails", desc: "8 built-in guardrails for PII, profanity, prompt injection, tone enforcement, and more.", color: "text-rose-500", bg: "bg-rose-500/10" },
  { icon: Zap, title: "Provider Fallbacks", desc: "Self-healing agent loops with automatic fallback to backup providers on failure.", color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { icon: Radio, title: "Streaming", desc: "First-class support for streaming responses via async generators.", color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { icon: Globe, title: "Built-in Toolkit", desc: "Pre-built FetchTool and WebSearchTool ready to use out of the box.", color: "text-orange-500", bg: "bg-orange-500/10" },
  { icon: Gauge, title: "Budget Control", desc: "maxSteps limiter prevents infinite agentic loops from running away.", color: "text-pink-500", bg: "bg-pink-500/10" },
  { icon: Activity, title: "Tracing & Reliability", desc: "Detailed lifecycle event tracing for tokens, tools, memory, handoffs, and errors.", color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { icon: GitBranch, title: "Agent Handoffs", desc: "Graceful multi-agent delegation via the secure HandoffResult pattern.", color: "text-teal-500", bg: "bg-teal-500/10" },
]

const faqs = [
  { q: "Is the SDK tied to a specific framework?", a: "No, Rabbit SDK is a pure TypeScript library. You can use it in Next.js, Express, Fastify, NestJS, or even a simple Node script." },
  { q: "Does it support streaming?", a: "Yes! Streaming is natively supported via async generators, making it trivial to build real-time UI typing effects." },
  { q: "How do guardrails work?", a: "Guardrails intercept the LLM input and output. If a guardrail (like PII detection) fails, it can either throw an error or automatically retry the LLM with a correction prompt." },
  { q: "Can I bring my own LLM?", a: "Absolutely. You can build a Custom Provider by implementing a simple interface, allowing you to connect to local models like Ollama or vLLM." },
  { q: "Is this production ready?", a: "Yes. With features like provider fallbacks, maxStep budget controls, and automatic Zod retries, it's built specifically for the reliability needed in production environments." },
  { q: "How does Agent Handoff prevent infinite loops?", a: "Handoffs use an error-bubbling pattern. When an agent hands off, it instantly pauses execution and yields a HandoffResult back to your main orchestrator, avoiding recursive deep-stack loops." },
  { q: "Can I trace the agent's behavior?", a: "Yes, the built-in Tracer captures all lifecycle events including token usage, memory reads/writes, tool execution times, and LLM latency." },
]

export default async function Home() {
  const version = await getPackageVersion()

  return (
    <div className="min-h-screen selection:bg-primary/20">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-16 md:pt-24 pb-16 lg:pb-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[calc(100vh-12rem)] lg:min-h-[calc(100vh-10rem)]">

            {/* Left — text */}
            <div className="flex flex-col gap-6 sm:gap-8">
              <Link
                href="https://github.com/arunava2018/rabbit-sdk"
                target="_blank"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-muted/40 backdrop-blur-md px-3 py-1 text-[13px] font-medium text-muted-foreground hover:bg-muted/80 transition-colors shadow-sm"
              >
                Rabbit SDK v{version} — Open source on GitHub
              </Link>

              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] text-foreground">
                  Build agents<br />
                  you can trust <i className="font-serif italic text-muted-foreground/80">in production.</i>
                </h1>
                <p className="mt-6 text-muted-foreground text-base sm:text-lg leading-relaxed max-w-[480px]">
                  Type-safe tools. Provider-agnostic design. Real guardrails.
                  <br className="hidden sm:block" />
                  No framework bloat — just{" "}
                  <code className="text-foreground bg-muted border border-border rounded px-1.5 py-0.5 text-sm font-mono">TypeScript</code>{" "}
                  and{" "}
                  <code className="text-foreground bg-muted border border-border rounded px-1.5 py-0.5 text-sm font-mono">Zod</code>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-2">
                <Link
                  href="/docs/getting-started/introduction"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-foreground text-background px-8 text-sm font-semibold transition-transform hover:-translate-y-0.5 shadow-sm"
                >
                  Read the docs
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <InstallCommand />
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-4 sm:gap-8 pt-8 border-t border-border/60">
                {[
                  { val: "< 50kb", label: "gzipped" },
                  { val: "MIT", label: "License" },
                  { val: `v${version}`, label: "Stable" },
                  { val: "4+", label: "Providers" },
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
      <section className="border-y border-border/50 bg-muted/20 py-10">
        <div className="container mx-auto px-6 lg:px-10">
          <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-8">
            Supported Language Models Out of the Box
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-xl font-bold tracking-tighter">OpenAI</span>
            <span className="text-xl font-bold tracking-tighter text-orange-500">Groq</span>
            <span className="text-xl font-bold tracking-tighter text-blue-500">Google Gemini</span>
            <span className="text-xl font-bold tracking-tighter text-amber-700">Anthropic</span>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS (TIMELINE) ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-10 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">The Agent Loop, Demystified</h2>
            <p className="text-muted-foreground text-lg">Rabbit SDK handles the complex lifecycle of tool execution and validation automatically.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-8 left-12 right-12 h-px bg-border" />
            
            {[
              { title: "1. Input", icon: Bot, color: "text-blue-500", bg: "bg-blue-500/10", desc: "User prompt and context are passed to the agent." },
              { title: "2. Validation", icon: ShieldCheck, color: "text-purple-500", bg: "bg-purple-500/10", desc: "Input guardrails check for PII, secrets, or prompt injection." },
              { title: "3. Execution", icon: Workflow, color: "text-orange-500", bg: "bg-orange-500/10", desc: "LLM determines if tools are needed. SDK auto-executes Zod tools." },
              { title: "4. Output", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", desc: "Output guardrails verify the final response before sending it back." },
            ].map((step, i) => (
              <div key={i} className="relative bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className={`${step.bg} ${step.color} w-12 h-12 rounded-lg flex items-center justify-center mb-5 relative z-10 mx-auto md:mx-0`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="text-[17px] font-semibold mb-2 text-center md:text-left">{step.title}</h3>
                <p className="text-[14px] text-muted-foreground text-center md:text-left leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEEP DIVES ── */}
      <section className="py-24 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-6 lg:px-10 flex flex-col gap-28">
          
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
            <div className="relative rounded-xl border border-border bg-card p-6 shadow-xl overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
              <pre className="text-[13px] font-mono leading-relaxed overflow-x-auto">
<span className="text-rose-400">const</span> <span className="text-blue-400">schema</span> <span className="text-rose-400">=</span> z.object(&#123;{"\n"}
{"  "}email: z.string().email(),{"\n"}
{"  "}count: z.number().min(<span className="text-emerald-400">1</span>),{"\n"}
&#125;);{"\n\n"}
<span className="text-muted-foreground">// The SDK passes this to OpenAI:</span>{"\n"}
<span className="text-muted-foreground">// &#123; type: "object", properties: ... &#125;</span>{"\n"}
              </pre>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative rounded-xl border border-border bg-card p-6 shadow-xl overflow-hidden">
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
              <pre className="text-[13px] font-mono leading-relaxed overflow-x-auto">
<span className="text-rose-400">const</span> <span className="text-blue-400">agent</span> <span className="text-rose-400">=</span> <span className="text-rose-400">new</span> <span className="text-purple-400">Agent</span>(&#123;{"\n"}
{"  "}provider: <span className="text-rose-400">new</span> <span className="text-purple-400">AnthropicProvider</span>(),{"\n"}
{"  "}fallbackProviders: [{"\n"}
{"    "}<span className="text-rose-400">new</span> <span className="text-purple-400">OpenAIProvider</span>(),{"\n"}
{"    "}<span className="text-rose-400">new</span> <span className="text-purple-400">GroqProvider</span>(){"\n"}
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

          {/* Row 3 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-600 dark:text-teal-400 mb-6">
                <GitBranch className="w-3.5 h-3.5 mr-1.5" /> Agent Handoffs
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">Graceful Delegation without Infinite Loops</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Build robust multi-agent swarms safely. Instead of letting agents call each other recursively, Rabbit SDK uses error bubbling to yield execution back to your application orchestrator.
              </p>
              <ul className="space-y-3">
                {['No more infinite agent execution loops', 'Retain full control in your application layer', 'Secure, sandboxed contexts for each agent'].map(item => (
                  <li key={item} className="flex items-center text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-teal-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative rounded-xl border border-border bg-card p-6 shadow-xl overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-teal-500/10 blur-3xl rounded-full pointer-events-none" />
              <pre className="text-[13px] font-mono leading-relaxed overflow-x-auto">
<span className="text-muted-foreground">// The agent stops and returns a HandoffResult</span>{"\n"}
<span className="text-rose-400">const</span> <span className="text-blue-400">result</span> <span className="text-rose-400">=</span> <span className="text-purple-400">await</span> agent.run(<span className="text-emerald-400">"Contact support."</span>);{"\n\n"}
<span className="text-rose-400">if</span> (result.type <span className="text-rose-400">===</span> <span className="text-emerald-400">"handoff"</span>) &#123;{"\n"}
{"  "}<span className="text-blue-400">console</span>.log(<span className="text-emerald-400">`Handing off to $&#123;result.targetAgent&#125;`</span>);{"\n"}
{"  "}<span className="text-purple-400">await</span> supportAgent.run(result.context);{"\n"}
&#125;
              </pre>
            </div>
          </div>

        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">Everything you need</h2>
            <p className="text-muted-foreground text-lg">Built from the ground up for production reliability without the bloat.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {features.map(({ icon: Icon, title, desc, color, bg }) => (
              <div
                key={title}
                className="group relative rounded-xl border border-border/60 bg-card p-5 hover:border-border hover:shadow-sm transition-all duration-300"
              >
                <div className={`mb-4 inline-flex p-2.5 rounded-lg ${bg} ${color} group-hover:scale-105 transition-transform`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-[15px] font-semibold text-foreground mb-1.5">{title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEVELOPER FEEDBACK ── */}
      <section className="py-24 bg-muted/30 border-y border-border/50 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-10 mb-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Loved by Developers</h2>
            <p className="text-muted-foreground text-lg">Rabbit SDK focuses on Developer Experience above all else.</p>
          </div>
        </div>
        
        {/* Marquee Container */}
        <div className="relative w-full overflow-hidden flex [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max min-w-full animate-marquee items-center gap-6 px-4">
            {[
              { text: "Finally an agent framework that doesn't feel like a black box. The tracing capability alone saved us weeks of debugging.", author: "Senior AI Engineer" },
              { text: "The Zod integration is flawless. We just define our schemas and the SDK handles everything from JSON generation to validation retries.", author: "Lead Developer" },
              { text: "Provider fallbacks are a game changer. When OpenAI goes down, our agents smoothly switch to Anthropic without missing a beat.", author: "Startup Founder" },
              { text: "I've tried LangChain and others, but Rabbit SDK is the only one that feels like writing real TypeScript instead of fighting abstractions.", author: "Full Stack Dev" },
              { text: "Agent Handoffs finally make building swarms actually possible without stack overflow errors. Incredible work.", author: "AI Architect" },
              { text: "The memory management is so clean. Building stateful chatbots has never been this easy and predictable.", author: "Software Engineer" },
              // Duplicate the list to make the infinite loop seamless
              { text: "Finally an agent framework that doesn't feel like a black box. The tracing capability alone saved us weeks of debugging.", author: "Senior AI Engineer" },
              { text: "The Zod integration is flawless. We just define our schemas and the SDK handles everything from JSON generation to validation retries.", author: "Lead Developer" },
              { text: "Provider fallbacks are a game changer. When OpenAI goes down, our agents smoothly switch to Anthropic without missing a beat.", author: "Startup Founder" },
              { text: "I've tried LangChain and others, but Rabbit SDK is the only one that feels like writing real TypeScript instead of fighting abstractions.", author: "Full Stack Dev" },
              { text: "Agent Handoffs finally make building swarms actually possible without stack overflow errors. Incredible work.", author: "AI Architect" },
              { text: "The memory management is so clean. Building stateful chatbots has never been this easy and predictable.", author: "Software Engineer" },
            ].map((testimonial, i) => (
              <div key={i} className="w-[350px] shrink-0 bg-background rounded-xl p-6 border border-border shadow-sm flex flex-col justify-between">
                <div>
                  <MessageSquareQuote className="w-8 h-8 text-muted-foreground/30 mb-4" />
                  <p className="text-foreground leading-relaxed mb-6">"{testimonial.text}"</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">Rabbit SDK User</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-10 max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group border border-border bg-card rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-5 font-semibold hover:bg-muted/50 transition-colors">
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
      <section className="py-24 relative overflow-hidden bg-background">
        <div className="container mx-auto px-6 lg:px-10 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto py-16 px-6 rounded-3xl border border-border bg-card shadow-lg">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">Ready to build better agents?</h2>
            <p className="text-muted-foreground mb-8 text-lg max-w-[500px]">Start building with the most developer-friendly Agent SDK in under 3 minutes.</p>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                href="/docs/getting-started/quick-start"
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-lg bg-primary text-primary-foreground px-8 text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-muted/50 px-6 py-3 text-sm font-mono text-foreground shadow-sm">
                <span className="text-emerald-500 select-none">$</span>
                npm i @rabbit-agent-sdk/rabbit-agent-sdk
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
