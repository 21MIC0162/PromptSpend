import type {
  AIProvider,
  AIPlan,
  AuditFormData,
  Recommendation,
  ToolEntry,
  UseCase,
} from '@/types';

interface AuditContext {
  tool: ToolEntry;
  teamSize: number;
  primaryUseCase: UseCase;
}

interface RuleResult {
  action: Recommendation['action'];
  recommendedPlan: AIPlan | null;
  optimizedMonthlySpend: number;
  monthlySavings: number;
  reasoning: string;
}

export type AuditRule = (ctx: AuditContext) => RuleResult | null;

function calculateOptimizedSpend(
  recommendedPlan: AIPlan | null,
  seats: number,
  provider: AIProvider
): number {
  if (!recommendedPlan) return 0;

  const pricing: Record<AIProvider, Record<string, number>> = {
    cursor: { pro: 20, business: 40 },
    'github-copilot': { individual: 10, business: 19, enterprise: 39 },
    claude: { pro: 20, team: 30 },
    chatgpt: { plus: 20, team: 30 },
    'anthropic-api': { 'pay-as-you-go': 0, credits: 0 },
    'openai-api': { 'pay-as-you-go': 0, credits: 0 },
    gemini: { free: 0, pro: 20, ultra: 45 },
    windsurf: { pro: 15, teams: 35 },
  };

  const planPricing = pricing[provider];
  if (!planPricing) return 0;

  const pricePerSeat = planPricing[recommendedPlan] || 0;

  const seatBasedPlans = [
    'business',
    'team',
    'teams',
    'enterprise',
    'individual',
    'pro',
  ];

  const isSeatBased =
    (provider === 'anthropic-api' || provider === 'openai-api')
      ? false
      : seatBasedPlans.includes(recommendedPlan);

  return isSeatBased ? pricePerSeat * seats : pricePerSeat;
}

export const chatGPTRule: AuditRule = (ctx) => {
  if (ctx.tool.provider !== 'chatgpt') return null;

  const { tool } = ctx;

  if (tool.plan === 'team' && tool.seats <= 2) {
    const currentSpend = 30 * tool.seats;
    const optimizedSpend = 20;
    const savings = currentSpend - optimizedSpend;

    return {
      action: 'downgrade',
      recommendedPlan: 'plus',
      optimizedMonthlySpend: optimizedSpend,
      monthlySavings: savings,
      reasoning: `ChatGPT Team requires minimum 2 seats at $30/seat ($${currentSpend}/mo). With ${tool.seats} ${tool.seats === 1 ? 'user' : 'users'}, ChatGPT Plus at $20/mo covers all features. Team plan is only worthwhile at 3+ users needing isolated workspaces.`,
    };
  }

  return null;
};

export const cursorRule: AuditRule = (ctx) => {
  if (ctx.tool.provider !== 'cursor') return null;

  const { tool } = ctx;

  if (tool.plan === 'business' && tool.seats < 3) {
    const currentSpend = 40 * tool.seats;
    const optimizedSpend = 20 * tool.seats;
    const savings = currentSpend - optimizedSpend;

    return {
      action: 'downgrade',
      recommendedPlan: 'pro',
      optimizedMonthlySpend: optimizedSpend,
      monthlySavings: savings,
      reasoning: `Cursor Business costs $40/seat ($${currentSpend}/mo) for centralized billing and admin controls. At ${tool.seats} ${tool.seats === 1 ? 'seat' : 'seats'}, the Pro plan at $20/seat provides identical AI features. Business adds value at 5+ seats with organizational needs.`,
    };
  }

  return null;
};

export const claudeRule: AuditRule = (ctx) => {
  if (ctx.tool.provider !== 'claude') return null;

  const { tool } = ctx;

  if (tool.plan === 'team' && tool.seats <= 2) {
    const currentSpend = 30 * tool.seats;
    const optimizedSpend = 20;
    const savings = currentSpend - optimizedSpend;

    return {
      action: 'downgrade',
      recommendedPlan: 'pro',
      optimizedMonthlySpend: optimizedSpend,
      monthlySavings: savings,
      reasoning: `Claude Team at $30/seat ($${currentSpend}/mo) is designed for collaboration features. For ${tool.seats} ${tool.seats === 1 ? 'user' : 'users'}, Pro at $20/mo offers the same model access. Team is valuable when you need shared context and billing for 3+ seats.`,
    };
  }

  return null;
};

