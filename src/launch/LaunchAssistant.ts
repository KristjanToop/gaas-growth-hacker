/**
 * LaunchAssistant - Automated Launch System for Vibe-Coded Apps
 *
 * Handles all the practical needs to launch:
 * - Email setup (transactional + sequences)
 * - Ads infrastructure (pixels, campaigns, tracking)
 * - Analytics configuration
 * - Legal documents generation
 * - Distribution (Product Hunt, social, communities)
 * - Payment setup
 */

import {
  LaunchConfig,
  LaunchChecklist,
  LaunchChecklistItem,
  LaunchPlan,
  LaunchPhase,
  LaunchTask,
  LaunchCategory,
  AppInfo,
  EmailConfig,
  EmailSequence,
  EmailTemplate,
  AdsConfig,
  AdsCampaign,
  AdCreative,
  AnalyticsConfig,
  AnalyticsEvent,
  ProductHuntConfig,
  LaunchPost,
  LegalConfig,
} from './types';

import { CapabilityResult } from '../core/types';

export class LaunchAssistant {
  /**
   * Generate complete launch plan for a vibe-coded app
   */
  async execute(input: Record<string, unknown>): Promise<CapabilityResult> {
    const appInfo = input.appInfo as AppInfo;
    const launchDate = input.launchDate as string | undefined;
    const budget = input.budget as number | undefined;
    const priorities = input.priorities as string[] | undefined;

    const checklist = this.generateLaunchChecklist(appInfo, priorities);
    const emailSetup = this.generateEmailSetup(appInfo);
    const adsSetup = this.generateAdsSetup(appInfo, budget);
    const analyticsSetup = this.generateAnalyticsSetup(appInfo);
    const distributionPlan = this.generateDistributionPlan(appInfo, launchDate);
    const legalDocs = this.generateLegalDocuments(appInfo);
    const launchPlan = this.createLaunchPlan(appInfo, launchDate);

    return {
      success: true,
      data: {
        checklist,
        emailSetup,
        adsSetup,
        analyticsSetup,
        distributionPlan,
        legalDocs,
        launchPlan,
        quickStart: this.generateQuickStartGuide(appInfo),
        mcpCommands: this.generateMCPCommands(appInfo),
      },
      explanation: `Generated complete launch plan with ${checklist.items.length} tasks across ${this.getCategories(checklist).length} categories`,
    };
  }

  // ============================================================================
  // LAUNCH CHECKLIST GENERATION
  // ============================================================================

