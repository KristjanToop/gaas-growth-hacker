/**
 * Core Types for GaaSAI Growth Hacker Skill
 * The most intelligent growth hacking system for Claude Code
 */

// ============================================================================
// SKILL FRAMEWORK TYPES
// ============================================================================

export interface Skill {
  id: string;
  name: string;
  description: string;
  version: string;
  capabilities: Capability[];
  execute(context: ExecutionContext): Promise<SkillResult>;
}

export interface Capability {
  id: string;
  name: string;
  description: string;
  inputSchema: Record<string, ParameterDefinition>;
  execute(input: Record<string, unknown>): Promise<CapabilityResult>;
}

export interface ParameterDefinition {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  required: boolean;
  default?: unknown;
  enum?: unknown[];
}

export interface ExecutionContext {
  sessionId: string;
  userId?: string;
  businessContext?: BusinessContext;
  previousResults?: SkillResult[];
}

export interface SkillResult {
  success: boolean;
  data: unknown;
  insights: string[];
  nextActions: RecommendedAction[];
  confidence: number;
}

export interface CapabilityResult {
  success: boolean;
  data: unknown;
  explanation: string;
}

export interface RecommendedAction {
  priority: 'critical' | 'high' | 'medium' | 'low';
  action: string;
  rationale: string;
  expectedImpact: string;
  effort: 'minimal' | 'low' | 'medium' | 'high';
}

// ============================================================================
// BUSINESS CONTEXT TYPES
// ============================================================================

export interface BusinessContext {
  company: CompanyProfile;
  product: ProductProfile;
  market: MarketProfile;
  currentMetrics: GrowthMetrics;
  personas: UserPersona[];
  competitors: Competitor[];
  objectives: GrowthObjective[];
}

export interface CompanyProfile {
  name: string;
  stage: 'idea' | 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'growth' | 'mature';
  industry: string;
  businessModel: BusinessModel;
  teamSize: number;
  monthlyBudget?: number;
  founded?: Date;
  location?: string;
}

export type BusinessModel =
  | 'saas'
  | 'marketplace'
  | 'ecommerce'
  | 'subscription'
  | 'freemium'
  | 'advertising'
  | 'transactional'
  | 'licensing'
  | 'agency'
  | 'hybrid';

export interface ProductProfile {
  name: string;
  type: 'b2b' | 'b2c' | 'b2b2c' | 'd2c';
  category: string;
  pricing: PricingModel;
  uniqueValueProposition: string;
  coreProblemSolved: string;
  keyFeatures: string[];
  integrations?: string[];
  platforms?: ('web' | 'ios' | 'android' | 'desktop' | 'api')[];
}

export interface PricingModel {
  type: 'free' | 'freemium' | 'paid' | 'usage-based' | 'tiered' | 'enterprise';
  lowestTier?: number;
  averageContractValue?: number;
  currency: string;
}

export interface MarketProfile {
  totalAddressableMarket?: number;
  serviceableAddressableMarket?: number;
  serviceableObtainableMarket?: number;
  growthRate?: number;
  maturity: 'emerging' | 'growing' | 'mature' | 'declining';
  keyTrends: string[];
  barriers: string[];
}

// ============================================================================
// GROWTH METRICS TYPES
// ============================================================================

export interface GrowthMetrics {
  // Acquisition Metrics
  monthlyActiveUsers?: number;
  weeklyActiveUsers?: number;
  dailyActiveUsers?: number;
  newUsersThisMonth?: number;
  signupConversionRate?: number;
  costPerAcquisition?: number;

  // Activation Metrics
  activationRate?: number;
  timeToValue?: number; // in hours
  onboardingCompletionRate?: number;

  // Retention Metrics
  day1Retention?: number;
  day7Retention?: number;
  day30Retention?: number;
  monthlyChurnRate?: number;
  netRevenueRetention?: number;

  // Revenue Metrics
  monthlyRecurringRevenue?: number;
  annualRecurringRevenue?: number;
  averageRevenuePerUser?: number;
  lifetimeValue?: number;

  // Viral Metrics
  viralCoefficient?: number;
  viralCycleTime?: number; // in days
  organicGrowthRate?: number;

  // Engagement Metrics
  sessionsPerUser?: number;
  sessionDuration?: number; // in minutes
  featureAdoptionRate?: number;
  npsScore?: number;
}

// ============================================================================
// USER PERSONA TYPES
// ============================================================================

