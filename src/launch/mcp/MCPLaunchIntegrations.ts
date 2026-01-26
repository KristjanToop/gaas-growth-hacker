/**
 * MCP Launch Integrations
 *
 * Model Context Protocol integrations for automating launch tasks:
 * - Email (Resend, SendGrid)
 * - Ads (Meta, Google)
 * - Analytics (PostHog)
 * - Payments (Stripe)
 * - Social (Twitter, LinkedIn)
 */

import { LaunchChecklistItem, MCPAction, AppInfo } from '../types';

// ============================================================================
// MCP SERVER CONFIGURATIONS
// ============================================================================

export interface MCPServerConfig {
  name: string;
  description: string;
  npmPackage?: string;
  githubUrl?: string;
  envVars: string[];
  tools: MCPTool[];
}

export interface MCPTool {
  name: string;
  description: string;
  parameters: MCPParameter[];
  returns: string;
  example: string;
}

export interface MCPParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export const MCP_SERVERS: MCPServerConfig[] = [
  // ============================================================================
  // EMAIL - RESEND
  // ============================================================================
  {
    name: 'resend-mcp',
    description: 'Send transactional and marketing emails via Resend API',
    npmPackage: '@anthropic/mcp-server-resend',
    envVars: ['RESEND_API_KEY'],
    tools: [
      {
        name: 'send_email',
        description: 'Send a single email',
        parameters: [
          { name: 'to', type: 'string | string[]', required: true, description: 'Recipient email(s)' },
          { name: 'subject', type: 'string', required: true, description: 'Email subject line' },
          { name: 'html', type: 'string', required: false, description: 'HTML content' },
          { name: 'text', type: 'string', required: false, description: 'Plain text content' },
          { name: 'from', type: 'string', required: false, description: 'Sender email (default from env)' },
          { name: 'reply_to', type: 'string', required: false, description: 'Reply-to address' },
        ],
        returns: '{ id: string, status: string }',
        example: `
// Send welcome email
await mcp.resend.send_email({
  to: "user@example.com",
  subject: "Welcome to Our App!",
  html: "<h1>Welcome!</h1><p>Thanks for signing up.</p>"
})`,
      },
      {
        name: 'send_batch',
        description: 'Send multiple emails in batch',
        parameters: [
          { name: 'emails', type: 'Email[]', required: true, description: 'Array of email objects' },
        ],
        returns: '{ id: string }[]',
        example: `
// Send to multiple users
await mcp.resend.send_batch({
  emails: users.map(user => ({
    to: user.email,
    subject: "Product Update",
    html: \`<p>Hi \${user.name}!</p>\`
  }))
})`,
      },
      {
        name: 'create_domain',
        description: 'Add a sending domain',
        parameters: [
          { name: 'domain', type: 'string', required: true, description: 'Domain to add' },
        ],
        returns: '{ id: string, records: DNSRecord[] }',
        example: `
// Add domain for sending
const { records } = await mcp.resend.create_domain({
  domain: "myapp.com"
})
// Returns DNS records to add`,
      },
      {
        name: 'verify_domain',
        description: 'Check domain verification status',
        parameters: [
          { name: 'domain_id', type: 'string', required: true, description: 'Domain ID' },
        ],
        returns: '{ status: "pending" | "verified" | "failed" }',
        example: `
// Check if domain is verified
const status = await mcp.resend.verify_domain({
  domain_id: "dom_xxx"
})`,
      },
    ],
  },

  // ============================================================================
  // ADS - META (FACEBOOK/INSTAGRAM)
  // ============================================================================
  {
    name: 'meta-ads-mcp',
    description: 'Manage Meta (Facebook/Instagram) advertising',
    githubUrl: 'https://github.com/anthropics/mcp-servers',
    envVars: ['META_ACCESS_TOKEN', 'META_AD_ACCOUNT_ID'],
    tools: [
      {
        name: 'create_campaign',
        description: 'Create a new ad campaign',
        parameters: [
          { name: 'name', type: 'string', required: true, description: 'Campaign name' },
          { name: 'objective', type: 'CampaignObjective', required: true, description: 'AWARENESS, TRAFFIC, ENGAGEMENT, LEADS, CONVERSIONS, SALES' },
          { name: 'status', type: 'string', required: false, description: 'PAUSED or ACTIVE (default PAUSED)' },
          { name: 'special_ad_categories', type: 'string[]', required: false, description: 'For housing, credit, employment ads' },
        ],
        returns: '{ id: string, name: string }',
        example: `
// Create launch campaign
await mcp.meta_ads.create_campaign({
  name: "Product Launch - Conversions",
  objective: "CONVERSIONS",
  status: "PAUSED"
})`,
      },
      {
        name: 'create_ad_set',
        description: 'Create ad set with targeting',
        parameters: [
          { name: 'campaign_id', type: 'string', required: true, description: 'Parent campaign ID' },
          { name: 'name', type: 'string', required: true, description: 'Ad set name' },
          { name: 'daily_budget', type: 'number', required: true, description: 'Daily budget in cents' },
          { name: 'targeting', type: 'Targeting', required: true, description: 'Targeting spec' },
          { name: 'optimization_goal', type: 'string', required: true, description: 'CONVERSIONS, LINK_CLICKS, etc.' },
          { name: 'billing_event', type: 'string', required: false, description: 'IMPRESSIONS or LINK_CLICKS' },
        ],
        returns: '{ id: string }',
        example: `
// Create ad set with interest targeting
await mcp.meta_ads.create_ad_set({
  campaign_id: "123",
  name: "Interest - Startups & Tech",
  daily_budget: 2000, // $20/day
  targeting: {
    geo_locations: { countries: ["US"] },
    age_min: 25,
    age_max: 45,
    interests: [{ id: "6003139266461", name: "Entrepreneurship" }]
  },
  optimization_goal: "CONVERSIONS"
})`,
      },
      {
        name: 'create_ad',
        description: 'Create an ad creative',
        parameters: [
          { name: 'ad_set_id', type: 'string', required: true, description: 'Parent ad set ID' },
          { name: 'name', type: 'string', required: true, description: 'Ad name' },
          { name: 'creative', type: 'Creative', required: true, description: 'Ad creative spec' },
        ],
        returns: '{ id: string }',
        example: `
// Create image ad
await mcp.meta_ads.create_ad({
  ad_set_id: "456",
  name: "Launch Ad - V1",
  creative: {
    title: "Try Our App Free",
    body: "The easiest way to...",
    image_url: "https://...",
    link: "https://myapp.com",
    call_to_action: "SIGN_UP"
  }
})`,
      },
      {
        name: 'create_custom_audience',
        description: 'Create a custom audience for retargeting',
        parameters: [
          { name: 'name', type: 'string', required: true, description: 'Audience name' },
          { name: 'description', type: 'string', required: false, description: 'Description' },
          { name: 'subtype', type: 'string', required: true, description: 'WEBSITE, ENGAGEMENT, CUSTOMER_FILE' },
          { name: 'rule', type: 'object', required: false, description: 'Audience rule for website audiences' },
        ],
        returns: '{ id: string }',
        example: `
// Create retargeting audience
await mcp.meta_ads.create_custom_audience({
  name: "Website Visitors - 30 Days",
  subtype: "WEBSITE",
  rule: {
    inclusions: [{
      event_sources: [{ id: "pixel_id" }],
      retention_seconds: 2592000 // 30 days
    }]
  }
})`,
      },
      {
        name: 'create_lookalike_audience',
        description: 'Create lookalike audience from source',
        parameters: [
          { name: 'name', type: 'string', required: true, description: 'Audience name' },
          { name: 'source_audience_id', type: 'string', required: true, description: 'Source custom audience' },
          { name: 'country', type: 'string', required: true, description: 'Target country' },
          { name: 'ratio', type: 'number', required: false, description: '0.01 to 0.20 (1% to 20%)' },
        ],
        returns: '{ id: string }',
        example: `
// Create 1% lookalike of customers
await mcp.meta_ads.create_lookalike_audience({
  name: "Lookalike - Customers 1%",
  source_audience_id: "customer_audience_id",
  country: "US",
  ratio: 0.01
})`,
      },
      {
        name: 'get_pixel_events',
        description: 'Get recent pixel events for debugging',
        parameters: [
          { name: 'pixel_id', type: 'string', required: true, description: 'Pixel ID' },
        ],
        returns: '{ events: Event[] }',
        example: `
// Check pixel is firing
const { events } = await mcp.meta_ads.get_pixel_events({
  pixel_id: "123456"
})`,
      },
    ],
  },

  // ============================================================================
  // ADS - GOOGLE
  // ============================================================================
  {
    name: 'google-ads-mcp',
    description: 'Manage Google Ads campaigns and conversions',
    envVars: ['GOOGLE_ADS_CLIENT_ID', 'GOOGLE_ADS_CLIENT_SECRET', 'GOOGLE_ADS_REFRESH_TOKEN', 'GOOGLE_ADS_CUSTOMER_ID'],
    tools: [
      {
        name: 'create_conversion_action',
        description: 'Set up conversion tracking',
        parameters: [
          { name: 'name', type: 'string', required: true, description: 'Conversion name' },
          { name: 'category', type: 'string', required: true, description: 'PURCHASE, LEAD, SIGNUP, etc.' },
          { name: 'value', type: 'number', required: false, description: 'Conversion value' },
          { name: 'counting_type', type: 'string', required: false, description: 'ONE_PER_CLICK or MANY_PER_CLICK' },
        ],
        returns: '{ id: string, tag: string }',
        example: `
// Create signup conversion
await mcp.google_ads.create_conversion_action({
  name: "Signup",
  category: "LEAD",
  counting_type: "ONE_PER_CLICK"
})`,
      },
      {
        name: 'create_campaign',
        description: 'Create a search or display campaign',
        parameters: [
          { name: 'name', type: 'string', required: true, description: 'Campaign name' },
          { name: 'type', type: 'string', required: true, description: 'SEARCH, DISPLAY, PERFORMANCE_MAX' },
          { name: 'budget_micros', type: 'number', required: true, description: 'Daily budget in micros' },
          { name: 'bidding_strategy', type: 'string', required: false, description: 'MAXIMIZE_CONVERSIONS, TARGET_CPA' },
        ],
        returns: '{ id: string }',
        example: `
// Create Performance Max campaign
await mcp.google_ads.create_campaign({
  name: "Launch - Performance Max",
  type: "PERFORMANCE_MAX",
  budget_micros: 20000000, // $20/day
  bidding_strategy: "MAXIMIZE_CONVERSIONS"
})`,
      },
      {
        name: 'upload_customer_list',
        description: 'Upload customer emails for matching',
        parameters: [
          { name: 'list_name', type: 'string', required: true, description: 'Audience list name' },
          { name: 'emails', type: 'string[]', required: true, description: 'Hashed email addresses' },
        ],
        returns: '{ id: string, match_rate: number }',
        example: `
// Upload customer list
await mcp.google_ads.upload_customer_list({
  list_name: "Existing Customers",
  emails: customers.map(c => sha256(c.email.toLowerCase()))
})`,
      },
    ],
  },

  // ============================================================================
  // ANALYTICS - POSTHOG
  // ============================================================================
  {
    name: 'posthog-mcp',
    description: 'Product analytics and event tracking',
    envVars: ['POSTHOG_API_KEY', 'POSTHOG_PROJECT_ID'],
    tools: [
      {
        name: 'capture',
        description: 'Track a custom event',
        parameters: [
          { name: 'distinct_id', type: 'string', required: true, description: 'User ID' },
          { name: 'event', type: 'string', required: true, description: 'Event name' },
          { name: 'properties', type: 'object', required: false, description: 'Event properties' },
        ],
        returns: '{ status: "ok" }',
        example: `
// Track signup
await mcp.posthog.capture({
  distinct_id: user.id,
  event: "signup_completed",
  properties: { method: "email", source: "product_hunt" }
})`,
      },
      {
        name: 'identify',
        description: 'Identify a user with properties',
        parameters: [
          { name: 'distinct_id', type: 'string', required: true, description: 'User ID' },
          { name: 'properties', type: 'object', required: true, description: 'User properties' },
        ],
        returns: '{ status: "ok" }',
        example: `
// Identify user
await mcp.posthog.identify({
  distinct_id: user.id,
  properties: {
    email: user.email,
    name: user.name,
    plan: "free",
    created_at: user.createdAt
  }
})`,
      },
      {
        name: 'create_action',
        description: 'Define a trackable action',
        parameters: [
          { name: 'name', type: 'string', required: true, description: 'Action name' },
          { name: 'steps', type: 'Step[]', required: true, description: 'Action definition steps' },
        ],
        returns: '{ id: number }',
        example: `
// Define activation action
await mcp.posthog.create_action({
  name: "User Activated",
  steps: [{
    event: "activation",
    properties: []
  }]
})`,
      },
      {
        name: 'create_cohort',
        description: 'Create a user cohort',
        parameters: [
          { name: 'name', type: 'string', required: true, description: 'Cohort name' },
          { name: 'groups', type: 'Group[]', required: true, description: 'Cohort definition' },
        ],
        returns: '{ id: number }',
        example: `
// Create power users cohort
await mcp.posthog.create_cohort({
  name: "Power Users",
  groups: [{
    properties: [{
      key: "session_count",
      value: 10,
      operator: "gt"
    }]
  }]
})`,
      },
      {
        name: 'query_insights',
        description: 'Query analytics data',
        parameters: [
          { name: 'insight_type', type: 'string', required: true, description: 'TRENDS, FUNNELS, RETENTION' },
          { name: 'events', type: 'Event[]', required: true, description: 'Events to analyze' },
          { name: 'date_from', type: 'string', required: false, description: 'Start date' },
          { name: 'date_to', type: 'string', required: false, description: 'End date' },
        ],
        returns: '{ results: any[] }',
        example: `
// Get signup trend
const { results } = await mcp.posthog.query_insights({
  insight_type: "TRENDS",
  events: [{ id: "signup_completed" }],
  date_from: "-7d"
})`,
      },
    ],
  },

  // ============================================================================
  // PAYMENTS - STRIPE
  // ============================================================================
  {
    name: 'stripe-mcp',
    description: 'Payment processing and subscription management',
    npmPackage: '@anthropic/mcp-server-stripe',
    envVars: ['STRIPE_SECRET_KEY'],
    tools: [
      {
        name: 'create_product',
        description: 'Create a product',
        parameters: [
          { name: 'name', type: 'string', required: true, description: 'Product name' },
          { name: 'description', type: 'string', required: false, description: 'Description' },
        ],
        returns: '{ id: string }',
        example: `
// Create product
await mcp.stripe.create_product({
  name: "Pro Plan",
  description: "Access to all premium features"
})`,
      },
      {
        name: 'create_price',
        description: 'Create a price for a product',
        parameters: [
          { name: 'product_id', type: 'string', required: true, description: 'Product ID' },
          { name: 'unit_amount', type: 'number', required: true, description: 'Price in cents' },
          { name: 'currency', type: 'string', required: true, description: 'Currency code' },
          { name: 'recurring', type: 'object', required: false, description: 'For subscriptions' },
        ],
        returns: '{ id: string }',
        example: `
// Create monthly subscription price
await mcp.stripe.create_price({
  product_id: "prod_xxx",
  unit_amount: 2900, // $29
  currency: "usd",
  recurring: { interval: "month" }
})`,
      },
      {
        name: 'create_checkout_session',
        description: 'Create checkout session for payment',
        parameters: [
          { name: 'price_id', type: 'string', required: true, description: 'Price ID' },
          { name: 'success_url', type: 'string', required: true, description: 'Success redirect URL' },
          { name: 'cancel_url', type: 'string', required: true, description: 'Cancel redirect URL' },
          { name: 'customer_email', type: 'string', required: false, description: 'Customer email' },
          { name: 'mode', type: 'string', required: false, description: 'payment or subscription' },
        ],
        returns: '{ id: string, url: string }',
        example: `
// Create checkout
const { url } = await mcp.stripe.create_checkout_session({
  price_id: "price_xxx",
  success_url: "https://myapp.com/success",
  cancel_url: "https://myapp.com/pricing",
  mode: "subscription"
})`,
      },
      {
        name: 'create_customer_portal_session',
        description: 'Create billing portal session',
        parameters: [
          { name: 'customer_id', type: 'string', required: true, description: 'Stripe customer ID' },
          { name: 'return_url', type: 'string', required: true, description: 'Return URL' },
        ],
        returns: '{ url: string }',
        example: `
// Let customer manage subscription
const { url } = await mcp.stripe.create_customer_portal_session({
  customer_id: "cus_xxx",
  return_url: "https://myapp.com/settings"
})`,
      },
    ],
  },

  // ============================================================================
  // SOCIAL - TWITTER
  // ============================================================================
  {
    name: 'twitter-mcp',
    description: 'Post and manage Twitter content',
    envVars: ['TWITTER_API_KEY', 'TWITTER_API_SECRET', 'TWITTER_ACCESS_TOKEN', 'TWITTER_ACCESS_SECRET'],
    tools: [
      {
        name: 'post_tweet',
        description: 'Post a tweet',
        parameters: [
          { name: 'text', type: 'string', required: true, description: 'Tweet text (max 280 chars)' },
          { name: 'media_ids', type: 'string[]', required: false, description: 'Attached media IDs' },
          { name: 'reply_to', type: 'string', required: false, description: 'Tweet ID to reply to' },
        ],
        returns: '{ id: string, text: string }',
        example: `
// Post launch tweet
await mcp.twitter.post_tweet({
  text: "🚀 Just launched! Check out our new product...",
})`,
      },
      {
        name: 'post_thread',
        description: 'Post a Twitter thread',
        parameters: [
          { name: 'tweets', type: 'string[]', required: true, description: 'Array of tweet texts' },
        ],
        returns: '{ ids: string[] }',
        example: `
// Post launch thread
await mcp.twitter.post_thread({
  tweets: [
    "🚀 Today I'm launching something I've been working on for months...",
    "Here's the problem I was facing...",
    "So I built this solution...",
    "Check it out: https://myapp.com"
  ]
})`,
      },
      {
        name: 'upload_media',
        description: 'Upload media for tweets',
        parameters: [
          { name: 'media_url', type: 'string', required: true, description: 'URL of media to upload' },
          { name: 'media_type', type: 'string', required: true, description: 'image or video' },
        ],
        returns: '{ media_id: string }',
        example: `
// Upload image
const { media_id } = await mcp.twitter.upload_media({
  media_url: "https://myapp.com/screenshot.png",
  media_type: "image"
})`,
      },
    ],
  },
];

