/**
 * ChannelAnalyzer - Acquisition Channel Analysis & Prioritization
 *
 * Analyzes and prioritizes acquisition channels based on business context,
 * industry benchmarks, and growth objectives.
 */

import {
  ChannelAnalysis,
  AcquisitionChannel,
  ChannelPerformance,
  ChannelPotential,
  BusinessContext,
  CapabilityResult,
} from '../../core/types';

interface ChannelProfile {
  channel: AcquisitionChannel;
  bestFor: string[];
  notFor: string[];
  avgCac: { b2b: number; b2c: number };
  timeToResults: 'immediate' | 'short' | 'medium' | 'long';
  scalability: 'limited' | 'moderate' | 'high' | 'unlimited';
  difficulty: 'easy' | 'medium' | 'hard';
  tactics: string[];
}

export class ChannelAnalyzer {
  private channelProfiles: Map<AcquisitionChannel, ChannelProfile> = new Map();

  constructor() {
    this.initializeChannelProfiles();
  }

  async execute(input: Record<string, unknown>): Promise<CapabilityResult> {
    const industry = input.industry as string;
    const productType = input.productType as string;
    const budget = input.budget as number | undefined;
    const currentChannels = input.currentChannels as AcquisitionChannel[] | undefined;
    const targetCac = input.targetCac as number | undefined;

    const analysis = this.analyzeChannels(industry, productType, budget, currentChannels, targetCac);

    return {
      success: true,
      data: {
        channelAnalysis: analysis,
        topRecommendations: analysis.slice(0, 3),
        channelMix: this.recommendChannelMix(analysis, budget),
        implementationPriority: this.prioritizeImplementation(analysis),
      },
      explanation: `Analyzed ${analysis.length} channels. Top recommendations: ${analysis.slice(0, 3).map(a => a.channel).join(', ')}`,
    };
  }

  analyzeAll(context: BusinessContext): ChannelAnalysis[] {
    const { company, product, currentMetrics } = context;

    return this.analyzeChannels(
      company.industry,
      product.type,
      company.monthlyBudget,
      undefined,
      currentMetrics.costPerAcquisition
    );
  }

  private analyzeChannels(
    industry: string,
    productType: string,
    budget?: number,
    currentChannels?: AcquisitionChannel[],
    targetCac?: number
  ): ChannelAnalysis[] {
    const analyses: ChannelAnalysis[] = [];

    for (const [channel, profile] of this.channelProfiles) {
      const fitScore = this.calculateFitScore(profile, industry, productType, budget);
      const potential = this.assessPotential(profile, productType, fitScore);
      const recommendations = this.generateChannelRecommendations(profile, productType, industry);

      analyses.push({
        channel,
        currentPerformance: this.estimateCurrentPerformance(channel, currentChannels),
        potential,
        recommendations,
        priority: this.calculatePriority(fitScore, potential, budget, targetCac),
      });
    }

    return analyses.sort((a, b) => b.priority - a.priority);
  }

  private calculateFitScore(
    profile: ChannelProfile,
    industry: string,
    productType: string,
    budget?: number
  ): number {
    let score = 50; // Base score

    // Check if channel is good for this type
    if (profile.bestFor.some(b => b.toLowerCase().includes(productType.toLowerCase()))) {
      score += 20;
    }

    // Check if industry match
    if (profile.bestFor.some(b => b.toLowerCase().includes(industry.toLowerCase()))) {
      score += 15;
    }

    // Check if explicitly not for this type
    if (profile.notFor.some(n => n.toLowerCase().includes(productType.toLowerCase()))) {
      score -= 30;
    }

    // Budget considerations
    if (budget) {
      const expectedCac = productType === 'b2b' ? profile.avgCac.b2b : profile.avgCac.b2c;
      if (budget < 1000 && expectedCac > 100) {
        score -= 20; // Channel too expensive for budget
      }
      if (budget > 10000 && profile.scalability === 'unlimited') {
        score += 10; // Can leverage budget with scalable channel
      }
    }

    // Difficulty adjustment
    if (profile.difficulty === 'easy') score += 5;
    if (profile.difficulty === 'hard') score -= 5;

    return Math.max(0, Math.min(100, score));
  }

  private assessPotential(
    profile: ChannelProfile,
    productType: string,
    fitScore: number
  ): ChannelPotential {
    const expectedCac = productType === 'b2b' ? profile.avgCac.b2b : profile.avgCac.b2c;

    return {
      marketSize: this.estimateMarketSize(profile.channel),
      competitorActivity: this.estimateCompetitorActivity(profile.channel),
      fitScore,
      estimatedCac: expectedCac,
      timeToResults: profile.timeToResults,
      scalability: profile.scalability,
    };
  }