export interface UserPersona {
  id: string;
  name: string;
  title: string;
  demographics: Demographics;
  psychographics: Psychographics;
  behaviors: UserBehaviors;
  painPoints: string[];
  goals: string[];
  objections: string[];
  preferredChannels: AcquisitionChannel[];
  buyingCriteria: string[];
  influencers: string[];
  valueProposition: string;
}

export interface Demographics {
  ageRange?: [number, number];
  gender?: 'male' | 'female' | 'non-binary' | 'all';
  location?: string[];
  income?: string;
  education?: string;
  companySize?: string;
  industry?: string;
  role?: string;
}

export interface Psychographics {
  values: string[];
  motivations: string[];
  fears: string[];
  aspirations: string[];
  personalityTraits: string[];
}

export interface UserBehaviors {
  researchHabits: string[];
  decisionMakingProcess: string;
  contentPreferences: string[];
  toolsUsed: string[];
  communities: string[];
  influencersFollowed: string[];
}

// ============================================================================
// ACQUISITION & CHANNELS TYPES
// ============================================================================

export type AcquisitionChannel =
  | 'organic-search'
  | 'paid-search'
  | 'social-organic'
  | 'social-paid'
  | 'content-marketing'
  | 'email-marketing'
  | 'referral'
  | 'affiliate'
  | 'partnerships'
  | 'product-led'
  | 'community'
  | 'events'
  | 'pr'
  | 'influencer'
  | 'cold-outreach'
  | 'direct';

export interface ChannelAnalysis {
  channel: AcquisitionChannel;
  currentPerformance: ChannelPerformance;
  potential: ChannelPotential;
  recommendations: string[];
  priority: number; // 1-10
}

export interface ChannelPerformance {
  traffic?: number;
  leads?: number;
  conversions?: number;
  revenue?: number;
  cac?: number;
  ltv?: number;
  roi?: number;
}

export interface ChannelPotential {
  marketSize: 'small' | 'medium' | 'large' | 'massive';
  competitorActivity: 'low' | 'medium' | 'high' | 'saturated';
  fitScore: number; // 1-100
  estimatedCac?: number;
  timeToResults: 'immediate' | 'short' | 'medium' | 'long';
  scalability: 'limited' | 'moderate' | 'high' | 'unlimited';
}

// ============================================================================
// GROWTH PLAYBOOK TYPES
// ============================================================================

export interface GrowthPlaybook {
  id: string;
  name: string;
  targetStage: 'acquisition' | 'activation' | 'retention' | 'revenue' | 'referral';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  timeframe: string;
  expectedOutcomes: ExpectedOutcome[];
  prerequisites: string[];
  steps: PlaybookStep[];
  metrics: string[];
  risks: Risk[];
  resources: Resource[];
  caseStudies?: CaseStudy[];
}

export interface ExpectedOutcome {
  metric: string;
  improvement: string;
  timeframe: string;
  confidence: number;
}

export interface PlaybookStep {
  order: number;
  title: string;
  description: string;
  tactics: Tactic[];
  duration: string;
  deliverables: string[];
  successCriteria: string[];
}

export interface Tactic {
  name: string;
  description: string;
  implementation: string[];
  tools?: string[];
  templates?: string[];
  examples?: string[];
}

export interface Risk {
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
}

export interface Resource {
  type: 'tool' | 'template' | 'guide' | 'example' | 'community';
  name: string;
  description: string;
  url?: string;
}

export interface CaseStudy {
  company: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
}

// ============================================================================
// VIRAL & REFERRAL TYPES
// ============================================================================

export interface ViralLoop {
  id: string;
  name: string;
  type: ViralLoopType;
  mechanism: string;
  triggers: ViralTrigger[];
  incentives: Incentive[];
  frictionPoints: string[];
  optimizations: string[];
  expectedKFactor: number;
  expectedCycleTime: number;
}

export type ViralLoopType =
  | 'word-of-mouth'
  | 'inherent-virality'
  | 'collaboration'
  | 'incentivized-referral'
  | 'social-proof'
  | 'content-sharing'
  | 'network-effects'
  | 'ugc-viral'
  | 'embedded-viral';

export interface ViralTrigger {
  event: string;
  timing: string;
  message: string;
  channel: string;
}

export interface Incentive {
  type: 'monetary' | 'feature' | 'status' | 'altruistic' | 'social';
  forReferrer: string;
  forReferred: string;
  conditions: string[];
}

// ============================================================================
// COMPETITOR TYPES
// ============================================================================

