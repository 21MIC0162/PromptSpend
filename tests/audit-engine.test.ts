import { describe, it, expect } from 'vitest';
import { runAudit, calculateTotals } from '@/lib/audit-engine';
import type { AuditFormData, ToolEntry } from '@/types';

function createTool(
  provider: ToolEntry['provider'],
  plan: ToolEntry['plan'],
  monthlySpend: number,
  seats: number = 1
): ToolEntry {
  return {
    id: `test-${provider}-${Date.now()}`,
    provider,
    plan,
    monthlySpend,
    seats,
  };
}

function createFormData(tools: ToolEntry[], teamSize = 5, primaryUseCase = 'coding' as const): AuditFormData {
  return {
    tools,
    teamSize,
    primaryUseCase,
  };
}

describe('Audit Engine', () => {
  describe('ChatGPT Rules', () => {
    it('should recommend downgrading ChatGPT Team to Plus for 2 seats', () => {
      const formData = createFormData([
        createTool('chatgpt', 'team', 60, 2),
      ]);

      const recommendations = runAudit(formData);

      expect(recommendations).toHaveLength(1);
      expect(recommendations[0].action).toBe('downgrade');
      expect(recommendations[0].recommendedPlan).toBe('plus');
      expect(recommendations[0].monthlySavings).toBe(40);
      expect(recommendations[0].reasoning).toContain('Team');
    });

    it('should not recommend changes for ChatGPT Team with 3+ seats', () => {
      const formData = createFormData([
        createTool('chatgpt', 'team', 90, 3),
      ]);

      const recommendations = runAudit(formData);

      expect(recommendations[0].action).toBe('none');
      expect(recommendations[0].monthlySavings).toBe(0);
    });

    it('should not recommend changes for ChatGPT Plus', () => {
      const formData = createFormData([
        createTool('chatgpt', 'plus', 20, 1),
      ]);

      const recommendations = runAudit(formData);

      expect(recommendations[0].action).toBe('none');
    });
  });

  describe('Cursor Rules', () => {
    it('should recommend downgrading Cursor Business to Pro for small teams', () => {
      const formData = createFormData([
        createTool('cursor', 'business', 80, 2),
      ]);

      const recommendations = runAudit(formData);

      expect(recommendations[0].action).toBe('downgrade');
      expect(recommendations[0].recommendedPlan).toBe('pro');
      expect(recommendations[0].monthlySavings).toBe(40);
      expect(recommendations[0].reasoning).toContain('Business');
    });

    it('should not recommend changes for Cursor Pro', () => {
      const formData = createFormData([
        createTool('cursor', 'pro', 20, 1),
      ]);

      const recommendations = runAudit(formData);

      expect(recommendations[0].action).toBe('none');
    });
  });

  describe('Claude Rules', () => {
    it('should recommend downgrading Claude Team to Pro for 1 seat', () => {
      const formData = createFormData([
        createTool('claude', 'team', 30, 1),
      ]);

      const recommendations = runAudit(formData);

      expect(recommendations[0].action).toBe('downgrade');
      expect(recommendations[0].recommendedPlan).toBe('pro');
      expect(recommendations[0].monthlySavings).toBe(10);
    });
  });

  describe('GitHub Copilot Rules', () => {
    it('should recommend downgrading Copilot Enterprise to Business for small teams', () => {
      const formData = createFormData([
        createTool('github-copilot', 'enterprise', 195, 5),
      ]);

      const recommendations = runAudit(formData);

      expect(recommendations[0].action).toBe('downgrade');
      expect(recommendations[0].recommendedPlan).toBe('business');
      expect(recommendations[0].monthlySavings).toBe(100);
    });

    it('should recommend Individual plan for single Business seat', () => {
      const formData = createFormData([
        createTool('github-copilot', 'business', 19, 1),
      ]);

      const recommendations = runAudit(formData);

      expect(recommendations[0].action).toBe('downgrade');
      expect(recommendations[0].recommendedPlan).toBe('individual');
    });
  });

  describe('Gemini Rules', () => {
    it('should recommend Pro over Ultra for coding use case', () => {
      const formData = createFormData(
        [createTool('gemini', 'ultra', 45, 1)],
        5,
        'coding'
      );

      const recommendations = runAudit(formData);

      expect(recommendations[0].action).toBe('downgrade');
      expect(recommendations[0].recommendedPlan).toBe('pro');
      expect(recommendations[0].monthlySavings).toBe(25);
    });

    it('should not recommend changes for Gemini Pro', () => {
      const formData = createFormData([
        createTool('gemini', 'pro', 20, 1),
      ]);

      const recommendations = runAudit(formData);

      expect(recommendations[0].action).toBe('none');
    });
  });

  describe('Windsurf Rules', () => {
    it('should recommend downgrading Windsurf Teams to Pro for small teams', () => {
      const formData = createFormData([
        createTool('windsurf', 'teams', 70, 2),
      ]);

      const recommendations = runAudit(formData);

      expect(recommendations[0].action).toBe('downgrade');
      expect(recommendations[0].recommendedPlan).toBe('pro');
      expect(recommendations[0].monthlySavings).toBe(40);
    });
  });

  describe('API Spend Rules', () => {
    it('should recommend optimization for high OpenAI API spend', () => {
      const formData = createFormData([
        createTool('openai-api', 'pay-as-you-go', 600, 1),
      ]);

      const recommendations = runAudit(formData);

      expect(recommendations[0].action).toBe('optimize');
      expect(recommendations[0].monthlySavings).toBeGreaterThan(0);
      expect(recommendations[0].reasoning).toContain('credit');
    });

    it('should recommend optimization for high Anthropic API spend', () => {
      const formData = createFormData([
        createTool('anthropic-api', 'pay-as-you-go', 600, 1),
      ]);

      const recommendations = runAudit(formData);

      expect(recommendations[0].action).toBe('optimize');
      expect(recommendations[0].monthlySavings).toBeGreaterThan(0);
    });

    it('should not recommend changes for low API spend', () => {
      const formData = createFormData([
        createTool('openai-api', 'pay-as-you-go', 100, 1),
      ]);

      const recommendations = runAudit(formData);

      expect(recommendations[0].action).toBe('none');
    });
  });

  describe('Multi-Tool Audits', () => {
    it('should handle multiple tools with mixed recommendations', () => {
      const formData = createFormData([
        createTool('chatgpt', 'team', 60, 2),
        createTool('cursor', 'business', 80, 2),
        createTool('gemini', 'pro', 20, 1),
      ]);

      const recommendations = runAudit(formData);

      expect(recommendations).toHaveLength(3);

      const savingsRecs = recommendations.filter(r => r.monthlySavings > 0);
      expect(savingsRecs.length).toBe(2);

      const noChangeRecs = recommendations.filter(r => r.action === 'none');
      expect(noChangeRecs.length).toBe(1);
    });

    it('should calculate correct totals for multiple tools', () => {
      const formData = createFormData([
        createTool('chatgpt', 'team', 60, 2),
        createTool('cursor', 'business', 80, 2),
      ]);

      const recommendations = runAudit(formData);
      const totals = calculateTotals(recommendations);

      expect(totals.totalCurrentMonthlySpend).toBe(140);
      expect(totals.totalMonthlySavings).toBeGreaterThan(0);
      expect(totals.totalAnnualSavings).toBe(totals.totalMonthlySavings * 12);
    });
  });

  describe('Calculate Totals', () => {
    it('should correctly sum all savings', () => {
      const formData = createFormData([
        createTool('chatgpt', 'team', 60, 2),
        createTool('cursor', 'business', 40, 1),
      ]);

      const recommendations = runAudit(formData);
      const totals = calculateTotals(recommendations);

      expect(totals.totalCurrentMonthlySpend).toBe(100);
      expect(totals.totalOptimizedMonthlySpend).toBeLessThan(100);
      expect(totals.totalMonthlySavings).toBe(totals.totalCurrentMonthlySpend - totals.totalOptimizedMonthlySpend);
    });

    it('should mark audits with < $50 savings as optimized', () => {
      const formData = createFormData([
        createTool('gemini', 'pro', 20, 1),
      ]);

      const recommendations = runAudit(formData);
      const totals = calculateTotals(recommendations);

      expect(totals.isOptimized).toBe(true);
    });

    it('should mark audits with > $50 savings as not optimized', () => {
      const formData = createFormData([
        createTool('github-copilot', 'enterprise', 195, 5),
        createTool('chatgpt', 'team', 60, 2),
      ]);

      const recommendations = runAudit(formData);
      const totals = calculateTotals(recommendations);

      expect(totals.isOptimized).toBe(false);
    });
  });
});