export const gitHubCopilotRule: AuditRule = (ctx) => {
  if (ctx.tool.provider !== 'github-copilot') return null;

  const { tool } = ctx;

  if (tool.plan === 'enterprise' && tool.seats < 10) {
    const currentSpend = 39 * tool.seats;
    const optimizedSpend = 19 * tool.seats;
    const savings = currentSpend - optimizedSpend;

    return {
      action: 'downgrade',
      recommendedPlan: 'business',
      optimizedMonthlySpend: optimizedSpend,
      monthlySavings: savings,
      reasoning: `Copilot Enterprise at $39/seat ($${currentSpend}/mo) adds IP indemnity and custom models. For ${tool.seats} seats, Business at $19/seat is more cost-effective. Enterprise is justified for large engineering orgs (50+) with legal/compliance requirements.`,
    };
  }

  if (tool.plan === 'business' && tool.seats === 1) {
    const currentSpend = 19;
    const optimizedSpend = 10;
    const savings = currentSpend - optimizedSpend;

    return {
      action: 'downgrade',
      recommendedPlan: 'individual',
      optimizedMonthlySpend: optimizedSpend,
      monthlySavings: savings,
      reasoning: `Copilot Business at $19/mo requires minimum 2 seats. For individual use, the Personal plan at $10/mo is identical in features. Business adds value at 2+ seats with centralized management.`,
    };
  }

  return null;
};

export const geminiRule: AuditRule = (ctx) => {
  if (ctx.tool.provider !== 'gemini') return null;

  const { tool } = ctx;

  if (tool.plan === 'ultra' && ctx.primaryUseCase === 'coding') {
    const currentSpend = 45;
    const optimizedSpend = 20;
    const savings = currentSpend - optimizedSpend;

    return {
      action: 'downgrade',
      recommendedPlan: 'pro',
      optimizedMonthlySpend: optimizedSpend,
      monthlySavings: savings,
      reasoning: `Gemini Ultra at $45/mo offers advanced multimodal features overkill for coding workflows. Pro at $20/mo provides excellent coding assistance with 1M context window. Ultra is best suited for complex document/video analysis tasks.`,
    };
  }

  return null;
};

export const windsurfRule: AuditRule = (ctx) => {
  if (ctx.tool.provider !== 'windsurf') return null;

  const { tool } = ctx;

  if (tool.plan === 'teams' && tool.seats < 3) {
    const currentSpend = 35 * tool.seats;
    const optimizedSpend = 15 * tool.seats;
    const savings = currentSpend - optimizedSpend;

    return {
      action: 'downgrade',
      recommendedPlan: 'pro',
      optimizedMonthlySpend: optimizedSpend,
      monthlySavings: savings,
      reasoning: `Windsurf Teams at $35/seat ($${currentSpend}/mo) adds collaboration features. For ${tool.seats} ${tool.seats === 1 ? 'seat' : 'seats'}, Pro at $15/seat provides the same AI capabilities. Teams plan becomes valuable at 5+ seats needing shared workflows.`,
    };
  }

  return null;
};

