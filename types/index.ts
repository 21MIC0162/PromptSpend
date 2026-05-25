// AI Tools and Plans
export type AIProvider =
  | 'cursor'
  | 'github-copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic-api'
  | 'openai-api'
  | 'gemini'
  | 'windsurf';

export type CursorPlan = 'pro' | 'business';
export type GitHubCopilotPlan = 'individual' | 'business' | 'enterprise';
export type ClaudePlan = 'pro' | 'team';
export type ChatGPTPlan = 'plus' | 'team';
export type AnthropicAPIPlan = 'pay-as-you-go' | 'credits';
export type OpenAIAPIPlan = 'pay-as-you-go' | 'credits';
export type GeminiPlan = 'free' | 'pro' | 'ultra';
export type WindsurfPlan = 'pro' | 'teams';

export type AIPlan =
  | CursorPlan
  | GitHubCopilotPlan
  | ClaudePlan
  | ChatGPTPlan
  | AnthropicAPIPlan
  | OpenAIAPIPlan
  | GeminiPlan
  | WindsurfPlan;

export type UseCase = 'coding' | 'writing' | 'research' | 'data' | 'mixed';

export interface ToolEntry {
  id: string;
  provider: AIProvider;
  plan: AIPlan;
  monthlySpend: number;
  seats: number;
}

export interface AuditFormData {
  tools: ToolEntry[];
  teamSize: number;
  primaryUseCase: UseCase;
}

// Audit Results
export interface Recommendation {
  toolId: string;
  provider: AIProvider;
  currentPlan: AIPlan;
  recommendedPlan: AIPlan | null;
  action: 'downgrade' | 'upgrade' | 'switch' | 'optimize' | 'none';
  currentMonthlySpend: number;
  optimizedMonthlySpend: number;
  monthlySavings: number;
  annualSavings: number;
  reasoning: string;
}

export interface AuditResult {
  id: string;
  slug: string;
  formData: AuditFormData;
  recommendations: Recommendation[];
  totalCurrentMonthlySpend: number;
  totalOptimizedMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  aiSummary: string;
  isOptimized: boolean;
  createdAt: string;
}

// Lead Capture
export interface LeadFormData {
  email: string;
  companyName: string;
  role: string;
  teamSize: number;
  honeypot?: string;
}

// Database Types
export interface AuditRecord {
  id: string;
  slug: string;
  form_data: AuditFormData;
  recommendations: Recommendation[];
  total_current_monthly_spend: number;
  total_optimized_monthly_spend: number;
  total_monthly_savings: number;
  total_annual_savings: number;
  ai_summary: string;
  is_optimized: boolean;
  created_at: string;
}

export interface LeadRecord {
  id: string;
  email: string;
  company_name: string;
  role: string;
  team_size: number;
  audit_id: string;
  created_at: string;
}

// Tool Configuration
export interface ToolConfig {
  name: string;
  provider: AIProvider;
  plans: PlanConfig[];
  icon: string;
  description: string;
}

export interface PlanConfig {
  id: AIPlan;
  name: string;
  monthlyPrice: number;
  seatBased: boolean;
  minSeats?: number;
  maxSeats?: number;
  recommended: boolean;
}