  private generateLaunchChecklist(appInfo: AppInfo, priorities?: string[]): LaunchChecklist {
    const items: LaunchChecklistItem[] = [
      // CRITICAL - Domain & Hosting
      {
        id: 'domain-setup',
        category: 'domain',
        task: 'Configure custom domain',
        description: 'Set up your domain with DNS records pointing to your hosting',
        status: 'pending',
        priority: 'critical',
        automated: false,
        dependencies: [],
        estimatedMinutes: 15,
        instructions: [
          'Purchase domain from registrar (Namecheap, Cloudflare, etc.)',
          'Add A record pointing to your hosting IP',
          'Add CNAME for www subdomain',
          'Wait for DNS propagation (up to 48 hours)',
        ],
      },
      {
        id: 'ssl-setup',
        category: 'domain',
        task: 'Enable SSL/HTTPS',
        description: 'Secure your site with SSL certificate',
        status: 'pending',
        priority: 'critical',
        automated: true,
        dependencies: ['domain-setup'],
        estimatedMinutes: 5,
        instructions: [
          'Most hosting providers auto-provision SSL',
          'Verify https:// works for your domain',
          'Set up redirect from http to https',
        ],
      },

      // CRITICAL - Email Setup
      {
        id: 'email-domain-verify',
        category: 'email',
        task: 'Verify email sending domain',
        description: 'Set up SPF, DKIM, and DMARC records for email deliverability',
        status: 'pending',
        priority: 'critical',
        automated: false,
        dependencies: ['domain-setup'],
        estimatedMinutes: 20,
        instructions: [
          'Sign up for email provider (Resend, SendGrid, Postmark)',
          'Add domain to email provider',
          'Add SPF record to DNS',
          'Add DKIM record to DNS',
          'Add DMARC record to DNS',
          'Verify domain in provider dashboard',
        ],
        mcpAction: {
          server: 'resend-mcp',
          tool: 'verify_domain',
          parameters: { domain: '{{domain}}' },
        },
      },
      {
        id: 'transactional-emails',
        category: 'email',
        task: 'Set up transactional email templates',
        description: 'Create essential transactional emails (welcome, password reset, etc.)',
        status: 'pending',
        priority: 'critical',
        automated: true,
        dependencies: ['email-domain-verify'],
        estimatedMinutes: 30,
        instructions: [
          'Create welcome email template',
          'Create password reset template',
          'Create email verification template',
          'Create payment confirmation template',
          'Test all templates with real sends',
        ],
      },
      {
        id: 'email-sequences',
        category: 'email',
        task: 'Create onboarding email sequence',
        description: 'Set up automated email sequence for new signups',
        status: 'pending',
        priority: 'high',
        automated: true,
        dependencies: ['transactional-emails'],
        estimatedMinutes: 45,
        instructions: [
          'Create Day 0: Welcome + quick start',
          'Create Day 1: Key feature highlight',
          'Create Day 3: Check-in + tips',
          'Create Day 7: Success story + upgrade prompt',
          'Set up automation triggers',
        ],
      },

      // CRITICAL - Analytics
      {
        id: 'analytics-setup',
        category: 'analytics',
        task: 'Set up analytics tracking',
        description: 'Install analytics to track user behavior',
        status: 'pending',
        priority: 'critical',
        automated: true,
        dependencies: [],
        estimatedMinutes: 20,
        instructions: [
          'Create PostHog/Mixpanel/GA4 account',
          'Install tracking snippet in app',
          'Verify events are being captured',
          'Set up user identification',
        ],
      },
      {
        id: 'analytics-events',
        category: 'analytics',
        task: 'Define and implement key events',
        description: 'Track signup, activation, and conversion events',
        status: 'pending',
        priority: 'high',
        automated: true,
        dependencies: ['analytics-setup'],
        estimatedMinutes: 30,
        instructions: [
          'Track: signup_started, signup_completed',
          'Track: onboarding_step_X, activation',
          'Track: feature_used, upgrade_clicked',
          'Track: payment_started, payment_completed',
          'Create conversion funnels',
        ],
      },

      // HIGH - Ads Infrastructure
      {
        id: 'meta-pixel',
        category: 'ads',
        task: 'Install Meta (Facebook) Pixel',
        description: 'Set up Meta pixel for retargeting and conversion tracking',
        status: 'pending',
        priority: 'high',
        automated: true,
        dependencies: [],
        estimatedMinutes: 15,
        instructions: [
          'Create Meta Business account',
          'Create pixel in Events Manager',
          'Install pixel base code',
          'Set up standard events (PageView, Lead, Purchase)',
          'Verify pixel is firing correctly',
        ],
        mcpAction: {
          server: 'meta-ads-mcp',
          tool: 'create_pixel',
          parameters: { name: '{{app_name}} Pixel' },
        },
      },
      {
        id: 'google-ads-tag',
        category: 'ads',
        task: 'Install Google Ads conversion tracking',
        description: 'Set up Google tag for conversion tracking',
        status: 'pending',
        priority: 'high',
        automated: true,
        dependencies: [],
        estimatedMinutes: 15,
        instructions: [
          'Create Google Ads account',
          'Set up conversion actions',
          'Install Google tag (gtag.js)',
          'Configure conversion events',
          'Link to Google Analytics',
        ],
        mcpAction: {
          server: 'google-ads-mcp',
          tool: 'setup_conversion_tracking',
          parameters: {},
        },
      },
      {
        id: 'retargeting-audiences',
        category: 'ads',
        task: 'Create retargeting audiences',
        description: 'Set up audiences for retargeting campaigns',
        status: 'pending',
        priority: 'medium',
        automated: true,
        dependencies: ['meta-pixel', 'google-ads-tag'],
        estimatedMinutes: 20,
        instructions: [
          'Create "All Visitors" audience',
          'Create "Signed Up but Not Activated" audience',
          'Create "Activated but Not Paid" audience',
          'Create "High Intent" audience (pricing page visitors)',
        ],
      },
      {
        id: 'first-campaign',
        category: 'ads',
        task: 'Create first ad campaign (draft)',
        description: 'Prepare initial campaign ready to launch',
        status: 'pending',
        priority: 'medium',
        automated: true,
        dependencies: ['retargeting-audiences'],
        estimatedMinutes: 45,
        instructions: [
          'Define target audience',
          'Create 3-5 ad variations',
          'Set budget and schedule',
          'Configure conversion optimization',
          'Save as draft for launch day',
        ],
      },

      // HIGH - Legal
      {
        id: 'privacy-policy',
        category: 'legal',
        task: 'Create Privacy Policy',
        description: 'Generate GDPR/CCPA compliant privacy policy',
        status: 'pending',
        priority: 'critical',
        automated: true,
        dependencies: [],
        estimatedMinutes: 10,
        instructions: [
          'Use generator or template',
          'Customize for your data collection',
          'Include cookie usage',
          'Add contact information',
          'Publish at /privacy',
        ],
      },
      {
        id: 'terms-of-service',
        category: 'legal',
        task: 'Create Terms of Service',
        description: 'Generate terms of service document',
        status: 'pending',
        priority: 'critical',
        automated: true,
        dependencies: [],
        estimatedMinutes: 10,
        instructions: [
          'Use generator or template',
          'Define acceptable use',
          'Include liability limitations',
          'Add dispute resolution',
          'Publish at /terms',
        ],
      },
      {
        id: 'cookie-consent',
        category: 'legal',
        task: 'Implement cookie consent banner',
        description: 'Add GDPR-compliant cookie consent',
        status: 'pending',
        priority: 'high',
        automated: true,
        dependencies: ['privacy-policy'],
        estimatedMinutes: 15,
        instructions: [
          'Install cookie consent library',
          'Configure consent categories',
          'Block tracking until consent',
          'Store consent preferences',
        ],
      },

      // HIGH - Payments
      {
        id: 'stripe-setup',
        category: 'payments',
        task: 'Set up Stripe account',
        description: 'Configure Stripe for payments',
        status: 'pending',
        priority: 'high',
        automated: false,
        dependencies: [],
        estimatedMinutes: 30,
        instructions: [
          'Create Stripe account',
          'Complete business verification',
          'Set up products and prices',
          'Configure webhook endpoints',
          'Test with Stripe test mode',
        ],
      },
      {
        id: 'pricing-page',
        category: 'payments',
        task: 'Create pricing page',
        description: 'Build pricing page with Stripe checkout',
        status: 'pending',
        priority: 'high',
        automated: true,
        dependencies: ['stripe-setup'],
        estimatedMinutes: 30,
        instructions: [
          'Design pricing tiers',
          'Implement checkout buttons',
          'Add feature comparison',
          'Include FAQ section',
          'Add social proof',
        ],
      },

      // MEDIUM - SEO
      {
        id: 'meta-tags',
        category: 'seo',
        task: 'Add meta tags and OG images',
        description: 'Optimize for search and social sharing',
        status: 'pending',
        priority: 'medium',
        automated: true,
        dependencies: [],
        estimatedMinutes: 20,
        instructions: [
          'Add title and description meta tags',
          'Create Open Graph image (1200x630)',
          'Add OG tags for social sharing',
          'Add Twitter card tags',
          'Test with social preview tools',
        ],
      },
      {
        id: 'sitemap',
        category: 'seo',
        task: 'Create and submit sitemap',
        description: 'Generate sitemap and submit to search engines',
        status: 'pending',
        priority: 'medium',
        automated: true,
        dependencies: ['domain-setup'],
        estimatedMinutes: 10,
        instructions: [
          'Generate sitemap.xml',
          'Add to robots.txt',
          'Submit to Google Search Console',
          'Submit to Bing Webmaster Tools',
        ],
      },

      // MEDIUM - Distribution
      {
        id: 'product-hunt-prep',
        category: 'distribution',
        task: 'Prepare Product Hunt launch',
        description: 'Set up Product Hunt listing and assets',
        status: 'pending',
        priority: 'medium',
        automated: true,
        dependencies: [],
        estimatedMinutes: 60,
        instructions: [
          'Create maker profile',
          'Write compelling tagline (60 chars)',
          'Write description (260 chars)',
          'Create thumbnail (240x240)',
          'Prepare gallery images',
          'Write first comment',
          'Find a hunter (optional)',
        ],
      },
      {
        id: 'social-profiles',
        category: 'social',
        task: 'Set up social media profiles',
        description: 'Create consistent brand presence on social platforms',
        status: 'pending',
        priority: 'medium',
        automated: false,
        dependencies: [],
        estimatedMinutes: 30,
        instructions: [
          'Create Twitter/X account',
          'Create LinkedIn page',
          'Use consistent branding',
          'Add bio with value prop',
          'Link to website',
        ],
      },
      {
        id: 'launch-posts',
        category: 'social',
        task: 'Prepare launch day posts',
        description: 'Draft social media posts for launch',
        status: 'pending',
        priority: 'medium',
        automated: true,
        dependencies: ['social-profiles'],
        estimatedMinutes: 30,
        instructions: [
          'Write Twitter launch thread',
          'Write LinkedIn announcement',
          'Prepare community posts (Reddit, HN, IH)',
          'Create visual assets',
          'Schedule posts',
        ],
      },

      // MEDIUM - Support
      {
        id: 'support-email',
        category: 'support',
        task: 'Set up support email',
        description: 'Create support@domain email and forwarding',
        status: 'pending',
        priority: 'medium',
        automated: false,
        dependencies: ['domain-setup'],
        estimatedMinutes: 10,
        instructions: [
          'Create support@ email alias',
          'Set up forwarding to personal email',
          'Or use helpdesk (Crisp, Intercom)',
          'Add to website footer',
        ],
      },
      {
        id: 'feedback-widget',
        category: 'support',
        task: 'Add feedback collection',
        description: 'Install widget to collect user feedback',
        status: 'pending',
        priority: 'low',
        automated: true,
        dependencies: [],
        estimatedMinutes: 15,
        instructions: [
          'Choose tool (Canny, Nolt, or simple form)',
          'Install feedback widget',
          'Create feedback categories',
          'Set up notifications',
        ],
      },

      // Security
      {
        id: 'env-vars',
        category: 'security',
        task: 'Secure environment variables',
        description: 'Move all secrets to environment variables',
        status: 'pending',
        priority: 'critical',
        automated: false,
        dependencies: [],
        estimatedMinutes: 15,
        instructions: [
          'Audit codebase for hardcoded secrets',
          'Move API keys to env vars',
          'Set up .env.example',
          'Configure hosting env vars',
          'Never commit .env files',
        ],
      },
      {
        id: 'rate-limiting',
        category: 'security',
        task: 'Add rate limiting',
        description: 'Protect API endpoints from abuse',
        status: 'pending',
        priority: 'high',
        automated: true,
        dependencies: [],
        estimatedMinutes: 20,
        instructions: [
          'Add rate limiting middleware',
          'Configure limits per endpoint',
          'Add rate limit headers',
          'Log rate limit violations',
        ],
      },
    ];

    // Calculate progress
    const completed = items.filter(i => i.status === 'completed').length;
    const progress = Math.round((completed / items.length) * 100);

    return {
      items,
      progress,
      blockers: items.filter(i => i.status === 'blocked').map(i => i.task),
    };
  }

