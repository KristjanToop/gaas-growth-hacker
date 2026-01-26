/**
 * Launch Automation Types
 *
 * Types for automating the launch of vibe-coded apps
 */

// ============================================================================
// LAUNCH CONFIGURATION
// ============================================================================

export interface LaunchConfig {
  app: AppInfo;
  domain: DomainConfig;
  email: EmailConfig;
  analytics: AnalyticsConfig;
  ads: AdsConfig;
  payments: PaymentConfig;
  legal: LegalConfig;
  distribution: DistributionConfig;
}

export interface AppInfo {
  name: string;
  tagline: string;
  description: string;
  category: string;
  targetAudience: string;
  pricing: 'free' | 'freemium' | 'paid' | 'subscription';
  url?: string;
  logoUrl?: string;
  screenshots?: string[];
}

// ============================================================================
// DOMAIN & HOSTING
// ============================================================================

export interface DomainConfig {
  domain: string;
  provider?: 'cloudflare' | 'namecheap' | 'godaddy' | 'vercel' | 'other';
  ssl: boolean;
  subdomains?: {
    app?: string;
    api?: string;
    docs?: string;
    blog?: string;
  };
}

// ============================================================================
// EMAIL CONFIGURATION
// ============================================================================

export interface EmailConfig {
  provider: 'resend' | 'sendgrid' | 'postmark' | 'mailgun' | 'ses';
  fromEmail: string;
  fromName: string;
  replyTo?: string;
  sequences: EmailSequence[];
  templates: EmailTemplate[];
}

export interface EmailSequence {
  id: string;
  name: string;
  trigger: EmailTrigger;
  emails: SequenceEmail[];
}

export type EmailTrigger =
  | 'signup'
  | 'activation'
  | 'trial_ending'
  | 'payment_failed'
  | 'churn_risk'
  | 'milestone'
  | 'referral'
  | 'feedback_request';

export interface SequenceEmail {
  order: number;
  delayHours: number;
  subject: string;
  template: string;
  conditions?: EmailCondition[];
}

export interface EmailCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'gt' | 'lt';
  value: unknown;
}

export interface EmailTemplate {
  id: string;
  name: string;
  type: 'transactional' | 'marketing';
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
}

// ============================================================================
// ANALYTICS CONFIGURATION
// ============================================================================

export interface AnalyticsConfig {
  providers: AnalyticsProvider[];
  events: AnalyticsEvent[];
  funnels: AnalyticsFunnel[];
  goals: AnalyticsGoal[];
}

export interface AnalyticsProvider {
  name: 'google-analytics' | 'posthog' | 'mixpanel' | 'amplitude' | 'plausible';
  trackingId: string;
  enabled: boolean;
  config?: Record<string, unknown>;
}

export interface AnalyticsEvent {
  name: string;
  category: 'acquisition' | 'activation' | 'engagement' | 'retention' | 'revenue' | 'referral';
  description: string;
  properties: EventProperty[];
  triggers: string[];
}

export interface EventProperty {
  name: string;
  type: 'string' | 'number' | 'boolean';
  required: boolean;
}

export interface AnalyticsFunnel {
  name: string;
  steps: string[];
  conversionWindow: number; // hours
}

export interface AnalyticsGoal {
  name: string;
  event: string;
  targetValue?: number;
  timeframe: 'daily' | 'weekly' | 'monthly';
}

// ============================================================================
// ADS CONFIGURATION
// ============================================================================

export interface AdsConfig {
  platforms: AdsPlatform[];
  budget: AdsBudget;
  targeting: AdsTargeting;
  campaigns: AdsCampaign[];
  pixels: AdsPixel[];
  conversions: AdsConversion[];
}

export interface AdsPlatform {
  name: 'meta' | 'google' | 'tiktok' | 'linkedin' | 'twitter';
  accountId?: string;
  enabled: boolean;
  pixelId?: string;
}

export interface AdsBudget {
  daily: number;
  monthly: number;
  currency: string;
  allocation: Record<string, number>; // platform -> percentage
}

export interface AdsTargeting {
  locations: string[];
  languages: string[];
  ageRange?: [number, number];
  interests?: string[];
  behaviors?: string[];
  customAudiences?: string[];
  lookalikes?: string[];
}

export interface AdsCampaign {
  id: string;
  name: string;
  platform: string;
  objective: CampaignObjective;
  status: 'draft' | 'ready' | 'active' | 'paused';
  budget: number;
  targeting: Partial<AdsTargeting>;
  creatives: AdCreative[];
  schedule?: CampaignSchedule;
}

export type CampaignObjective =
  | 'awareness'
  | 'traffic'
  | 'engagement'
  | 'leads'
  | 'app_installs'
  | 'conversions'
  | 'sales';

export interface AdCreative {
  id: string;
  type: 'image' | 'video' | 'carousel' | 'text';
  headline: string;
  primaryText: string;
  description?: string;
  callToAction: string;
  mediaUrl?: string;
  link: string;
}

export interface CampaignSchedule {
  startDate: string;
  endDate?: string;
  dayParting?: {
    days: number[];
    hours: [number, number];
  };
}

export interface AdsPixel {
  platform: string;
  pixelId: string;
  events: string[];
}

