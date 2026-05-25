'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { TrendingDown, Copy, Check, Share2, Download, Code as Code2, GitBranch, MessageSquare, Bot, Cpu, Zap, Sparkles, Wind, ArrowRight, ArrowLeft, Loader as Loader2, Chrome as Home } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadFormSchema } from '@/lib/validations';
import { supabase } from '@/lib/db/supabase';
import { toast } from 'sonner';
import type { AuditResult, LeadFormData, Recommendation } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const providerIcons: Record<string, React.ElementType> = {
  cursor: Code2,
  'github-copilot': GitBranch,
  claude: MessageSquare,
  chatgpt: Bot,
  'anthropic-api': Cpu,
  'openai-api': Zap,
  gemini: Sparkles,
  windsurf: Wind,
};

const actionLabels: Record<string, string> = {
  downgrade: 'Downgrade',
  upgrade: 'Upgrade',
  switch: 'Switch',
  optimize: 'Optimize',
  none: 'No Change',
};

const actionColors: Record<string, string> = {
  downgrade: 'text-emerald-600 dark:text-emerald-400',
  upgrade: 'text-blue-600 dark:text-blue-400',
  switch: 'text-amber-600 dark:text-amber-400',
  optimize: 'text-purple-600 dark:text-purple-400',
  none: 'text-muted-foreground',
};

interface AuditResultContentProps {
  audit: AuditResult;
}