  // ============================================================================
  // EMAIL SETUP
  // ============================================================================

  private generateEmailSetup(appInfo: AppInfo): {
    templates: EmailTemplate[];
    sequences: EmailSequence[];
    setupSteps: string[];
  } {
    const templates: EmailTemplate[] = [
      {
        id: 'welcome',
        name: 'Welcome Email',
        type: 'transactional',
        subject: `Welcome to ${appInfo.name}! 🎉`,
        htmlContent: this.generateWelcomeEmailHTML(appInfo),
        textContent: this.generateWelcomeEmailText(appInfo),
        variables: ['firstName', 'email', 'activationLink'],
      },
      {
        id: 'activation-reminder',
        name: 'Activation Reminder',
        type: 'transactional',
        subject: `Quick tip to get started with ${appInfo.name}`,
        htmlContent: this.generateActivationReminderHTML(appInfo),
        textContent: this.generateActivationReminderText(appInfo),
        variables: ['firstName', 'nextStep'],
      },
      {
        id: 'trial-ending',
        name: 'Trial Ending',
        type: 'marketing',
        subject: `Your ${appInfo.name} trial ends in 3 days`,
        htmlContent: this.generateTrialEndingHTML(appInfo),
        textContent: this.generateTrialEndingText(appInfo),
        variables: ['firstName', 'trialEndDate', 'upgradeLink'],
      },
    ];

    const sequences: EmailSequence[] = [
      {
        id: 'onboarding',
        name: 'New User Onboarding',
        trigger: 'signup',
        emails: [
          {
            order: 1,
            delayHours: 0,
            subject: `Welcome to ${appInfo.name}! Let's get you started`,
            template: 'welcome',
          },
          {
            order: 2,
            delayHours: 24,
            subject: `Did you know ${appInfo.name} can do this?`,
            template: 'activation-reminder',
            conditions: [{ field: 'activated', operator: 'equals', value: false }],
          },
          {
            order: 3,
            delayHours: 72,
            subject: `${appInfo.name} tip: Our users' favorite feature`,
            template: 'activation-reminder',
            conditions: [{ field: 'activated', operator: 'equals', value: false }],
          },
          {
            order: 4,
            delayHours: 168,
            subject: `How [Company] achieved [Result] with ${appInfo.name}`,
            template: 'activation-reminder',
          },
        ],
      },
    ];

    return {
      templates,
      sequences,
      setupSteps: [
        '1. Sign up for Resend (resend.com) - free tier: 3,000 emails/month',
        '2. Add your domain and verify DNS records',
        '3. Copy these templates to your email provider',
        '4. Set up automation triggers in your app',
        '5. Test each email with a real send',
      ],
    };
  }

