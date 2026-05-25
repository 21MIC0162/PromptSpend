import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { supabase } from '@/lib/db/supabase';
import { generateAISummary } from '@/lib/ai/generate-summary';
import { AuditResultContent } from '@/components/audit-result-content';
import type { AuditResult } from '@/types';

interface AuditPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: AuditPageProps): Promise<Metadata> {
  const { slug } = await params;

  const { data: audit } = await supabase
    .from('audits')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!audit) {
    return {
      title: 'Audit Not Found',
    };
  }

  const savings = Math.round(audit.total_monthly_savings);
  const annualSavings = Math.round(audit.total_annual_savings);

  const baseUrl = 'https://promptspend.vercel.app';

  if (savings > 0) {
    return {
      title: `This startup could save $${annualSavings.toLocaleString()}/year on AI tooling`,
      description: `AI spend audit revealed $${savings}/mo in potential savings. See the full breakdown of ChatGPT, Claude, Cursor, and other AI tool optimizations.`,

      openGraph: {
        title: `PromptSpend Audit: $${annualSavings.toLocaleString()}/year savings potential`,
        description: `AI spend audit revealed $${savings}/mo in potential savings. See the full breakdown.`,
        url: `${baseUrl}/audit/${slug}`,
        siteName: 'PromptSpend',
        images: [
          {
            url: `${baseUrl}/og-image.png`,
            width: 1200,
            height: 630,
            alt: 'PromptSpend AI Spend Audit',
          },
        ],
        locale: 'en_US',
        type: 'website',
      },

      twitter: {
        card: 'summary_large_image',
        title: `This startup could save $${annualSavings.toLocaleString()}/year on AI tooling`,
        description: `AI spend audit revealed $${savings}/mo in potential savings. See the full breakdown.`,
        images: [`${baseUrl}/og-image.png`],
      },
    };
  }

  return {
    title: 'Optimized AI Spend Audit',
    description:
      'This AI tooling audit found a well-optimized stack with minimal savings potential. See the full analysis.',

    openGraph: {
      title: 'PromptSpend Audit: Well-optimized AI stack',
      description:
        'This AI tooling audit found a well-optimized stack with minimal savings potential.',
      url: `${baseUrl}/audit/${slug}`,
      siteName: 'PromptSpend',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'PromptSpend AI Spend Audit',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title: 'Optimized AI Spend Audit',
      description:
        'This AI tooling audit found a well-optimized stack with minimal savings potential.',
      images: [`${baseUrl}/og-image.png`],
    },
  };
}

export default async function AuditPage({ params }: AuditPageProps) {
  const { slug } = await params;

  const { data: audit, error } = await supabase
    .from('audits')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!audit || error) {
    notFound();
  }

  let aiSummary = audit.ai_summary;

  if (!aiSummary || aiSummary === '') {
    const auditResult: AuditResult = {
      id: audit.id,
      slug: audit.slug,
      formData: audit.form_data,
      recommendations: audit.recommendations,
      totalCurrentMonthlySpend: audit.total_current_monthly_spend,
      totalOptimizedMonthlySpend: audit.total_optimized_monthly_spend,
      totalMonthlySavings: audit.total_monthly_savings,
      totalAnnualSavings: audit.total_annual_savings,
      aiSummary: '',
      isOptimized: audit.is_optimized,
      createdAt: audit.created_at,
    };

    aiSummary = await generateAISummary(auditResult);

    await supabase
      .from('audits')
      .update({ ai_summary: aiSummary })
      .eq('id', audit.id);
  }

  const auditResult: AuditResult = {
    id: audit.id,
    slug: audit.slug,
    formData: audit.form_data,
    recommendations: audit.recommendations,
    totalCurrentMonthlySpend: audit.total_current_monthly_spend,
    totalOptimizedMonthlySpend: audit.total_optimized_monthly_spend,
    totalMonthlySavings: audit.total_monthly_savings,
    totalAnnualSavings: audit.total_annual_savings,
    aiSummary: aiSummary,
    isOptimized: audit.is_optimized,
    createdAt: audit.created_at,
  };

  return <AuditResultContent audit={auditResult} />;
}