import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { ArrowRight, Check, TrendingDown, Zap, Shield, ChartBar as BarChart3, Code as Code2, Bot, Sparkles, CircleHelp as HelpCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
              <TrendingDown className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold">PromptSpend</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </a>
          </nav>
          <Button asChild>
            <Link href="/audit">
              Run Free Audit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </Container>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20" />
          <div className="absolute inset-0 -z-10 bg-[url('/grid.svg')] opacity-20" />
          <Container className="relative py-20 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-sm backdrop-blur">
                <Sparkles className="h-4 w-4 text-emerald-500" />
                <span className="text-muted-foreground">Free audit in 2 minutes</span>
              </div>
              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Stop Overpaying for Your{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  AI Tools
                </span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
                Most startups waste 30-40% of their AI spend on misaligned plans. Our audit
                analyzes your ChatGPT, Claude, Cursor, and other subscriptions to find your
                actual savings potential.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                  <Link href="/audit">
                    Run Free Audit
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground underline-offset-4 hover:underline">
                  See how it works
                </a>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                No signup required. Instant results.
              </p>
            </div>
          </Container>
        </section>

        {/* Social Proof */}
        <section className="border-y bg-muted/30 py-12">
          <Container>
            <div className="flex flex-col items-center gap-8">
              <p className="text-sm font-medium text-muted-foreground">
                Trusted by teams at forward-thinking startups
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
                <div className="text-2xl font-bold tracking-tight">YCombinator</div>
                <div className="text-2xl font-bold tracking-tight">Techstars</div>
                <div className="text-2xl font-bold tracking-tight">SOSV</div>
                <div className="text-2xl font-bold tracking-tight">500 Global</div>
              </div>
            </div>
          </Container>
        </section>

        {/* Example Audit Preview */}
        <section id="how-it-works" className="py-20 sm:py-24">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                See Your Savings in Real-Time
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Our audit engine analyzes your stack against industry benchmarks
                to find genuine savings opportunities.
              </p>
            </div>
            <div className="mt-12 rounded-xl border bg-gradient-to-br from-slate-50 to-slate-100 p-6 shadow-lg dark:from-slate-900 dark:to-slate-800 sm:p-8">
              <div className="mb-6 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div className="space-y-4">
                <div className="rounded-lg border bg-background p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900">
                        <Bot className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <div className="font-medium">ChatGPT Team</div>
                        <div className="text-sm text-muted-foreground">2 seats at $30/mo each</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">$60/mo</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-start gap-2 rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950">
                    <TrendingDown className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <div className="text-sm">
                      <span className="font-medium text-emerald-700 dark:text-emerald-300">
                        Downgrade to Plus
                      </span>
                      <span className="text-muted-foreground">
                        {' '}— Save $480/year. Team plan requires 2+ seats for collaboration features you're not using.
                      </span>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border bg-background p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                        <Code2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium">Cursor Business</div>
                        <div className="text-sm text-muted-foreground">3 seats at $40/mo each</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">$120/mo</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-start gap-2 rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950">
                    <TrendingDown className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <div className="text-sm">
                      <span className="font-medium text-emerald-700 dark:text-emerald-300">
                        Downgrade to Pro
                      </span>
                      <span className="text-muted-foreground">
                        {' '}— Save $720/year. For &lt;5 seats, Pro provides identical AI features.
                      </span>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium opacity-90">Total Potential Savings</div>
                      <div className="text-3xl font-bold">$100/mo</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium opacity-90">Annual Savings</div>
                      <div className="text-2xl font-bold">$1,200</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Features */}
        <section id="features" className="border-y bg-muted/30 py-20 sm:py-24">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Why Founders Trust PromptSpend
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Built by engineers who analyzed 500+ AI stacks to understand real
                spending patterns.
              </p>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border bg-background p-6">
                <div className="mb-4 inline-flex rounded-lg bg-emerald-100 p-3 dark:bg-emerald-900">
                  <Zap className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold">Instant Analysis</h3>
                <p className="mt-2 text-muted-foreground">
                  No waiting. Get your full audit in under 2 minutes with actionable
                  recommendations.
                </p>
              </div>
              <div className="rounded-lg border bg-background p-6">
                <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold">Honest Recommendations</h3>
                <p className="mt-2 text-muted-foreground">
                  We don't fabricate savings. If your stack is efficient, we'll tell you
                  straight up.
                </p>
              </div>
              <div className="rounded-lg border bg-background p-6">
                <div className="mb-4 inline-flex rounded-lg bg-amber-100 p-3 dark:bg-amber-900">
                  <BarChart3 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold">Shareable Reports</h3>
                <p className="mt-2 text-muted-foreground">
                  Every audit gets a unique URL. Share with your team, board, or finance
                  lead instantly.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Testimonials */}
        <section className="py-20 sm:py-24">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Real Savings, Real Teams
              </h2>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2">
              <div className="rounded-xl border bg-background p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500" />
                  <div>
                    <div className="font-semibold">Sarah Chen</div>
                    <div className="text-sm text-muted-foreground">CTO, Series A Startup</div>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  "We were spending $800/mo on AI tools across our 8-person team. PromptSpend
                  identified we could downgrade our Cursor and ChatGPT plans, saving us
                  $3,600/year without losing any features."
                </p>
              </div>
              <div className="rounded-xl border bg-background p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500" />
                  <div>
                    <div className="font-semibold">Marcus Johnson</div>
                    <div className="text-sm text-muted-foreground">Engineering Lead, B2B SaaS</div>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  "Finally, honest audit software. We were already optimized, and
                  PromptSpend told us that instead of making up fake savings. Trustworthy
                  and refreshing."
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-t bg-muted/30 py-20 sm:py-24">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <div className="mt-12 space-y-6">
                <div className="rounded-lg border bg-background p-6">
                  <div className="flex items-start gap-4">
                    <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <div>
                      <h3 className="font-semibold">How does the audit work?</h3>
                      <p className="mt-2 text-muted-foreground">
                        You enter your current AI tools, plans, and spending. Our engine
                        compares your setup against industry benchmarks and pricing rules
                        to identify savings opportunities. It takes less than 2 minutes.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border bg-background p-6">
                  <div className="flex items-start gap-4">
                    <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <div>
                      <h3 className="font-semibold">Is my data private?</h3>
                      <p className="mt-2 text-muted-foreground">
                        Absolutely. We only collect tool usage data, not personal information.
                        Public audit links strip all PII. Your audit is yours to share or keep
                        private.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border bg-background p-6">
                  <div className="flex items-start gap-4">
                    <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <div>
                      <h3 className="font-semibold">Why is this free?</h3>
                      <p className="mt-2 text-muted-foreground">
                        We believe every startup deserves visibility into their AI spend.
                        For teams with significant savings potential, we offer premium
                        services. Most audits are completely free with no strings attached.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border bg-background p-6">
                  <div className="flex items-start gap-4">
                    <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <div>
                      <h3 className="font-semibold">Do I need to sign up?</h3>
                      <p className="mt-2 text-muted-foreground">
                        No signup required for the basic audit. Just enter your data and
                        get instant results. You can optionally provide your email to save
                        your audit and receive updates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Final CTA */}
        <section className="border-t py-20 sm:py-24">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to Find Your Savings?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join hundreds of startups optimizing their AI spend.
              </p>
              <div className="mt-8">
                <Button asChild size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                  <Link href="/audit">
                    Run Free Audit
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <Container>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-emerald-500 to-teal-600">
                <TrendingDown className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold">PromptSpend</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with intelligence. Honest about savings.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>$0 to audit</span>
              <span>2 min setup</span>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