export interface Competitor {
  name: string;
  website: string;
  positioning: string;
  strengths: string[];
  weaknesses: string[];
  pricing: string;
  marketShare?: number;
  fundingStage?: string;
  keyDifferentiators: string[];
  channels: AcquisitionChannel[];
  contentStrategy?: string;
  productFeatures: string[];
}

export interface CompetitiveAnalysis {
  competitors: Competitor[];
  marketPosition: string;
  opportunities: string[];
  threats: string[];
  differentiationStrategy: string;
  competitiveAdvantages: string[];
  gaps: string[];
}

// ============================================================================
// OBJECTIVE & STRATEGY TYPES
// ============================================================================

export interface GrowthObjective {
  id: string;
  name: string;
  type: 'north-star' | 'okr' | 'kpi';
  metric: string;
  currentValue: number;
  targetValue: number;
  timeframe: string;
  priority: number;
  strategies: string[];
}

export interface GrowthStrategy {
  id: string;
  name: string;
  type: GrowthStrategyType;
  description: string;
  rationale: string;
  tactics: Tactic[];
  resources: ResourceRequirement[];
  timeline: Timeline;
  expectedResults: ExpectedOutcome[];
  risks: Risk[];
  dependencies: string[];
}

export type GrowthStrategyType =
  | 'product-led-growth'
  | 'sales-led-growth'
  | 'marketing-led-growth'
  | 'community-led-growth'
  | 'partnership-led-growth'
  | 'content-led-growth'
  | 'viral-growth'
  | 'paid-acquisition'
  | 'organic-growth';

export interface ResourceRequirement {
  type: 'budget' | 'time' | 'people' | 'tools' | 'expertise';
  description: string;
  quantity: string;
  priority: 'must-have' | 'should-have' | 'nice-to-have';
}

export interface Timeline {
  phases: TimelinePhase[];
  milestones: Milestone[];
  totalDuration: string;
}

export interface TimelinePhase {
  name: string;
  duration: string;
  objectives: string[];
  deliverables: string[];
}

export interface Milestone {
  name: string;
  date: string;
  criteria: string[];
}

// ============================================================================
// CONTENT & SEO TYPES
// ============================================================================

export interface ContentStrategy {
  pillars: ContentPillar[];
  formats: ContentFormat[];
  distribution: DistributionChannel[];
  calendar: ContentCalendarItem[];
  metrics: string[];
}

export interface ContentPillar {
  topic: string;
  keywords: string[];
  audience: string;
  objectives: string[];
  formats: ContentFormat[];
}

export type ContentFormat =
  | 'blog-post'
  | 'long-form-guide'
  | 'case-study'
  | 'whitepaper'
  | 'ebook'
  | 'video'
  | 'podcast'
  | 'webinar'
  | 'infographic'
  | 'social-post'
  | 'newsletter'
  | 'tool'
  | 'template'
  | 'comparison';

export interface DistributionChannel {
  channel: string;
  audience: string;
  frequency: string;
  bestPractices: string[];
}

export interface ContentCalendarItem {
  date: string;
  title: string;
  format: ContentFormat;
  pillar: string;
  status: 'idea' | 'planned' | 'in-progress' | 'review' | 'published';
  assignee?: string;
}

export interface SEOStrategy {
  targetKeywords: KeywordTarget[];
  technicalIssues: string[];
  contentGaps: string[];
  linkBuildingOpportunities: string[];
  localSEO?: LocalSEO;
}

export interface KeywordTarget {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  intent: 'informational' | 'navigational' | 'transactional' | 'commercial';
  currentRank?: number;
  targetRank: number;
  contentPlan: string;
}

export interface LocalSEO {
  targetLocations: string[];
  googleBusinessProfile: boolean;
  localCitations: string[];
  reviews: ReviewStrategy;
}

export interface ReviewStrategy {
  platforms: string[];
  targetRating: number;
  reviewGenerationTactics: string[];
}

// ============================================================================
// FUNNEL TYPES
// ============================================================================

export interface GrowthFunnel {
  stages: FunnelStage[];
  bottlenecks: Bottleneck[];
  optimizations: FunnelOptimization[];
}

export interface FunnelStage {
  name: string;
  description: string;
  entryMetric: number;
  exitMetric: number;
  conversionRate: number;
  dropOffReasons: string[];
  optimizations: string[];
}

export interface Bottleneck {
  stage: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  cause: string;
  impact: string;
  solutions: string[];
}

export interface FunnelOptimization {
  stage: string;
  tactic: string;
  expectedLift: string;
  effort: 'low' | 'medium' | 'high';
  priority: number;
}
