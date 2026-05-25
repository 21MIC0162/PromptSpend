import type { LeadFormData, AuditResult } from '@/types';

export async function sendConfirmationEmail(lead: LeadFormData, audit: AuditResult) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.log('RESEND_API_KEY not configured, skipping email');
    return { success: false, reason: 'not_configured' };
  }

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #059669 0%, #0d9488 100%);
      color: white;
      padding: 30px;
      border-radius: 8px 8px 0 0;
      text-align: center;
    }
    .content {
      background: #f9fafb;
      padding: 30px;
      border-radius: 0 0 8px 8px;
      border: 1px solid #e5e7eb;
      border-top: none;
    }
    .savings-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      border: 1px solid #e5e7eb;
    }
    .savings-amount {
      font-size: 32px;
      font-weight: bold;
      color: #059669;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(135deg, #059669 0%, #0d9488 100%);
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      color: #6b7280;
      font-size: 12px;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0;">Your AI Spend Audit</h1>
  </div>
  <div class="content">
    <p>Hi there,</p>
    <p>Great news! We've completed your AI tooling cost audit. Here's a summary of your potential savings:</p>

    <div class="savings-card">
      <p style="margin: 0 0 5px 0; color: #6b7280;">Monthly Savings</p>
      <p class="savings-amount">$${Math.round(audit.totalMonthlySavings)}/mo</p>
      <p style="color: #6b7280; font-size: 14px;">Annual Savings: $${Math.round(audit.totalAnnualSavings)}</p>
    </div>

    <p>We've identified ${audit.recommendations.filter(r => r.monthlySavings > 0).length} optimization opportunities across your AI tools.</p>

    <a href="${process.env.NEXT_PUBLIC_APP_URL}/audit/${audit.slug}" class="button">
      View Full Audit
    </a>

    <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
      We'll notify you when new pricing changes or optimization opportunities arise for your stack.
    </p>

    <p style="margin-top: 20px;">
      Best,<br>
      The PromptSpend Team
    </p>
  </div>

  <div class="footer">
    <p>PromptSpend - AI Spend Audit Platform</p>
    <p>You received this email because you saved an AI spend audit.</p>
  </div>
</body>
</html>
  `.trim();

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'PromptSpend <noreply@promptspend.com>',
        to: [lead.email],
        subject: audit.totalMonthlySavings > 50
          ? `Your AI Spend Audit: Save $${Math.round(audit.totalAnnualSavings)}/year`
          : 'Your AI Spend Audit Results',
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API error:', error);
      return { success: false, reason: 'api_error' };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, reason: 'exception' };
  }
}

export async function sendNotificationEmail(lead: LeadFormData, audit: AuditResult) {
  const notificationEmail = process.env.NOTIFICATION_EMAIL;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!notificationEmail || !resendApiKey) {
    return { success: false, reason: 'not_configured' };
  }

  if (audit.totalMonthlySavings < 100) {
    return { success: false, reason: 'below_threshold' };
  }

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: sans-serif; line-height: 1.6; color: #333; }
    .highlight { background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  <h2>New Lead with High Savings Potential</h2>

  <div class="highlight">
    <p><strong>Lead:</strong> ${lead.email}</p>
    <p><strong>Company:</strong> ${lead.companyName}</p>
    <p><strong>Role:</strong> ${lead.role}</p>
    <p><strong>Team Size:</strong> ${lead.teamSize}</p>
  </div>

  <h3>Savings Summary</h3>
  <ul>
    <li>Monthly Savings: $${Math.round(audit.totalMonthlySavings)}</li>
    <li>Annual Savings: $${Math.round(audit.totalAnnualSavings)}</li>
    <li>Current Spend: $${Math.round(audit.totalCurrentMonthlySpend)}/mo</li>
  </ul>

  <p><strong>Tools:</strong></p>
  <ul>
    ${audit.formData.tools.map(t => `<li>${t.provider} (${t.plan}) - $${t.monthlySpend}/mo</li>`).join('')}
  </ul>

  <p>View full audit: ${process.env.NEXT_PUBLIC_APP_URL}/audit/${audit.slug}</p>
</body>
</html>
  `.trim();

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: [notificationEmail],
        subject: `[${lead.companyName}] New Lead: $${Math.round(audit.totalAnnualSavings)}/year savings potential`,
        html: emailHtml,
      }),
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send notification:', error);
    return { success: false, reason: 'exception' };
  }
}