export const openaiApiRule: AuditRule = (ctx) => {
  if (ctx.tool.provider !== 'openai-api') return null;

  const { tool } = ctx;

  if (tool.monthlySpend > 500 && tool.plan === 'pay-as-you-go') {
    const optimizedSpend = tool.monthlySpend * 0.7;
    const savings = tool.monthlySpend - optimizedSpend;

    return {
      action: 'optimize',
      recommendedPlan: 'credits',
      optimizedMonthlySpend: optimizedSpend,
      monthlySavings: savings,
      reasoning: `At $${tool.monthlySpend}/mo in OpenAI API spend, you qualify for volume discounts or committed use credits. Pre-purchasing credits can yield 10-30% savings. Consider negotiating an enterprise agreement or exploring Anthropic/Claude API alternatives for similar capabilities.`,
    };
  }

  if (tool.monthlySpend > 1000 && tool.plan === 'pay-as-you-go') {
    const optimizedSpend = tool.monthlySpend * 0.65;
    const savings = tool.monthlySpend - optimizedSpend;

    return {
      action: 'optimize',
      recommendedPlan: 'credits',
      optimizedMonthlySpend: optimizedSpend,
      monthlySavings: savings,
      reasoning: `High API spend of $${tool.monthlySpend}/mo suggests potential for enterprise pricing or credits. OpenAI offers custom pricing for committed use. Alternatively, Anthropic API provides competitive Claude models that may reduce costs by 20-40% for similar tasks.`,
    };
  }

  return null;
};

export const anthropicApiRule: AuditRule = (ctx) => {
  if (ctx.tool.provider !== 'anthropic-api') return null;

  const { tool } = ctx;

  if (tool.monthlySpend > 500 && tool.plan === 'pay-as-you-go') {
    const optimizedSpend = tool.monthlySpend * 0.75;
    const savings = tool.monthlySpend - optimizedSpend;

    return {
      action: 'optimize',
      recommendedPlan: 'credits',
      optimizedMonthlySpend: optimizedSpend,
      monthlySavings: savings,
      reasoning: `At $${tool.monthlySpend}/mo, Anthropic offers API credits with volume discounts. Pre-purchasing credits reduces effective rate. Consider batching requests and optimizing prompt lengths to reduce token usage by 15-25%.`,
    };
  }

  return null;
};

export const allRules: AuditRule[] = [
  chatGPTRule,
  cursorRule,
  claudeRule,
  gitHubCopilotRule,
  geminiRule,
  windsurfRule,
  openaiApiRule,
  anthropicApiRule,
];

function generateNoChangeRecommendation(tool: ToolEntry): Recommendation {
  return {
    toolId: tool.id,
    provider: tool.provider,
    currentPlan: tool.plan,
    recommendedPlan: null,
    action: 'none',
    currentMonthlySpend: tool.monthlySpend,
    optimizedMonthlySpend: tool.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    reasoning: `Current plan is well-suited for your usage. ${tool.plan} at $${tool.monthlySpend}/mo is appropriately sized for ${tool.seats} ${tool.seats === 1 ? 'seat' : 'seats'}. No changes recommended.`,
  };
}

export function runAudit(formData: AuditFormData): Recommendation[] {
  const recommendations: Recommendation[] = [];

  for (const tool of formData.tools) {
    let matched = false;
    const ctx: AuditContext = {
      tool,
      teamSize: formData.teamSize,
      primaryUseCase: formData.primaryUseCase,
    };

    for (const rule of allRules) {
      const result = rule(ctx);
      if (result) {
        recommendations.push({
          toolId: tool.id,
          provider: tool.provider,
          currentPlan: tool.plan,
          recommendedPlan: result.recommendedPlan,
          action: result.action,
          currentMonthlySpend: tool.monthlySpend,
          optimizedMonthlySpend: result.optimizedMonthlySpend,
          monthlySavings: result.monthlySavings,
          annualSavings: result.monthlySavings * 12,
          reasoning: result.reasoning,
        });
        matched = true;
        break;
      }
    }

    if (!matched) {
      recommendations.push(generateNoChangeRecommendation(tool));
    }
  }

  return recommendations;
}

export function calculateTotals(recommendations: Recommendation[]) {
  const totalCurrentMonthlySpend = recommendations.reduce(
    (sum, r) => sum + r.currentMonthlySpend,
    0
  );
  const totalOptimizedMonthlySpend = recommendations.reduce(
    (sum, r) => sum + r.optimizedMonthlySpend,
    0
  );
  const totalMonthlySavings = recommendations.reduce(
    (sum, r) => sum + r.monthlySavings,
    0
  );
  const totalAnnualSavings = totalMonthlySavings * 12;

  return {
    totalCurrentMonthlySpend,
    totalOptimizedMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    isOptimized: totalMonthlySavings < 50,
  };
}
