import type { ToolConfig } from '@/types';

export const TOOL_CONFIGS: ToolConfig[] = [
  {
    name: 'Cursor',
    provider: 'cursor',
    icon: 'Code2',
    description: 'AI-powered code editor',
    plans: [
      {
        id: 'pro',
        name: 'Pro',
        monthlyPrice: 20,
        seatBased: true,
        recommended: true,
      },
      {
        id: 'business',
        name: 'Business',
        monthlyPrice: 40,
        seatBased: true,
        minSeats: 2,
        recommended: false,
      },
    ],
  },
  {
    name: 'GitHub Copilot',
    provider: 'github-copilot',
    icon: 'GitBranch',
    description: 'AI pair programmer for code completion',
    plans: [
      {
        id: 'individual',
        name: 'Individual',
        monthlyPrice: 10,
        seatBased: true,
        recommended: true,
      },
      {
        id: 'business',
        name: 'Business',
        monthlyPrice: 19,
        seatBased: true,
        minSeats: 2,
        recommended: false,
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        monthlyPrice: 39,
        seatBased: true,
        minSeats: 5,
        recommended: false,
      },
    ],
  },
  {
    name: 'Claude',
    provider: 'claude',
    icon: 'MessageSquare',
    description: 'Anthropic\'s AI assistant for coding and writing',
    plans: [
      {
        id: 'pro',
        name: 'Pro',
        monthlyPrice: 20,
        seatBased: false,
        recommended: true,
      },
      {
        id: 'team',
        name: 'Team',
        monthlyPrice: 30,
        seatBased: true,
        minSeats: 2,
        recommended: false,
      },
    ],
  },
  {
    name: 'ChatGPT',
    provider: 'chatgpt',
    icon: 'Bot',
    description: 'OpenAI\'s conversational AI assistant',
    plans: [
      {
        id: 'plus',
        name: 'Plus',
        monthlyPrice: 20,
        seatBased: false,
        recommended: true,
      },
      {
        id: 'team',
        name: 'Team',
        monthlyPrice: 30,
        seatBased: true,
        minSeats: 2,
        recommended: false,
      },
    ],
  },
  {
    name: 'Anthropic API',
    provider: 'anthropic-api',
    icon: 'Cpu',
    description: 'API access to Claude models',
    plans: [
      {
        id: 'pay-as-you-go',
        name: 'Pay As You Go',
        monthlyPrice: 0,
        seatBased: false,
        recommended: true,
      },
      {
        id: 'credits',
        name: 'Credits Package',
        monthlyPrice: 0,
        seatBased: false,
        recommended: false,
      },
    ],
  },
  {
    name: 'OpenAI API',
    provider: 'openai-api',
    icon: 'Zap',
    description: 'API access to GPT models',
    plans: [
      {
        id: 'pay-as-you-go',
        name: 'Pay As You Go',
        monthlyPrice: 0,
        seatBased: false,
        recommended: true,
      },
      {
        id: 'credits',
        name: 'Credits Package',
        monthlyPrice: 0,
        seatBased: false,
        recommended: false,
      },
    ],
  },
  {
    name: 'Gemini',
    provider: 'gemini',
    icon: 'Sparkles',
    description: 'Google\'s AI assistant for productivity',
    plans: [
      {
        id: 'free',
        name: 'Free',
        monthlyPrice: 0,
        seatBased: false,
        recommended: false,
      },
      {
        id: 'pro',
        name: 'Pro',
        monthlyPrice: 20,
        seatBased: false,
        recommended: true,
      },
      {
        id: 'ultra',
        name: 'Ultra',
        monthlyPrice: 45,
        seatBased: false,
        recommended: false,
      },
    ],
  },
  {
    name: 'Windsurf',
    provider: 'windsurf',
    icon: 'Wind',
    description: 'AI-native IDE for developers',
    plans: [
      {
        id: 'pro',
        name: 'Pro',
        monthlyPrice: 15,
        seatBased: true,
        recommended: true,
      },
      {
        id: 'teams',
        name: 'Teams',
        monthlyPrice: 35,
        seatBased: true,
        minSeats: 2,
        recommended: false,
      },
    ],
  },
];

export function getToolConfig(provider: string): ToolConfig | undefined {
  return TOOL_CONFIGS.find((t) => t.provider === provider);
}

export function getPlanPrice(provider: string, plan: string): number {
  const config = getToolConfig(provider);
  if (!config) return 0;
  const planConfig = config.plans.find((p) => p.id === plan);
  return planConfig?.monthlyPrice ?? 0;
}

export function getPlanName(provider: string, plan: string): string {
  const config = getToolConfig(provider);
  if (!config) return plan;
  const planConfig = config.plans.find((p) => p.id === plan);
  return planConfig?.name ?? plan;
}