// ============================================================================
// MCP COMMAND GENERATOR
// ============================================================================

export class MCPCommandGenerator {
  /**
   * Generate MCP commands for a checklist item
   */
  generateCommandsForTask(item: LaunchChecklistItem, appInfo: AppInfo): string[] {
    const commands: string[] = [];

    switch (item.id) {
      case 'email-domain-verify':
        commands.push(this.generateResendDomainSetup(appInfo));
        break;
      case 'transactional-emails':
        commands.push(this.generateEmailTemplateSetup(appInfo));
        break;
      case 'meta-pixel':
        commands.push(this.generateMetaPixelSetup(appInfo));
        break;
      case 'retargeting-audiences':
        commands.push(this.generateAudienceSetup(appInfo));
        break;
      case 'first-campaign':
        commands.push(this.generateCampaignSetup(appInfo));
        break;
      case 'analytics-setup':
        commands.push(this.generateAnalyticsSetup(appInfo));
        break;
      case 'stripe-setup':
        commands.push(this.generateStripeSetup(appInfo));
        break;
    }

    return commands;
  }

  private generateResendDomainSetup(appInfo: AppInfo): string {
    const domain = appInfo.url?.replace(/https?:\/\//, '').split('/')[0] || 'yourdomain.com';
    return `
// Set up email sending domain with Resend MCP
const domain = await mcp.resend.create_domain({
  domain: "${domain}"
});

// Add these DNS records to your domain:
console.log("Add these DNS records:");
for (const record of domain.records) {
  console.log(\`\${record.type}: \${record.name} -> \${record.value}\`);
}

// After adding records, verify:
await mcp.resend.verify_domain({ domain_id: domain.id });
    `.trim();
  }

  private generateEmailTemplateSetup(appInfo: AppInfo): string {
    return `
// Send welcome email when user signs up
async function sendWelcomeEmail(user) {
  await mcp.resend.send_email({
    to: user.email,
    subject: "Welcome to ${appInfo.name}! 🎉",
    html: \`
      <h1>Welcome to ${appInfo.name}!</h1>
      <p>Hi \${user.name},</p>
      <p>${appInfo.tagline}</p>
      <a href="${appInfo.url}/dashboard">Get Started →</a>
    \`
  });
}

// Send activation reminder after 24 hours
async function sendActivationReminder(user) {
  await mcp.resend.send_email({
    to: user.email,
    subject: "Quick tip to get started with ${appInfo.name}",
    html: \`
      <p>Hi \${user.name},</p>
      <p>I noticed you haven't completed setup yet...</p>
    \`
  });
}
    `.trim();
  }

  private generateMetaPixelSetup(appInfo: AppInfo): string {
    return `
// Initialize Meta Pixel tracking
// Add this to your app's <head>:

!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');

// Track key events:
// On signup:
fbq('track', 'Lead', { content_name: '${appInfo.name} Signup' });

// On activation:
fbq('track', 'CompleteRegistration');

// On payment:
fbq('track', 'Purchase', { value: 29.00, currency: 'USD' });
    `.trim();
  }

  private generateAudienceSetup(appInfo: AppInfo): string {
    return `
// Create retargeting audiences with Meta Ads MCP

// All website visitors
const visitors = await mcp.meta_ads.create_custom_audience({
  name: "${appInfo.name} - All Visitors 180d",
  subtype: "WEBSITE",
  rule: {
    inclusions: [{
      event_sources: [{ id: process.env.META_PIXEL_ID }],
      retention_seconds: 15552000 // 180 days
    }]
  }
});

// Signed up but not activated
const notActivated = await mcp.meta_ads.create_custom_audience({
  name: "${appInfo.name} - Signup No Activation",
  subtype: "WEBSITE",
  rule: {
    inclusions: [{
      event_sources: [{ id: process.env.META_PIXEL_ID }],
      filter: { filters: [{ field: "event", operator: "eq", value: "Lead" }] }
    }],
    exclusions: [{
      event_sources: [{ id: process.env.META_PIXEL_ID }],
      filter: { filters: [{ field: "event", operator: "eq", value: "CompleteRegistration" }] }
    }]
  }
});

// High intent - pricing page visitors
const highIntent = await mcp.meta_ads.create_custom_audience({
  name: "${appInfo.name} - Pricing Page 30d",
  subtype: "WEBSITE",
  rule: {
    inclusions: [{
      event_sources: [{ id: process.env.META_PIXEL_ID }],
      retention_seconds: 2592000,
      filter: { filters: [{ field: "url", operator: "i_contains", value: "/pricing" }] }
    }]
  }
});

console.log("Created audiences:", { visitors, notActivated, highIntent });
    `.trim();
  }

  private generateCampaignSetup(appInfo: AppInfo): string {
    return `
// Create launch campaign with Meta Ads MCP

// 1. Create campaign
const campaign = await mcp.meta_ads.create_campaign({
  name: "${appInfo.name} Launch - Conversions",
  objective: "CONVERSIONS",
  status: "PAUSED" // Start paused, activate on launch day
});

// 2. Create ad set with targeting
const adSet = await mcp.meta_ads.create_ad_set({
  campaign_id: campaign.id,
  name: "Interest - ${appInfo.category || 'Tech'} Enthusiasts",
  daily_budget: 2000, // $20/day
  targeting: {
    geo_locations: { countries: ["US"] },
    age_min: 25,
    age_max: 45,
    interests: [
      { id: "6003139266461", name: "Entrepreneurship" },
      { id: "6003384248805", name: "Small business" },
    ]
  },
  optimization_goal: "CONVERSIONS",
  billing_event: "IMPRESSIONS"
});

// 3. Create ad creative
const ad = await mcp.meta_ads.create_ad({
  ad_set_id: adSet.id,
  name: "Launch Ad v1",
  creative: {
    title: "Try ${appInfo.name} Free",
    body: "${appInfo.tagline}\\n\\n✓ No credit card required\\n✓ Set up in 2 minutes",
    image_url: "${appInfo.logoUrl || 'YOUR_AD_IMAGE_URL'}",
    link: "${appInfo.url || 'https://yourapp.com'}",
    call_to_action: "SIGN_UP"
  }
});

console.log("Campaign ready:", { campaign, adSet, ad });
console.log("Activate campaign on launch day!");
    `.trim();
  }

  private generateAnalyticsSetup(appInfo: AppInfo): string {
    return `
// Set up PostHog analytics

import posthog from 'posthog-js';

// Initialize PostHog
posthog.init('YOUR_POSTHOG_KEY', {
  api_host: 'https://app.posthog.com',
  capture_pageview: true,
});

// Identify user on signup/login
function identifyUser(user) {
  posthog.identify(user.id, {
    email: user.email,
    name: user.name,
    plan: user.plan || 'free',
    created_at: user.createdAt,
  });
}

// Track key events
const trackSignup = (method) =>
  posthog.capture('signup_completed', { method });

const trackActivation = (timeToActivate) =>
  posthog.capture('activation', { time_to_activate: timeToActivate });

const trackFeatureUsed = (feature) =>
  posthog.capture('feature_used', { feature });

const trackUpgradeClicked = (plan, location) =>
  posthog.capture('upgrade_clicked', { plan, location });

const trackPayment = (plan, amount) =>
  posthog.capture('payment_completed', { plan, amount });

export { identifyUser, trackSignup, trackActivation, trackFeatureUsed, trackUpgradeClicked, trackPayment };
    `.trim();
  }

  private generateStripeSetup(appInfo: AppInfo): string {
    return `
// Set up Stripe products and prices

// 1. Create products
const freeProduct = await mcp.stripe.create_product({
  name: "${appInfo.name} Free",
  description: "Basic features for getting started"
});

const proProduct = await mcp.stripe.create_product({
  name: "${appInfo.name} Pro",
  description: "Full access to all premium features"
});

// 2. Create prices
const proMonthlyPrice = await mcp.stripe.create_price({
  product_id: proProduct.id,
  unit_amount: 2900, // $29/month
  currency: "usd",
  recurring: { interval: "month" }
});

const proYearlyPrice = await mcp.stripe.create_price({
  product_id: proProduct.id,
  unit_amount: 29000, // $290/year (2 months free)
  currency: "usd",
  recurring: { interval: "year" }
});

// 3. Create checkout function for your app
async function createCheckout(priceId, customerEmail) {
  const session = await mcp.stripe.create_checkout_session({
    price_id: priceId,
    customer_email: customerEmail,
    success_url: "${appInfo.url}/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "${appInfo.url}/pricing",
    mode: "subscription"
  });
  return session.url;
}

console.log("Stripe setup complete:", {
  proMonthlyPrice: proMonthlyPrice.id,
  proYearlyPrice: proYearlyPrice.id
});
    `.trim();
  }
}

export const mcpCommandGenerator = new MCPCommandGenerator();