  private estimateMarketSize(channel: AcquisitionChannel): 'small' | 'medium' | 'large' | 'massive' {
    const sizes: Record<AcquisitionChannel, 'small' | 'medium' | 'large' | 'massive'> = {
      'organic-search': 'massive',
      'paid-search': 'massive',
      'social-organic': 'large',
      'social-paid': 'massive',
      'content-marketing': 'large',
      'email-marketing': 'medium',
      'referral': 'medium',
      'affiliate': 'medium',
      'partnerships': 'medium',
      'product-led': 'large',
      'community': 'medium',
      'events': 'small',
      'pr': 'large',
      'influencer': 'large',
      'cold-outreach': 'medium',
      'direct': 'small',
    };
    return sizes[channel];
  }

  private estimateCompetitorActivity(channel: AcquisitionChannel): 'low' | 'medium' | 'high' | 'saturated' {
    const activity: Record<AcquisitionChannel, 'low' | 'medium' | 'high' | 'saturated'> = {
      'organic-search': 'saturated',
      'paid-search': 'high',
      'social-organic': 'high',
      'social-paid': 'high',
      'content-marketing': 'high',
      'email-marketing': 'medium',
      'referral': 'low',
      'affiliate': 'medium',
      'partnerships': 'low',
      'product-led': 'medium',
      'community': 'low',
      'events': 'medium',
      'pr': 'medium',
      'influencer': 'medium',
      'cold-outreach': 'high',
      'direct': 'low',
    };
    return activity[channel];
  }

  private estimateCurrentPerformance(
    channel: AcquisitionChannel,
    currentChannels?: AcquisitionChannel[]
  ): ChannelPerformance {
    const isActive = currentChannels?.includes(channel) ?? false;

    return {
      traffic: isActive ? undefined : 0,
      leads: isActive ? undefined : 0,
      conversions: isActive ? undefined : 0,
      revenue: isActive ? undefined : 0,
      cac: undefined,
      ltv: undefined,
      roi: undefined,
    };
  }

  private generateChannelRecommendations(
    profile: ChannelProfile,
    productType: string,
    industry: string
  ): string[] {
    const recommendations: string[] = [];

    // Add general tactics
    for (const tactic of profile.tactics.slice(0, 3)) {
      recommendations.push(tactic);
    }

    // Add product-type specific recommendations
    if (productType === 'b2b') {
      recommendations.push('Focus on high-intent keywords and decision-maker targeting');
      recommendations.push('Create case studies and ROI calculators');
    } else {
      recommendations.push('Focus on emotional appeal and social proof');
      recommendations.push('Leverage user-generated content');
    }

    return recommendations;
  }

  private calculatePriority(
    fitScore: number,
    potential: ChannelPotential,
    budget?: number,
    targetCac?: number
  ): number {
    let priority = fitScore;

    // Boost channels with quick results for early-stage
    if (potential.timeToResults === 'immediate') priority += 10;
    if (potential.timeToResults === 'short') priority += 5;

    // Boost scalable channels for funded companies
    if (budget && budget > 5000 && potential.scalability === 'unlimited') {
      priority += 10;
    }

    // Consider CAC efficiency
    if (targetCac && potential.estimatedCac) {
      if (potential.estimatedCac <= targetCac) priority += 10;
      if (potential.estimatedCac > targetCac * 2) priority -= 15;
    }

    // Penalize saturated channels slightly
    if (potential.competitorActivity === 'saturated') priority -= 5;

    return Math.round(priority / 10); // Normalize to 1-10 scale
  }

  private recommendChannelMix(analysis: ChannelAnalysis[], budget?: number): {
    primary: AcquisitionChannel[];
    secondary: AcquisitionChannel[];
    experimental: AcquisitionChannel[];
  } {
    const sorted = [...analysis].sort((a, b) => b.priority - a.priority);

    return {
      primary: sorted.slice(0, 2).map(a => a.channel),
      secondary: sorted.slice(2, 5).map(a => a.channel),
      experimental: sorted.slice(5, 8).map(a => a.channel),
    };
  }

  private prioritizeImplementation(analysis: ChannelAnalysis[]): {
    channel: AcquisitionChannel;
    week: number;
    focus: string;
  }[] {
    const sorted = [...analysis].sort((a, b) => b.priority - a.priority);

    return sorted.slice(0, 6).map((a, index) => ({
      channel: a.channel,
      week: Math.floor(index / 2) + 1,
      focus: a.recommendations[0] || 'Initial setup and testing',
    }));
  }