  private generateWelcomeEmailHTML(appInfo: AppInfo): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #111;">Welcome to ${appInfo.name}! 🎉</h1>

  <p>Hi {{firstName}},</p>

  <p>Thanks for signing up for ${appInfo.name}. ${appInfo.tagline}</p>

  <p><strong>Here's how to get started:</strong></p>

  <ol>
    <li>Complete your profile setup</li>
    <li>Try our core feature</li>
    <li>See your first results</li>
  </ol>

  <p style="margin: 30px 0;">
    <a href="{{activationLink}}" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Get Started →</a>
  </p>

  <p>Need help? Just reply to this email - we read every message.</p>

  <p>Best,<br>The ${appInfo.name} Team</p>
</body>
</html>`.trim();
  }

  private generateWelcomeEmailText(appInfo: AppInfo): string {
    return `
Welcome to ${appInfo.name}! 🎉

Hi {{firstName}},

Thanks for signing up for ${appInfo.name}. ${appInfo.tagline}

Here's how to get started:
1. Complete your profile setup
2. Try our core feature
3. See your first results

Get started: {{activationLink}}

Need help? Just reply to this email - we read every message.

Best,
The ${appInfo.name} Team
    `.trim();
  }

  private generateActivationReminderHTML(appInfo: AppInfo): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <p>Hi {{firstName}},</p>

  <p>I noticed you haven't had a chance to {{nextStep}} yet.</p>

  <p>Most of our users find that's the quickest way to see what ${appInfo.name} can do for them.</p>

  <p><strong>It only takes 2 minutes:</strong></p>

  <p style="margin: 20px 0;">
    <a href="{{activationLink}}" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Complete Setup →</a>
  </p>

  <p>Questions? Hit reply - I'm here to help!</p>

  <p>Best,<br>The ${appInfo.name} Team</p>
</body>
</html>`.trim();
  }

  private generateActivationReminderText(appInfo: AppInfo): string {
    return `
Hi {{firstName}},

I noticed you haven't had a chance to {{nextStep}} yet.

Most of our users find that's the quickest way to see what ${appInfo.name} can do for them.

It only takes 2 minutes: {{activationLink}}

Questions? Hit reply - I'm here to help!

Best,
The ${appInfo.name} Team
    `.trim();
  }

  private generateTrialEndingHTML(appInfo: AppInfo): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <p>Hi {{firstName}},</p>

  <p>Your ${appInfo.name} trial ends on {{trialEndDate}}.</p>

  <p>To keep access to all features, upgrade to a paid plan:</p>

  <p style="margin: 20px 0;">
    <a href="{{upgradeLink}}" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Plans →</a>
  </p>

  <p>Have questions about pricing? Just reply to this email.</p>

  <p>Best,<br>The ${appInfo.name} Team</p>
</body>
</html>`.trim();
  }

  private generateTrialEndingText(appInfo: AppInfo): string {
    return `
Hi {{firstName}},

Your ${appInfo.name} trial ends on {{trialEndDate}}.

To keep access to all features, upgrade to a paid plan: {{upgradeLink}}

Have questions about pricing? Just reply to this email.