export interface AdsConversion {
  name: string;
  platform: string;
  event: string;
  value?: number;
  window: number; // days
}

// ============================================================================
// PAYMENTS CONFIGURATION
// ============================================================================

export interface PaymentConfig {
  provider: 'stripe' | 'paddle' | 'lemonsqueezy' | 'gumroad';
  currency: string;
  products: PaymentProduct[];
  pricing: PricingTier[];
  checkout: CheckoutConfig;
}

export interface PaymentProduct {
  id: string;
  name: string;
  description: string;
  type: 'one_time' | 'subscription';
}

export interface PricingTier {
  id: string;
  name: string;
  productId: string;
  price: number;
  interval?: 'month' | 'year';
  features: string[];
  highlighted?: boolean;
  trialDays?: number;
}

export interface CheckoutConfig {
  successUrl: string;
  cancelUrl: string;
  collectAddress: boolean;
  collectPhone: boolean;
  allowPromoCodes: boolean;
}

// ============================================================================
// LEGAL CONFIGURATION
// ============================================================================

export interface LegalConfig {
  companyName: string;
  companyAddress?: string;
  companyEmail: string;
  privacyPolicy: LegalDocument;
  termsOfService: LegalDocument;
  cookiePolicy?: LegalDocument;
  gdprCompliant: boolean;
  ccpaCompliant: boolean;
}

export interface LegalDocument {
  version: string;
  lastUpdated: string;
  url: string;
  content?: string;
}

// ============================================================================
// DISTRIBUTION CONFIGURATION
// ============================================================================

export interface DistributionConfig {
  productHunt?: ProductHuntConfig;
  socialMedia: SocialMediaConfig;
  communities: CommunityConfig[];
  press: PressConfig;
  appStores?: AppStoreConfig;
}

export interface ProductHuntConfig {
  scheduledDate?: string;
  tagline: string;
  description: string;
  topics: string[];
  makers: string[];
  hunterEmail?: string;
  firstComment: string;
  media: {
    thumbnail: string;
    gallery: string[];
    video?: string;
  };
}

export interface SocialMediaConfig {
  platforms: SocialPlatform[];
  launchPosts: LaunchPost[];
  contentCalendar?: ContentCalendarItem[];
}

export interface SocialPlatform {
  name: 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'tiktok' | 'reddit';
  handle: string;
  enabled: boolean;
}

export interface LaunchPost {
  platform: string;
  content: string;
  media?: string[];
  scheduledTime?: string;
  hashtags?: string[];
}

export interface ContentCalendarItem {
  date: string;
  platform: string;
  content: string;
  type: 'launch' | 'feature' | 'testimonial' | 'behind-scenes' | 'educational';
}

export interface CommunityConfig {
  name: string;
  platform: 'reddit' | 'discord' | 'slack' | 'facebook-group' | 'indie-hackers' | 'hacker-news';
  url: string;
  rules: string[];
  postStrategy: string;
}

export interface PressConfig {
  pressKit: {
    boilerplate: string;
    factSheet: Record<string, string>;
    logos: string[];
    screenshots: string[];
    founderBios: string[];
  };
  journalists: JournalistContact[];
  pitchTemplate: string;
}

export interface JournalistContact {
  name: string;
  outlet: string;
  email?: string;
  twitter?: string;
  beat: string[];
}

export interface AppStoreConfig {
  ios?: {
    appId: string;
    bundleId: string;
  };
  android?: {
    packageName: string;
  };
}

// ============================================================================
// LAUNCH CHECKLIST
// ============================================================================

export interface LaunchChecklist {
  items: LaunchChecklistItem[];
  progress: number;
  blockers: string[];
}

export interface LaunchChecklistItem {
  id: string;
  category: LaunchCategory;
  task: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'skipped';
  priority: 'critical' | 'high' | 'medium' | 'low';
  automated: boolean;
  dependencies: string[];
  estimatedMinutes: number;
  instructions?: string[];
  mcpAction?: MCPAction;
}

export type LaunchCategory =
  | 'domain'
  | 'email'
  | 'analytics'
  | 'ads'
  | 'payments'
  | 'legal'
  | 'security'
  | 'seo'
  | 'social'
  | 'distribution'
  | 'support';

export interface MCPAction {
  server: string;
  tool: string;
  parameters: Record<string, unknown>;
}

// ============================================================================
// LAUNCH EXECUTION
// ============================================================================

export interface LaunchPlan {
  phases: LaunchPhase[];
  timeline: LaunchTimeline;
  resources: LaunchResource[];
}

export interface LaunchPhase {
  name: string;
  order: number;
  tasks: LaunchTask[];
  duration: string;
  dependencies: string[];
}

export interface LaunchTask {
  id: string;
  name: string;
  description: string;
  category: LaunchCategory;
  automated: boolean;
  mcpIntegration?: string;
  manualSteps?: string[];
  outputs: string[];
  verification: string;
}

export interface LaunchTimeline {
  startDate: string;
  launchDate: string;
  milestones: LaunchMilestone[];
}

export interface LaunchMilestone {
  name: string;
  date: string;
  criteria: string[];
  blocking: boolean;
}

export interface LaunchResource {
  type: 'guide' | 'template' | 'tool' | 'service';
  name: string;
  description: string;
  url?: string;
  cost?: string;
}
