'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { auditFormSchema, aiProviders, useCases } from '@/lib/validations';
import { TOOL_CONFIGS } from '@/lib/tool-config';
import { runAudit, calculateTotals } from '@/lib/audit-engine';
import { supabase } from '@/lib/db/supabase';
import { toast } from 'sonner';
import { Loader as Loader2, Plus, Trash2, Code as Code2, GitBranch, MessageSquare, Bot, Cpu, Zap, Sparkles, Wind, ArrowLeft } from 'lucide-react';
import type { AuditFormData, Recommendation } from '@/types';

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

const useCaseLabels: Record<string, string> = {
  coding: 'Software Development',
  writing: 'Content & Writing',
  research: 'Research & Analysis',
  data: 'Data & Analytics',
  mixed: 'Mixed Use Cases',
};

export default function AuditPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<AuditFormData>({
    resolver: zodResolver(auditFormSchema),
    defaultValues: {
      tools: [{ id: uuidv4(), provider: 'chatgpt', plan: 'team', monthlySpend: 60, seats: 2 }],
      teamSize: 5,
      primaryUseCase: 'coding',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'tools',
  });

  useEffect(() => {
    const saved = localStorage.getItem('auditForm');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        form.reset(data);
      } catch (e) {
        console.error('Failed to load saved form', e);
      }
    }
  }, [form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem('auditForm', JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const addTool = () => {
    append({
      id: uuidv4(),
      provider: 'chatgpt',
      plan: 'plus',
      monthlySpend: 20,
      seats: 1,
    });
  };

  const onSubmit = async (data: AuditFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const recommendations = runAudit(data);
      const totals = calculateTotals(recommendations);

      const slug = uuidv4().substring(0, 8);

      const { data: audit, error: insertError } = await supabase
        .from('audits')
        .insert({
          slug,
          form_data: data,
          recommendations,
          total_current_monthly_spend: totals.totalCurrentMonthlySpend,
          total_optimized_monthly_spend: totals.totalOptimizedMonthlySpend,
          total_monthly_savings: totals.totalMonthlySavings,
          total_annual_savings: totals.totalAnnualSavings,
          ai_summary: '',
          is_optimized: totals.isOptimized,
        })
        .select()
        .single();

      if (insertError) {
        console.error('SUPABASE INSERT ERROR:', insertError);
        throw new Error(insertError.message);
      }

      localStorage.removeItem('auditForm');
      router.push(`/audit/${slug}`);
    } catch (err) {
      console.error('Audit submission error:', err);
      setError('Failed to submit audit. Please try again.');
      toast.error('Failed to submit audit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPlanOptions = (provider: string) => {
    const config = TOOL_CONFIGS.find((t) => t.provider === provider);
    return config?.plans || [];
  };

  const updateMonthlySpend = (index: number, provider: string, plan: string, seats: number) => {
    const config = TOOL_CONFIGS.find((t) => t.provider === provider);
    const planConfig = config?.plans.find((p) => p.id === plan);

    if (planConfig) {
      const isApiPlan = provider === 'anthropic-api' || provider === 'openai-api';
      if (!isApiPlan) {
        const newSpend = planConfig.monthlyPrice * seats;
        form.setValue(`tools.${index}.monthlySpend`, newSpend);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <div className="text-sm text-muted-foreground">Free Audit</div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Analyze Your AI Spend
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Add your AI tools below. We'll find savings opportunities in seconds.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* AI Tools Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>AI Tools</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTool}
                    disabled={fields.length >= 10}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Tool
                  </Button>
                </CardTitle>
                <CardDescription>
                  Add up to 10 AI tools your team is using
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {fields.map((field, index) => {
                  const provider = form.watch(`tools.${index}.provider`);
                  const Icon = providerIcons[provider] || Bot;

                  return (
                    <div key={field.id} className="space-y-4">
                      {index > 0 && <Separator />}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-muted p-2">
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="font-medium">
                            Tool #{index + 1}
                          </span>
                        </div>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <FormField
                          control={form.control}
                          name={`tools.${index}.provider`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tool</FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  const planOptions = getPlanOptions(value);
                                  const defaultPlan = planOptions[0]?.id || '';
                                  form.setValue(`tools.${index}.plan`, defaultPlan);
                                  form.setValue(`tools.${index}.seats`, 1);
                                  updateMonthlySpend(index, value, defaultPlan, 1);
                                }}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select tool" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {TOOL_CONFIGS.map((tool) => (
                                    <SelectItem key={tool.provider} value={tool.provider}>
                                      {tool.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`tools.${index}.plan`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Plan</FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  const seats = form.getValues(`tools.${index}.seats`);
                                  updateMonthlySpend(index, provider, value, seats);
                                }}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select plan" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {getPlanOptions(provider).map((plan) => (
                                    <SelectItem key={plan.id} value={plan.id}>
                                      <span className="flex items-center justify-between gap-2">
                                        {plan.name}
                                        {plan.monthlyPrice > 0 && (
                                          <span className="text-muted-foreground">
                                            ${plan.monthlyPrice}{plan.seatBased ? '/seat' : ''}/mo
                                          </span>
                                        )}
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`tools.${index}.seats`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Seats</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={1}
                                  max={100}
                                  {...field}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value) || 1;
                                    field.onChange(value);
                                    const plan = form.getValues(`tools.${index}.plan`);
                                    updateMonthlySpend(index, provider, plan, value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`tools.${index}.monthlySpend`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Monthly Spend ($)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={0}
                                  step="0.01"
                                  {...field}
                                  onChange={(e) => {
                                    const value = parseFloat(e.target.value) || 0;
                                    field.onChange(value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Team & Usage Section */}
            <Card>
              <CardHeader>
                <CardTitle>Team & Usage</CardTitle>
                <CardDescription>
                  Help us understand your team's context
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="teamSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Size</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={10000}
                            {...field}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Total number of people at your company
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="primaryUseCase"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Use Case</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select use case" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {useCases.map((uc) => (
                              <SelectItem key={uc} value={uc}>
                                {useCaseLabels[uc]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          What your team primarily uses AI for
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {isSubmitting ? 'Analyzing...' : 'Run Free Audit'}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <AlertDialog open={!!error} onOpenChange={() => setError(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Something went wrong</AlertDialogTitle>
            <AlertDialogDescription>
              {error}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setError(null)}>
              Try Again
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