Best,
The ${appInfo.name} Team
    `.trim();
  }

  // ============================================================================
  // ADS SETUP
  // ============================================================================

  private generateAdsSetup(appInfo: AppInfo, budget?: number): {
    pixelSetup: { platform: string; steps: string[] }[];
    audiences: { name: string; definition: string; platform: string }[];
    campaigns: AdsCampaign[];
    creatives: { type: string; templates: AdCreative[] }[];
  } {
    const monthlyBudget = budget || 500;
    const dailyBudget = Math.round(monthlyBudget / 30);

    return {
      pixelSetup: [
        {
          platform: 'Meta (Facebook/Instagram)',
          steps: [
            '1. Go to Meta Business Suite → Events Manager',
            '2. Click "Connect Data Sources" → "Web"',
            '3. Name your pixel and enter website URL',
            '4. Choose "Install code manually"',
            '5. Add base pixel code to <head> of all pages',
            '6. Add event code for key actions:',
            '   - PageView (automatic)',
            '   - Lead (on signup)',
            '   - CompleteRegistration (on activation)',
            '   - Purchase (on payment)',
            '7. Use Meta Pixel Helper extension to verify',
          ],
        },
        {
          platform: 'Google Ads',
          steps: [
            '1. Sign in to Google Ads',
            '2. Go to Tools → Conversions',
            '3. Click "+ New conversion action" → Website',
            '4. Set up conversion actions:',
            '   - Sign up (category: Lead)',
            '   - Purchase (category: Purchase)',
            '5. Copy the global site tag to <head>',
            '6. Add event snippets for each conversion',
            '7. Link Google Analytics 4 for enhanced tracking',
          ],
        },
      ],
      audiences: [
        {
          name: 'Website Visitors - All',
          definition: 'All visitors in last 180 days',
          platform: 'Both',
        },
        {
          name: 'High Intent - Pricing Page',
          definition: 'Visited pricing page in last 30 days',
          platform: 'Both',
        },
        {
          name: 'Signed Up Not Activated',
          definition: 'Completed signup but no activation event in 7 days',
          platform: 'Both',
        },
        {
          name: 'Lookalike - Customers',
          definition: '1% lookalike of paying customers',
          platform: 'Meta',
        },
      ],
      campaigns: [
        {
          id: 'launch-awareness',
          name: `${appInfo.name} Launch - Awareness`,
          platform: 'meta',
          objective: 'awareness',
          status: 'draft',
          budget: dailyBudget * 0.3,
          targeting: {
            interests: this.inferInterests(appInfo),
          },
          creatives: this.generateCreatives(appInfo, 'awareness'),
        },
        {
          id: 'launch-conversions',
          name: `${appInfo.name} Launch - Signups`,
          platform: 'meta',
          objective: 'conversions',
          status: 'draft',
          budget: dailyBudget * 0.5,
          targeting: {
            interests: this.inferInterests(appInfo),
          },
          creatives: this.generateCreatives(appInfo, 'conversion'),
        },
        {
          id: 'retargeting',
          name: `${appInfo.name} - Retargeting`,
          platform: 'meta',
          objective: 'conversions',
          status: 'draft',
          budget: dailyBudget * 0.2,
          targeting: {
            customAudiences: ['website-visitors', 'signed-up-not-activated'],
          },
          creatives: this.generateCreatives(appInfo, 'retargeting'),
        },
      ],
      creatives: [
        {
          type: 'awareness',
          templates: this.generateCreatives(appInfo, 'awareness'),
        },
        {
          type: 'conversion',
          templates: this.generateCreatives(appInfo, 'conversion'),
        },
        {
          type: 'retargeting',
          templates: this.generateCreatives(appInfo, 'retargeting'),
        },
      ],
    };
  }

  private inferInterests(appInfo: AppInfo): string[] {
    const categoryInterests: Record<string, string[]> = {
      productivity: ['Productivity', 'Project management', 'Notion', 'Trello', 'Asana'],
      marketing: ['Digital marketing', 'Social media marketing', 'Content marketing', 'SEO'],
      developer: ['Software development', 'Programming', 'GitHub', 'Web development'],
      design: ['Graphic design', 'UI/UX design', 'Figma', 'Adobe Creative Cloud'],
      finance: ['Personal finance', 'Investing', 'Accounting', 'Small business'],
      ecommerce: ['E-commerce', 'Shopify', 'Online shopping', 'Dropshipping'],
      default: ['Entrepreneurship', 'Startups', 'Small business', 'Technology'],
    };

    return categoryInterests[appInfo.category?.toLowerCase()] || categoryInterests.default;
  }

  private generateCreatives(appInfo: AppInfo, type: string): AdCreative[] {
    const creatives: AdCreative[] = [];

    if (type === 'awareness') {
      creatives.push({
        id: 'awareness-1',
        type: 'image',
        headline: appInfo.tagline,
        primaryText: `Introducing ${appInfo.name} - ${appInfo.description}`,
        callToAction: 'Learn More',
        link: '{{website_url}}',
      });
      creatives.push({
        id: 'awareness-2',
        type: 'image',
        headline: `Meet ${appInfo.name}`,
        primaryText: `The ${appInfo.category} tool you've been waiting for. ${appInfo.tagline}`,
        callToAction: 'Learn More',
        link: '{{website_url}}',
      });
    }

    if (type === 'conversion') {
      creatives.push({
        id: 'conversion-1',
        type: 'image',
        headline: `Try ${appInfo.name} Free`,
        primaryText: `${appInfo.tagline}\n\n✓ No credit card required\n✓ Set up in 2 minutes\n✓ Free forever plan`,
        callToAction: 'Sign Up',
        link: '{{website_url}}/signup',
      });
      creatives.push({
        id: 'conversion-2',
        type: 'image',
        headline: `${appInfo.pricing === 'free' ? 'Free' : 'Start Free'} - No Credit Card`,
        primaryText: `Join thousands using ${appInfo.name} to ${appInfo.description.toLowerCase()}`,
        callToAction: 'Sign Up',
        link: '{{website_url}}/signup',
      });
    }

    if (type === 'retargeting') {
      creatives.push({
        id: 'retargeting-1',
        type: 'image',
        headline: `Still thinking about ${appInfo.name}?`,
        primaryText: `Come back and finish setting up your account. It only takes 2 minutes.`,
        callToAction: 'Complete Setup',
        link: '{{website_url}}/login',
      });
      creatives.push({
        id: 'retargeting-2',
        type: 'image',
        headline: `Don't miss out`,
        primaryText: `You're one step away from experiencing ${appInfo.name}. Complete your signup now.`,
        callToAction: 'Sign Up',
        link: '{{website_url}}/signup',
      });
    }

    return creatives;
  }

  // ============================================================================
  // ANALYTICS SETUP
  // ============================================================================

  private generateAnalyticsSetup(appInfo: AppInfo): {
    recommendedProvider: string;
    events: AnalyticsEvent[];
    funnels: { name: string; steps: string[] }[];
    setupCode: string;
  } {
    return {
      recommendedProvider: 'PostHog (free up to 1M events/month)',
      events: [
        {
          name: 'signup_started',
          category: 'acquisition',
          description: 'User started signup process',
          properties: [{ name: 'source', type: 'string', required: false }],
          triggers: ['Signup form viewed'],
        },
        {
          name: 'signup_completed',
          category: 'acquisition',
          description: 'User completed signup',
          properties: [
            { name: 'method', type: 'string', required: true },
            { name: 'source', type: 'string', required: false },
          ],
          triggers: ['Account created'],
        },
        {
          name: 'onboarding_step_completed',
          category: 'activation',
          description: 'User completed onboarding step',
          properties: [
            { name: 'step', type: 'number', required: true },
            { name: 'step_name', type: 'string', required: true },
          ],
          triggers: ['Each onboarding step'],
        },
        {
          name: 'activation',
          category: 'activation',
          description: 'User reached activation moment',
          properties: [{ name: 'time_to_activate', type: 'number', required: true }],
          triggers: ['Core value delivered'],
        },
        {
          name: 'feature_used',
          category: 'engagement',
          description: 'User used a feature',
          properties: [
            { name: 'feature', type: 'string', required: true },
            { name: 'count', type: 'number', required: false },
          ],
          triggers: ['Any feature interaction'],
        },
        {
          name: 'upgrade_clicked',
          category: 'revenue',
          description: 'User clicked upgrade button',
          properties: [
            { name: 'plan', type: 'string', required: true },
            { name: 'location', type: 'string', required: true },
          ],
          triggers: ['Upgrade button clicked'],
        },
        {
          name: 'payment_completed',
          category: 'revenue',
          description: 'User completed payment',
          properties: [
            { name: 'plan', type: 'string', required: true },
            { name: 'amount', type: 'number', required: true },
            { name: 'currency', type: 'string', required: true },
          ],
          triggers: ['Stripe webhook: checkout.session.completed'],
        },
        {
          name: 'referral_sent',
          category: 'referral',
          description: 'User sent a referral',
          properties: [{ name: 'method', type: 'string', required: true }],
          triggers: ['Referral link shared'],
        },
      ],
      funnels: [
        {
          name: 'Signup to Activation',
          steps: ['signup_started', 'signup_completed', 'onboarding_step_completed', 'activation'],
        },
        {
          name: 'Activation to Payment',
          steps: ['activation', 'upgrade_clicked', 'payment_completed'],
        },
        {
          name: 'Full User Journey',
          steps: ['signup_completed', 'activation', 'feature_used', 'payment_completed'],
        },
      ],
      setupCode: `
// PostHog Setup (add to your app initialization)
import posthog from 'posthog-js'

posthog.init('YOUR_POSTHOG_KEY', {
  api_host: 'https://app.posthog.com',
  capture_pageview: true,
  capture_pageleave: true,
})

// Identify user after signup/login
posthog.identify(userId, {
  email: user.email,
  name: user.name,
  plan: user.plan,
  created_at: user.createdAt,
})

// Track events
posthog.capture('signup_completed', { method: 'email' })
posthog.capture('activation', { time_to_activate: 120 })
posthog.capture('feature_used', { feature: 'core_feature' })
posthog.capture('payment_completed', { plan: 'pro', amount: 29 })
      `.trim(),
    };
  }

  // ============================================================================
  // DISTRIBUTION PLAN
  // ============================================================================

  private generateDistributionPlan(appInfo: AppInfo, launchDate?: string): {
    productHunt: ProductHuntConfig;
    socialPosts: LaunchPost[];
    communities: { name: string; strategy: string; postTemplate: string }[];
    timeline: { day: string; activities: string[] }[];
  } {
    return {
      productHunt: {
        tagline: appInfo.tagline.slice(0, 60),
        description: appInfo.description.slice(0, 260),
        topics: this.inferPHTopics(appInfo),
        makers: [],
        firstComment: this.generatePHFirstComment(appInfo),
        media: {
          thumbnail: 'Create 240x240 logo/icon',
          gallery: ['Screenshot 1: Hero view', 'Screenshot 2: Key feature', 'Screenshot 3: Results/Dashboard'],
        },
      },
      socialPosts: [
        {
          platform: 'twitter',
          content: this.generateTwitterThread(appInfo),
          hashtags: ['buildinpublic', 'indiehackers', 'launch'],
        },
        {
          platform: 'linkedin',
          content: this.generateLinkedInPost(appInfo),
        },
        {
          platform: 'reddit',
          content: this.generateRedditPost(appInfo),
        },
      ],
      communities: [
        {
          name: 'Indie Hackers',
          strategy: 'Share as "Show IH" post, engage with comments',
          postTemplate: `🚀 I just launched ${appInfo.name} - ${appInfo.tagline}\n\nAfter X weeks of building, I'm excited to share what I've been working on.\n\n${appInfo.description}\n\nWould love your feedback!\n\n[Link]`,
        },
        {
          name: 'Hacker News (Show HN)',
          strategy: 'Technical angle, be ready to answer questions',
          postTemplate: `Show HN: ${appInfo.name} – ${appInfo.tagline}`,
        },
        {
          name: 'Reddit (r/SideProject, r/startups)',
          strategy: 'Be genuine, share the journey, follow subreddit rules',
          postTemplate: `I built ${appInfo.name} to solve [problem]. Here's what I learned.`,
        },
      ],
      timeline: [
        {
          day: 'T-7 (1 week before)',
          activities: [
            'Finalize Product Hunt assets',
            'Schedule social posts',
            'Reach out to hunter (if using one)',
            'Prepare email to existing users/waitlist',
            'Test all landing page links',
          ],
        },
        {
          day: 'T-1 (day before)',
          activities: [
            'Double-check PH submission',
            'Prepare first comment',
            'Alert friends/supporters about launch',
            'Get good sleep!',
          ],
        },
        {
          day: 'Launch Day',
          activities: [
            '12:01 AM PT: Product Hunt goes live',
            'Post first comment immediately',
            'Share on Twitter with thread',
            'Post on LinkedIn',
            'Email your list',
            'Engage with EVERY PH comment',
            'Post to communities (afternoon)',
            'Thank supporters',
          ],
        },
        {
          day: 'T+1 (day after)',
          activities: [
            'Continue engaging on PH',
            'Share results/stats thread',
            'Thank everyone who supported',
            'Capture learnings',
            'Follow up with new signups',
          ],
        },
      ],
    };
  }

  private inferPHTopics(appInfo: AppInfo): string[] {
    const topicMap: Record<string, string[]> = {
      productivity: ['Productivity', 'Task Management', 'Time Tracking'],
      marketing: ['Marketing', 'Social Media', 'Analytics'],
      developer: ['Developer Tools', 'Open Source', 'API'],
      design: ['Design Tools', 'User Experience', 'Prototyping'],
      ai: ['Artificial Intelligence', 'Machine Learning', 'Automation'],
      default: ['SaaS', 'Tech', 'Startup'],
    };
    return topicMap[appInfo.category?.toLowerCase()] || topicMap.default;
  }

  private generatePHFirstComment(appInfo: AppInfo): string {
    return `
Hey Product Hunt! 👋

I'm thrilled to launch ${appInfo.name} today.

**The Problem:**
[Describe the problem you're solving]

**The Solution:**
${appInfo.tagline}

**Key Features:**
• Feature 1
• Feature 2
• Feature 3

**What's Next:**
We're just getting started! Here's what's on the roadmap...

I'd love to hear your feedback and answer any questions. What would make ${appInfo.name} more useful for you?

Thanks for checking us out! 🙏
    `.trim();
  }

  private generateTwitterThread(appInfo: AppInfo): string {
    return `
🚀 Today I'm launching ${appInfo.name}!

${appInfo.tagline}

A thread on what it does and why I built it 🧵👇

---

1/ The problem:

[Describe the pain point]

I experienced this myself and couldn't find a good solution.

---

2/ So I built ${appInfo.name}

It helps you [key benefit] by [how it works].

[Screenshot]

---

3/ Key features:

✅ Feature 1
✅ Feature 2
✅ Feature 3

---

4/ It's ${appInfo.pricing === 'free' ? 'completely free' : 'free to try'}!

Check it out: [link]

Would love your feedback 🙏

---

5/ If you found this helpful:

• Give it a try
• RT the first tweet
• Follow for more updates

Thanks for reading! 🚀
    `.trim();
  }

  private generateLinkedInPost(appInfo: AppInfo): string {
    return `
🚀 Excited to announce the launch of ${appInfo.name}!

${appInfo.tagline}

After [X weeks/months] of building, I'm thrilled to share what I've been working on.

The problem I'm solving:
[Describe the problem]

How ${appInfo.name} helps:
→ Benefit 1
→ Benefit 2
→ Benefit 3

${appInfo.pricing === 'free' ? "It's completely free to use." : "You can try it free today."}

Link in comments 👇

I'd love to hear your thoughts and feedback!

#launch #startup #${appInfo.category || 'tech'}
    `.trim();
  }

  private generateRedditPost(appInfo: AppInfo): string {
    return `
**${appInfo.name} - ${appInfo.tagline}**

Hey everyone!

I just launched ${appInfo.name} and wanted to share it with this community.

**What it does:**
${appInfo.description}

**Why I built it:**
[Your story - be genuine]

**Key features:**
- Feature 1
- Feature 2
- Feature 3

${appInfo.pricing === 'free' ? "It's free to use!" : "There's a free tier to try it out."}

Link: [your-url]

Would really appreciate any feedback or suggestions. Happy to answer questions!
    `.trim();
  }

  // ============================================================================
  // LEGAL DOCUMENTS
  // ============================================================================

  private generateLegalDocuments(appInfo: AppInfo): {
    privacyPolicy: { sections: { title: string; content: string }[] };
    termsOfService: { sections: { title: string; content: string }[] };
    generators: { name: string; url: string; free: boolean }[];
  } {
    return {
      privacyPolicy: {
        sections: [
          {
            title: 'Information We Collect',
            content: 'We collect information you provide directly (email, name) and automatically (usage data, device info).',
          },
          {
            title: 'How We Use Your Information',
            content: 'To provide the service, improve the product, send updates, and respond to inquiries.',
          },
          {
            title: 'Data Sharing',
            content: 'We do not sell your data. We may share with service providers (hosting, email, analytics).',
          },
          {
            title: 'Your Rights',
            content: 'You can access, update, or delete your data. Contact us at [email].',
          },
          {
            title: 'Cookies',
            content: 'We use cookies for authentication, analytics, and advertising.',
          },
          {
            title: 'Contact',
            content: `For questions, contact us at support@${appInfo.name.toLowerCase().replace(/\s+/g, '')}.com`,
          },
        ],
      },
      termsOfService: {
        sections: [
          {
            title: 'Acceptance of Terms',
            content: `By using ${appInfo.name}, you agree to these terms.`,
          },
          {
            title: 'Description of Service',
            content: appInfo.description,
          },
          {
            title: 'User Responsibilities',
            content: 'You are responsible for your account and must not misuse the service.',
          },
          {
            title: 'Intellectual Property',
            content: `${appInfo.name} and its content are protected by copyright and trademark laws.`,
          },
          {
            title: 'Limitation of Liability',
            content: 'The service is provided "as is" without warranties. We are not liable for indirect damages.',
          },
          {
            title: 'Termination',
            content: 'We may terminate accounts that violate these terms.',
          },
        ],
      },
      generators: [
        { name: 'Termly', url: 'https://termly.io', free: true },
        { name: 'PrivacyPolicies.com', url: 'https://privacypolicies.com', free: true },
        { name: 'Iubenda', url: 'https://iubenda.com', free: false },
        { name: 'GetTerms', url: 'https://getterms.io', free: true },
      ],
    };
  }

  // ============================================================================
  // LAUNCH PLAN
  // ============================================================================

  private createLaunchPlan(appInfo: AppInfo, launchDate?: string): LaunchPlan {
    return {
      phases: [
        {
          name: 'Infrastructure Setup',
          order: 1,
          duration: '2-3 days',
          dependencies: [],
          tasks: [
            {
              id: 'infra-1',
              name: 'Domain & SSL',
              description: 'Configure domain and enable HTTPS',
              category: 'domain',
              automated: false,
              manualSteps: ['Purchase domain', 'Configure DNS', 'Verify SSL'],
              outputs: ['Live domain with HTTPS'],
              verification: 'Site loads on custom domain with padlock',
            },
            {
              id: 'infra-2',
              name: 'Email Setup',
              description: 'Configure transactional email',
              category: 'email',
              automated: false,
              mcpIntegration: 'resend-mcp',
              outputs: ['Verified sending domain', 'Email templates'],
              verification: 'Test email received successfully',
            },
          ],
        },
        {
          name: 'Tracking Setup',
          order: 2,
          duration: '1-2 days',
          dependencies: ['Infrastructure Setup'],
          tasks: [
            {
              id: 'tracking-1',
              name: 'Analytics',
              description: 'Install and configure analytics',
              category: 'analytics',
              automated: true,
              outputs: ['Tracking installed', 'Events defined'],
              verification: 'Events appearing in dashboard',
            },
            {
              id: 'tracking-2',
              name: 'Ad Pixels',
              description: 'Install Meta and Google pixels',
              category: 'ads',
              automated: true,
              mcpIntegration: 'meta-ads-mcp',
              outputs: ['Pixels installed', 'Conversions configured'],
              verification: 'Pixel Helper shows active pixel',
            },
          ],
        },
        {
          name: 'Legal & Compliance',
          order: 3,
          duration: '1 day',
          dependencies: [],
          tasks: [
            {
              id: 'legal-1',
              name: 'Legal Pages',
              description: 'Create privacy policy and terms',
              category: 'legal',
              automated: true,
              outputs: ['Privacy policy at /privacy', 'Terms at /terms'],
              verification: 'Pages accessible and linked in footer',
            },
          ],
        },
        {
          name: 'Launch Prep',
          order: 4,
          duration: '2-3 days',
          dependencies: ['Infrastructure Setup', 'Tracking Setup', 'Legal & Compliance'],
          tasks: [
            {
              id: 'launch-1',
              name: 'Product Hunt Setup',
              description: 'Prepare PH submission',
              category: 'distribution',
              automated: true,
              outputs: ['PH listing ready', 'Assets uploaded'],
              verification: 'Submission preview looks good',
            },
            {
              id: 'launch-2',
              name: 'Social Content',
              description: 'Prepare launch posts',
              category: 'social',
              automated: true,
              outputs: ['Posts drafted', 'Assets created'],
              verification: 'Posts scheduled or ready',
            },
          ],
        },
      ],
      timeline: {
        startDate: new Date().toISOString().split('T')[0],
        launchDate: launchDate || this.calculateLaunchDate(),
        milestones: [
          {
            name: 'Infrastructure Complete',
            date: this.addDays(3),
            criteria: ['Domain live', 'Email working', 'Payments configured'],
            blocking: true,
          },
          {
            name: 'Launch Ready',
            date: this.addDays(7),
            criteria: ['All checklist items complete', 'Content prepared', 'Team aligned'],
            blocking: true,
          },
        ],
      },
      resources: [
        {
          type: 'guide',
          name: 'Product Hunt Launch Guide',
          description: 'How to have a successful PH launch',
          url: 'https://blog.producthunt.com/how-to-launch-on-product-hunt-7c1843e06399',
        },
        {
          type: 'tool',
          name: 'Resend',
          description: 'Email API for transactional emails',
          url: 'https://resend.com',
          cost: 'Free up to 3,000 emails/month',
        },
        {
          type: 'tool',
          name: 'PostHog',
          description: 'Product analytics',
          url: 'https://posthog.com',
          cost: 'Free up to 1M events/month',
        },
      ],
    };
  }

  private calculateLaunchDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 14); // 2 weeks from now
    return date.toISOString().split('T')[0];
  }

  private addDays(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  // ============================================================================
  // QUICK START & MCP COMMANDS
  // ============================================================================

  private generateQuickStartGuide(appInfo: AppInfo): {
    day1: string[];
    day2: string[];
    day3: string[];
  } {
    return {
      day1: [
        '□ Set up custom domain (15 min)',
        '□ Enable SSL/HTTPS (5 min)',
        '□ Sign up for Resend and verify domain (20 min)',
        '□ Install PostHog analytics (10 min)',
        '□ Create privacy policy and terms (10 min)',
      ],
      day2: [
        '□ Set up welcome email template (15 min)',
        '□ Install Meta Pixel (15 min)',
        '□ Set up Google Ads conversion tracking (15 min)',
        '□ Configure Stripe products (20 min)',
        '□ Test payment flow (10 min)',
      ],
      day3: [
        '□ Create Product Hunt listing (30 min)',
        '□ Write launch posts (30 min)',
        '□ Set up support email (10 min)',
        '□ Final testing of all flows (30 min)',
        '□ Schedule launch! (10 min)',
      ],
    };
  }

  private generateMCPCommands(appInfo: AppInfo): {
    server: string;
    description: string;
    commands: { tool: string; description: string; example: string }[];
  }[] {
    return [
      {
        server: 'resend-mcp',
        description: 'Email sending and management',
        commands: [
          {
            tool: 'send_email',
            description: 'Send transactional email',
            example: `send_email(to: "user@example.com", subject: "Welcome!", html: "<p>Welcome to ${appInfo.name}!</p>")`,
          },
          {
            tool: 'create_domain',
            description: 'Add and verify sending domain',
            example: `create_domain(domain: "${appInfo.name.toLowerCase()}.com")`,
          },
        ],
      },
      {
        server: 'stripe-mcp',
        description: 'Payment processing',
        commands: [
          {
            tool: 'create_product',
            description: 'Create a product in Stripe',
            example: `create_product(name: "${appInfo.name} Pro", description: "Premium features")`,
          },
          {
            tool: 'create_checkout_session',
            description: 'Start checkout flow',
            example: `create_checkout_session(price_id: "price_xxx", success_url: "/success")`,
          },
        ],
      },
      {
        server: 'meta-ads-mcp',
        description: 'Facebook/Instagram advertising',
        commands: [
          {
            tool: 'create_campaign',
            description: 'Create ad campaign',
            example: `create_campaign(name: "${appInfo.name} Launch", objective: "CONVERSIONS")`,
          },
          {
            tool: 'create_audience',
            description: 'Create custom audience',
            example: `create_audience(name: "Website Visitors", source: "pixel")`,
          },
        ],
      },
      {
        server: 'google-ads-mcp',
        description: 'Google Ads management',
        commands: [
          {
            tool: 'create_conversion_action',
            description: 'Set up conversion tracking',
            example: `create_conversion_action(name: "Signup", category: "LEAD")`,
          },
        ],
      },
      {
        server: 'posthog-mcp',
        description: 'Product analytics',
        commands: [
          {
            tool: 'capture_event',
            description: 'Track custom event',
            example: `capture_event(event: "signup_completed", properties: {method: "email"})`,
          },
          {
            tool: 'create_funnel',
            description: 'Create conversion funnel',
            example: `create_funnel(name: "Signup to Activation", steps: ["signup", "activation"])`,
          },
        ],
      },
    ];
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  private getCategories(checklist: LaunchChecklist): LaunchCategory[] {
    return [...new Set(checklist.items.map(i => i.category))];
  }
}

export const launchAssistant = new LaunchAssistant();
