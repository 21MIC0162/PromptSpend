import type { AuditResult, Recommendation } from '@/types';

function buildSummaryPrompt(audit: AuditResult): string {
  const totalSavings = audit.totalMonthlySavings;
  const totalSpend = audit.totalCurrentMonthlySpend;
  const recommendations = audit.recommendations.filter((r) => r.monthlySavings > 0);

  if (totalSavings < 50) {
    return `Generate a short, personalized summary (80-100 words) for an AI tooling audit.
The audit found the user is ALREADY OPTIMIZED with ${Math.round(totalSpend)}/mo in spend and only $${Math.round(totalSavings)}/mo potential savings.

Current tools: ${audit.formData.tools.map((t) => `${t.provider} (${t.plan})`).join(', ')}

Acknowledge their efficiency. Be encouraging and mention they could subscribe for future optimization opportunities.
Format as natural, conversational text without headers or bullet points.`;
  }

  return `Generate a personalized, encouraging summary (80-100 words) for an AI tooling cost audit.

Key findings:
- Current monthly spend: $${Math.round(totalSpend)}
- Potential monthly savings: $${Math.round(totalSavings)}
- Annual savings opportunity: $${Math.round(totalSavings * 12)}

Recommended actions:
${recommendations.map((r) => `- ${r.provider}: ${r.action} from ${r.currentPlan} to ${r.recommendedPlan || 'optimize'} (saves $${Math.round(r.monthlySavings)}/mo)`).join('\n')}

Write in a friendly, finance-savvy tone. Highlight the most impactful change. End with a gentle nudge to implement.
Format as natural, conversational text without headers or bullet points.`;
}

export function generateTemplateSummary(audit: AuditResult): string {
  const totalSavings = audit.totalMonthlySavings;
  const totalSpend = audit.totalCurrentMonthlySpend;

  if (totalSavings < 50) {
    return `Great news! Your AI stack is already well-optimized. With only $${Math.round(totalSavings)}/mo in potential savings, your current selections make financial sense for your team size. We didn't find significant opportunities to reduce costs without sacrificing features. Keep tracking your usage, and consider subscribing for future optimization alerts as new pricing models emerge.`;
  }

  const topRecommendation = audit.recommendations
    .filter((r) => r.monthlySavings > 0)
    .sort((a, b) => b.monthlySavings - a.monthlySavings)[0];

  if (!topRecommendation) {
    return `Your audit is complete. We've analyzed your current AI spend and identified optimization patterns. Your stack shows reasonable efficiency with ${Math.round(totalSavings)}/mo in savings potential. Consider implementing gradual changes to verify impact on productivity.`;
  }

  return `Your audit reveals $${Math.round(totalSavings)}/mo in potential savings. The biggest opportunity is optimizing ${topRecommendation.provider}, where ${topRecommendation.action === 'downgrade' ? 'a plan adjustment' : 'alternative pricing'} could save $${Math.round(topRecommendation.monthlySavings)}/month. Annual savings potential: $${Math.round(totalSavings * 12)}. We recommend starting with your highest-impact change and monitoring for two weeks to ensure productivity remains stable.`;
}

export async function generateAISummary(
  audit: AuditResult
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.log('ANTHROPIC_API_KEY not configured, using template summary');
    return generateTemplateSummary(audit);
  }

  const prompt = buildSummaryPrompt(audit);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error('Anthropic API error:', response.status);
      return generateTemplateSummary(audit);
    }

    const data = await response.json();
    const summary = data.content?.[0]?.text;

    if (!summary) {
      return generateTemplateSummary(audit);
    }

    return summary;
  } catch (error) {
    console.error('Failed to generate AI summary:', error);
    return generateTemplateSummary(audit);
  }
}