export function AuditResultContent({ audit }: AuditResultContentProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCredex, setShowCredex] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      email: '',
      companyName: '',
      role: '',
      teamSize: audit.formData.teamSize,
      honeypot: '',
    },
  });

  useEffect(() => {
    if (audit.totalMonthlySavings > 500) {
      setShowCredex(true);
    }
  }, [audit.totalMonthlySavings]);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/audit/${audit.slug}`
    : '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const onLeadSubmit = async (data: LeadFormData) => {
    if (data.honeypot) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          companyName: data.companyName,
          role: data.role,
          teamSize: data.teamSize,
          auditId: audit.id,
          honeypot: data.honeypot,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      toast.success('Audit saved! You\'ll receive optimization alerts.', {
        duration: 5000,
      });
      setShowLeadForm(false);
      setLeadSubmitted(true);
    } catch (err) {
      console.error('Failed to save lead:', err);
      toast.error('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const savingsRecommendations = audit.recommendations.filter((r) => r.monthlySavings > 0);
  const noChangeRecommendations = audit.recommendations.filter((r) => r.monthlySavings === 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Savings Card */}
        <Card className="mb-8 overflow-hidden">
          {audit.totalMonthlySavings >= 50 ? (
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white sm:p-12">
              <div className="mx-auto max-w-3xl text-center">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm">
                  <TrendingDown className="h-4 w-4" />
                  Potential Savings
                </div>
                <div className="mt-6 text-5xl font-bold sm:text-6xl">
                  ${Math.round(audit.totalMonthlySavings).toLocaleString()}/mo
                </div>
                <div className="mt-3 text-xl opacity-90">
                  ${Math.round(audit.totalAnnualSavings).toLocaleString()}/year
                </div>
                <p className="mt-6 text-lg opacity-80">
                  Based on your current AI spend, we found {savingsRecommendations.length} optimization{' '}
                  {savingsRecommendations.length === 1 ? 'opportunity' : 'opportunities'}.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white sm:p-12">
              <div className="mx-auto max-w-3xl text-center">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm">
                  <Check className="h-4 w-4" />
                  Already Optimized
                </div>
                <div className="mt-6 text-5xl font-bold sm:text-6xl">
                  Great Stack!
                </div>
                <p className="mt-6 text-lg opacity-80">
                  Your AI spend looks efficient. We found only ${Math.round(audit.totalMonthlySavings)}/mo in savings potential.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* AI Summary */}
        {audit.aiSummary && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{audit.aiSummary}</p>
            </CardContent>
          </Card>
        )}

        {/* Credex CTA for High Savings */}
        {showCredex && (
          <Card className="mb-8 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:border-amber-800 dark:from-amber-950 dark:to-orange-950">
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Maximize Your Savings</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    With ${Math.round(audit.totalAnnualSavings).toLocaleString()}/year potential, book a free consultation
                    to explore discounted AI infrastructure credits.
                  </p>
                </div>
                <Button
                  className="shrink-0 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                  onClick={() => setShowLeadForm(true)}
                >
                  Book Free Consultation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Recommendations</h2>

          {/* Savings Recommendations */}
          {savingsRecommendations.length > 0 && (
            <div className="space-y-4">
              {savingsRecommendations.map((rec) => (
                <RecommendationCard key={rec.toolId} recommendation={rec} showSavings />
              ))}
            </div>
          )}

          {/* No Change Recommendations */}
          {noChangeRecommendations.length > 0 && (
            <>
              <Separator className="my-8" />
              <h3 className="text-lg font-semibold text-muted-foreground">
                Already Optimized
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {noChangeRecommendations.map((rec) => (
                  <RecommendationCard key={rec.toolId} recommendation={rec} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Lead Capture CTA */}
        {leadSubmitted ? (
          <div className="mt-12 rounded-lg border-2 border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 p-8 text-center shadow-sm dark:from-emerald-950/50 dark:to-teal-950/50">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100">
              Successfully Saved!
            </h3>
            <p className="mt-3 text-base text-emerald-700 dark:text-emerald-300">
              You will now receive optimization alerts when new pricing changes or savings opportunities are detected.
            </p>
            <p className="mt-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Check your email for a confirmation message.
            </p>
          </div>
        ) : (
          <div className="mt-12 rounded-lg border bg-muted/30 p-6 text-center">
            <h3 className="text-lg font-semibold">Want ongoing optimization alerts?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Save your audit and get notified about new pricing changes and savings opportunities.
            </p>
            <Button className="mt-4" variant="outline" onClick={() => setShowLeadForm(true)}>
              Save Audit & Get Alerts
            </Button>
          </div>
        )}

        {/* Share Section */}
        <div className="mt-8 rounded-lg border bg-muted/30 p-6">
          <h3 className="mb-3 font-semibold">Share This Audit</h3>
          <div className="flex gap-2">
            <Input value={shareUrl} readOnly className="flex-1" />
            <Button onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Lead Capture Dialog */}
      <Dialog open={showLeadForm} onOpenChange={setShowLeadForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Your Audit</DialogTitle>
            <DialogDescription>
              Get notified about new savings opportunities and pricing changes.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onLeadSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Role</FormLabel>
                    <FormControl>
                      <Input placeholder="CTO, Engineering Lead..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="honeypot"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Audit
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RecommendationCard({
  recommendation: rec,
  showSavings = false,
}: {
  recommendation: Recommendation;
  showSavings?: boolean;
}) {
  const Icon = providerIcons[rec.provider] || Bot;

  return (
    <Card className={showSavings ? 'border-emerald-200 dark:border-emerald-800' : ''}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-muted p-3">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <div className="font-semibold capitalize">
                {rec.provider.replace(/-/g, ' ')}
              </div>
              <div className="text-sm text-muted-foreground">
                Current: {rec.currentPlan} plan
                {rec.currentMonthlySpend > 0 && ` ($${rec.currentMonthlySpend}/mo)`}
              </div>
              {rec.recommendedPlan && (
                <div className={`mt-2 text-sm font-medium ${actionColors[rec.action]}`}>
                  {actionLabels[rec.action]} to {rec.recommendedPlan}
                </div>
              )}
            </div>
          </div>
          {showSavings && rec.monthlySavings > 0 && (
            <div className="shrink-0 text-right">
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                ${Math.round(rec.monthlySavings)}/mo
              </div>
              <div className="text-sm text-muted-foreground">
                ${Math.round(rec.annualSavings)}/year
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
          {rec.reasoning}
        </div>
      </CardContent>
    </Card>
  );
}