  private initializeChannelProfiles(): void {
    this.channelProfiles.set('organic-search', {
      channel: 'organic-search',
      bestFor: ['b2b', 'saas', 'content-heavy', 'high-intent searches'],
      notFor: ['brand new categories', 'no search demand'],
      avgCac: { b2b: 50, b2c: 15 },
      timeToResults: 'long',
      scalability: 'high',
      difficulty: 'hard',
      tactics: [
        'Keyword research targeting high-intent terms',
        'Create comprehensive pillar content',
        'Build topical authority through content clusters',
        'Optimize technical SEO fundamentals',
        'Build high-quality backlinks',
        'Create programmatic SEO pages for scale',
      ],
    });

    this.channelProfiles.set('paid-search', {
      channel: 'paid-search',
      bestFor: ['b2b', 'saas', 'high-intent', 'established demand'],
      notFor: ['low margins', 'no search demand', 'bootstrap'],
      avgCac: { b2b: 150, b2c: 30 },
      timeToResults: 'immediate',
      scalability: 'unlimited',
      difficulty: 'medium',
      tactics: [
        'Start with high-intent bottom-funnel keywords',
        'Create dedicated landing pages per keyword group',
        'Implement negative keyword lists',
        'Use audience targeting for remarketing',
        'Test different ad copy and extensions',
        'Optimize for quality score to reduce CPC',
      ],
    });

    this.channelProfiles.set('social-organic', {
      channel: 'social-organic',
      bestFor: ['b2c', 'visual products', 'lifestyle', 'community'],
      notFor: ['complex b2b', 'boring products'],
      avgCac: { b2b: 80, b2c: 20 },
      timeToResults: 'medium',
      scalability: 'moderate',
      difficulty: 'medium',
      tactics: [
        'Build consistent posting schedule',
        'Engage authentically with your audience',
        'Leverage trending formats (Reels, TikTok)',
        'Create shareable, value-driven content',
        'Build community through comments and DMs',
        'Collaborate with complementary accounts',
      ],
    });

    this.channelProfiles.set('social-paid', {
      channel: 'social-paid',
      bestFor: ['b2c', 'd2c', 'visual products', 'broad audiences'],
      notFor: ['niche b2b', 'complex sales cycles'],
      avgCac: { b2b: 120, b2c: 25 },
      timeToResults: 'immediate',
      scalability: 'unlimited',
      difficulty: 'medium',
      tactics: [
        'Start with lookalike audiences from best customers',
        'Create thumb-stopping creative',
        'Test multiple ad formats (video, carousel, static)',
        'Use pixel tracking for optimization',
        'Implement retargeting campaigns',
        'Scale winning ads gradually',
      ],
    });

    this.channelProfiles.set('content-marketing', {
      channel: 'content-marketing',
      bestFor: ['b2b', 'saas', 'thought leadership', 'education'],
      notFor: ['impulse purchases', 'commodity products'],
      avgCac: { b2b: 40, b2c: 15 },
      timeToResults: 'long',
      scalability: 'high',
      difficulty: 'medium',
      tactics: [
        'Develop content pillars around key topics',
        'Create 10x content that outperforms competition',
        'Repurpose content across formats',
        'Build email list through content upgrades',
        'Guest post on industry publications',
        'Create original research and data',
      ],
    });

    this.channelProfiles.set('email-marketing', {
      channel: 'email-marketing',
      bestFor: ['all', 'repeat purchases', 'nurturing', 'retention'],
      notFor: ['acquisition only'],
      avgCac: { b2b: 20, b2c: 5 },
      timeToResults: 'short',
      scalability: 'high',
      difficulty: 'easy',
      tactics: [
        'Build segmented email lists',
        'Create value-driven newsletters',
        'Implement behavior-triggered sequences',
        'Personalize content based on engagement',
        'A/B test subject lines and content',
        'Clean list regularly for deliverability',
      ],
    });

    this.channelProfiles.set('referral', {
      channel: 'referral',
      bestFor: ['all', 'high satisfaction', 'strong value prop'],
      notFor: ['poor product-market fit'],
      avgCac: { b2b: 30, b2c: 10 },
      timeToResults: 'medium',
      scalability: 'moderate',
      difficulty: 'medium',
      tactics: [
        'Design compelling two-sided incentives',
        'Make sharing frictionless',
        'Trigger referral asks at high-satisfaction moments',
        'Track and optimize referral funnel',
        'Create ambassador program for power referrers',
        'Celebrate and recognize top referrers',
      ],
    });

    this.channelProfiles.set('affiliate', {
      channel: 'affiliate',
      bestFor: ['e-commerce', 'saas', 'clear commissions'],
      notFor: ['low margins', 'complex sales'],
      avgCac: { b2b: 50, b2c: 20 },
      timeToResults: 'medium',
      scalability: 'high',
      difficulty: 'medium',
      tactics: [
        'Create competitive commission structure',
        'Build affiliate resources and assets',
        'Recruit niche-relevant affiliates',
        'Provide excellent affiliate support',
        'Track and optimize affiliate performance',
        'Create tiered rewards for top performers',
      ],
    });

    this.channelProfiles.set('partnerships', {
      channel: 'partnerships',
      bestFor: ['b2b', 'complementary products', 'established markets'],
      notFor: ['early stage', 'no clear synergies'],
      avgCac: { b2b: 40, b2c: 25 },
      timeToResults: 'medium',
      scalability: 'moderate',
      difficulty: 'hard',
      tactics: [
        'Identify complementary products with shared ICP',
        'Create clear partnership value proposition',
        'Start with co-marketing before integrations',
        'Build integration partnerships for distribution',
        'Create partner enablement materials',
        'Establish mutual success metrics',
      ],
    });

    this.channelProfiles.set('product-led', {
      channel: 'product-led',
      bestFor: ['saas', 'freemium', 'viral potential', 'self-serve'],
      notFor: ['high-touch sales', 'complex products'],
      avgCac: { b2b: 25, b2c: 10 },
      timeToResults: 'medium',
      scalability: 'unlimited',
      difficulty: 'hard',
      tactics: [
        'Optimize free tier for activation and virality',
        'Build viral loops into product',
        'Create compelling upgrade triggers',
        'Minimize friction in signup and onboarding',
        'Make product shareable by design',
        'Track and optimize product-qualified leads',
      ],
    });

    this.channelProfiles.set('community', {
      channel: 'community',
      bestFor: ['b2b', 'developers', 'passionate users', 'niche markets'],
      notFor: ['mass market', 'transactional products'],
      avgCac: { b2b: 35, b2c: 15 },
      timeToResults: 'long',
      scalability: 'moderate',
      difficulty: 'medium',
      tactics: [
        'Identify where your audience gathers',
        'Provide value before promoting',
        'Build relationships with community leaders',
        'Create your own community space',
        'Host events and AMAs',
        'Recognize and elevate community members',
      ],
    });

    this.channelProfiles.set('events', {
      channel: 'events',
      bestFor: ['b2b', 'enterprise', 'high-touch', 'networking'],
      notFor: ['low ACV', 'mass market', 'bootstrap'],
      avgCac: { b2b: 200, b2c: 100 },
      timeToResults: 'short',
      scalability: 'limited',
      difficulty: 'hard',
      tactics: [
        'Attend industry conferences strategically',
        'Host focused micro-events',
        'Speak at relevant conferences',
        'Create memorable booth experiences',
        'Follow up systematically post-event',
        'Host virtual events for broader reach',
      ],
    });

    this.channelProfiles.set('pr', {
      channel: 'pr',
      bestFor: ['launches', 'newsworthy moments', 'brand building'],
      notFor: ['steady-state growth', 'no story'],
      avgCac: { b2b: 60, b2c: 20 },
      timeToResults: 'short',
      scalability: 'limited',
      difficulty: 'hard',
      tactics: [
        'Craft compelling company narrative',
        'Build relationships with relevant journalists',
        'Create newsworthy moments and data',
        'Respond to trending topics quickly',
        'Leverage founder personal brand',
        'Consider PR agency for major launches',
      ],
    });

    this.channelProfiles.set('influencer', {
      channel: 'influencer',
      bestFor: ['b2c', 'd2c', 'lifestyle', 'visual products'],
      notFor: ['complex b2b', 'niche technical'],
      avgCac: { b2b: 100, b2c: 30 },
      timeToResults: 'short',
      scalability: 'moderate',
      difficulty: 'medium',
      tactics: [
        'Identify authentic micro-influencers',
        'Focus on engagement over follower count',
        'Create win-win partnerships',
        'Provide creative freedom with guidelines',
        'Track and measure influencer ROI',
        'Build long-term ambassador relationships',
      ],
    });

    this.channelProfiles.set('cold-outreach', {
      channel: 'cold-outreach',
      bestFor: ['b2b', 'high ACV', 'clear ICP', 'sales-led'],
      notFor: ['b2c', 'low ACV', 'no clear ICP'],
      avgCac: { b2b: 100, b2c: 0 },
      timeToResults: 'short',
      scalability: 'moderate',
      difficulty: 'medium',
      tactics: [
        'Build highly targeted prospect lists',
        'Personalize outreach at scale',
        'Use multi-channel sequences (email, LinkedIn, phone)',
        'Focus on providing value, not pitching',
        'Test and iterate on messaging',
        'Maintain clean data and deliverability',
      ],
    });

    this.channelProfiles.set('direct', {
      channel: 'direct',
      bestFor: ['brand strength', 'repeat customers', 'word of mouth'],
      notFor: ['unknown brands', 'new markets'],
      avgCac: { b2b: 10, b2c: 5 },
      timeToResults: 'immediate',
      scalability: 'limited',
      difficulty: 'easy',
      tactics: [
        'Build memorable brand identity',
        'Ensure easy-to-remember domain',
        'Optimize for branded search',
        'Create shareable brand moments',
        'Leverage existing customer word-of-mouth',
        'Build direct relationships through CRM',
      ],
    });
  }
}
