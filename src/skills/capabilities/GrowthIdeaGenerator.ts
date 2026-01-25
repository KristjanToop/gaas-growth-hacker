/**
 * GrowthIdeaGenerator - Creative Growth Ideas & Experiments
 *
 * Generates unconventional, creative growth ideas and experiments
 * tailored to the business context.
 */

import {
  BusinessContext,
  CapabilityResult,
} from '../../core/types';

interface GrowthIdea {
  id: string;
  name: string;
  category: GrowthCategory;
  description: string;
  hypothesis: string;
  implementation: string[];
  metrics: string[];
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high' | 'moonshot';
  risk: 'low' | 'medium' | 'high';
  timeframe: string;
  examples?: string[];
  prerequisites?: string[];
}

type GrowthCategory =
  | 'viral'
  | 'product'
  | 'content'
  | 'community'
  | 'partnership'
  | 'unconventional'
  | 'acquisition'
  | 'activation'
  | 'retention'
  | 'revenue';

export class GrowthIdeaGenerator {
  private ideaBank: GrowthIdea[] = [];

  constructor() {
    this.initializeIdeaBank();
  }

  async execute(input: Record<string, unknown>): Promise<CapabilityResult> {
    const businessContext = input.businessContext as Partial<BusinessContext>;
    const constraints = input.constraints as string[] | undefined;
    const previousExperiments = input.previousExperiments as string[] | undefined;
    const riskTolerance = (input.riskTolerance as string) || 'moderate';

    const ideas = this.generateIdeas(businessContext, constraints, riskTolerance);
    const prioritized = this.prioritizeIdeas(ideas, businessContext);
    const experimentPlan = this.createExperimentPlan(prioritized.slice(0, 5));

    return {
      success: true,
      data: {
        ideas: prioritized,
        topPicks: prioritized.slice(0, 5),
        experimentPlan,
        ideaMatrix: this.createIdeaMatrix(prioritized),
        quickWins: this.identifyQuickWins(prioritized),
        moonshots: this.identifyMoonshots(prioritized),
      },
      explanation: `Generated ${ideas.length} growth ideas. Top 5 recommendations ready for experimentation.`,
    };
  }

  private generateIdeas(
    context: Partial<BusinessContext>,
    constraints?: string[],
    riskTolerance?: string
  ): GrowthIdea[] {
    let ideas = [...this.ideaBank];

    // Filter based on business context
    if (context.product?.type === 'b2b') {
      ideas = ideas.filter(i => !['viral-tiktok', 'consumer-ugc'].includes(i.id));
    }

    // Filter based on constraints
    if (constraints?.includes('no-budget')) {
      ideas = ideas.filter(i => i.effort !== 'high' || i.category === 'product');
    }

    // Filter based on risk tolerance
    if (riskTolerance === 'conservative') {
      ideas = ideas.filter(i => i.risk !== 'high');
    } else if (riskTolerance === 'aggressive') {
      // Keep moonshots
    } else {
      // Moderate - slight preference away from high risk
    }

    // Add context-specific ideas
    ideas.push(...this.generateContextSpecificIdeas(context));

    return ideas;
  }

  private generateContextSpecificIdeas(context: Partial<BusinessContext>): GrowthIdea[] {
    const ideas: GrowthIdea[] = [];

    // Ideas based on company stage
    if (context.company?.stage === 'seed' || context.company?.stage === 'pre-seed') {
      ideas.push({
        id: 'founder-led-sales',
        name: 'Founder-Led Sales Sprint',
        category: 'acquisition',
        description: 'Founders personally close first 100 customers to deeply understand buying process',
        hypothesis: 'Direct founder involvement will reveal critical insights and create initial champions',
        implementation: [
          'Founder commits to 20 sales calls per week',
          'Document every objection and buying signal',
          'Create playbook from successful conversations',
          'Build relationships for case studies and referrals',
        ],
        metrics: ['Customers closed', 'Win rate', 'Objections documented', 'Referrals generated'],
        effort: 'high',
        impact: 'high',
        risk: 'low',
        timeframe: '4-8 weeks',
      });
    }

    // Ideas based on product type
    if (context.product?.type === 'b2b') {
      ideas.push({
        id: 'champion-program',
        name: 'Internal Champion Program',
        category: 'activation',
        description: 'Create dedicated program to enable internal champions to sell for you',
        hypothesis: 'Empowered champions will expand accounts and drive referrals',
        implementation: [
          'Identify most engaged users at each account',
          'Create exclusive champion community',
          'Provide ROI tools and talk tracks',
          'Celebrate and reward expansion',
          'Enable peer-to-peer referrals',
        ],
        metrics: ['Champion adoption', 'Account expansion rate', 'Champion-driven referrals'],
        effort: 'medium',
        impact: 'high',
        risk: 'low',
        timeframe: '6-8 weeks',
      });
    }

    return ideas;
  }

  private prioritizeIdeas(ideas: GrowthIdea[], context: Partial<BusinessContext>): GrowthIdea[] {
    return ideas.sort((a, b) => {
      // Calculate priority score
      const impactScore = { moonshot: 4, high: 3, medium: 2, low: 1 };
      const effortScore = { low: 3, medium: 2, high: 1 };
      const riskScore = { low: 3, medium: 2, high: 1 };

      const scoreA = impactScore[a.impact] * 2 + effortScore[a.effort] + riskScore[a.risk];
      const scoreB = impactScore[b.impact] * 2 + effortScore[b.effort] + riskScore[b.risk];

      return scoreB - scoreA;
    });
  }

  private createExperimentPlan(ideas: GrowthIdea[]): {
    idea: string;
    duration: string;
    successCriteria: string;
    minimumViableTest: string;
  }[] {
    return ideas.map(idea => ({
      idea: idea.name,
      duration: idea.timeframe,
      successCriteria: `Improvement in: ${idea.metrics[0]}`,
      minimumViableTest: idea.implementation[0],
    }));
  }

  private createIdeaMatrix(ideas: GrowthIdea[]): {
    quadrant: string;
    ideas: string[];
  }[] {
    return [
      {
        quadrant: 'Quick Wins (Low Effort, High Impact)',
        ideas: ideas
          .filter(i => i.effort === 'low' && (i.impact === 'high' || i.impact === 'medium'))
          .map(i => i.name),
      },
      {
        quadrant: 'Major Projects (High Effort, High Impact)',
        ideas: ideas
          .filter(i => i.effort === 'high' && (i.impact === 'high' || i.impact === 'moonshot'))
          .map(i => i.name),
      },
      {
        quadrant: 'Fill-ins (Low Effort, Low Impact)',
        ideas: ideas
          .filter(i => i.effort === 'low' && i.impact === 'low')
          .map(i => i.name),
      },
      {
        quadrant: 'Avoid (High Effort, Low Impact)',
        ideas: ideas
          .filter(i => i.effort === 'high' && i.impact === 'low')
          .map(i => i.name),
      },
    ];
  }

  private identifyQuickWins(ideas: GrowthIdea[]): GrowthIdea[] {
    return ideas.filter(i =>
      i.effort === 'low' && (i.impact === 'high' || i.impact === 'medium') && i.risk !== 'high'
    ).slice(0, 5);
  }

  private identifyMoonshots(ideas: GrowthIdea[]): GrowthIdea[] {
    return ideas.filter(i => i.impact === 'moonshot').slice(0, 3);
  }

  private initializeIdeaBank(): void {
    this.ideaBank = [
      // VIRAL IDEAS
      {
        id: 'referral-program',
        name: 'Two-Sided Referral Program',
        category: 'viral',
        description: 'Launch referral program with incentives for both referrer and referred',
        hypothesis: 'Financial incentives will motivate sharing and accelerate growth',
        implementation: [
          'Design incentive structure (credits, discounts, cash)',
          'Build referral tracking system',
          'Create shareable referral links',
          'Launch with existing customer base',
          'Optimize based on data',
        ],
        metrics: ['Referral rate', 'K-factor', 'Referral conversion rate', 'CAC from referrals'],
        effort: 'medium',
        impact: 'high',
        risk: 'low',
        timeframe: '3-4 weeks',
        examples: ['Dropbox (extra storage)', 'PayPal ($10 for both)'],
      },
      {
        id: 'embedded-virality',
        name: 'Powered By Watermark',
        category: 'viral',
        description: 'Add subtle branding to product outputs that are shared externally',
        hypothesis: 'Organic exposure through usage will drive awareness and signups',
        implementation: [
          'Identify shareable product outputs',
          'Add tasteful "Powered by" or "Made with" branding',
          'Make the watermark link to compelling landing page',
          'Track virality from watermarks',
          'Offer premium to remove watermark',
        ],
        metrics: ['Watermark impressions', 'Click-through rate', 'Conversions from watermarks'],
        effort: 'low',
        impact: 'medium',
        risk: 'low',
        timeframe: '1-2 weeks',
        examples: ['Canva', 'Loom', 'Calendly'],
      },
      {
        id: 'social-sharing-incentive',
        name: 'Share-to-Unlock Feature',
        category: 'viral',
        description: 'Gate premium feature or content behind social sharing',
        hypothesis: 'Users will share to access valuable features, driving organic reach',
        implementation: [
          'Identify high-value unlockable feature',
          'Build sharing mechanism',
          'Create compelling share content',
          'Verify shares and unlock',
          'Track viral coefficient',
        ],
        metrics: ['Share rate', 'Unlock rate', 'Traffic from shares'],
        effort: 'medium',
        impact: 'medium',
        risk: 'medium',
        timeframe: '2-3 weeks',
      },

      // PRODUCT-LED IDEAS
      {
        id: 'freemium-upgrade',
        name: 'Strategic Freemium Limits',
        category: 'product',
        description: 'Redesign free tier to maximize activation while creating natural upgrade moments',
        hypothesis: 'Right limits will increase both adoption and conversion',
        implementation: [
          'Analyze feature usage vs. conversion correlation',
          'Set limits that allow full activation',
          'Create clear upgrade triggers',
          'Test different limit structures',
          'Optimize for LTV, not just conversion',
        ],
        metrics: ['Activation rate', 'Limit hit rate', 'Conversion rate', 'Time to upgrade'],
        effort: 'medium',
        impact: 'high',
        risk: 'medium',
        timeframe: '4-6 weeks',
        examples: ['Slack (message limits)', 'Dropbox (storage limits)'],
      },
      {
        id: 'templates-marketplace',
        name: 'User-Generated Templates',
        category: 'product',
        description: 'Launch marketplace for community-created templates',
        hypothesis: 'Templates reduce friction and create community engagement',
        implementation: [
          'Build template creation and sharing system',
          'Seed with high-quality templates',
          'Enable community contributions',
          'Feature best templates prominently',
          'Consider creator incentives',
        ],
        metrics: ['Template usage', 'Templates created', 'Activation rate with templates'],
        effort: 'high',
        impact: 'high',
        risk: 'medium',
        timeframe: '6-8 weeks',
        examples: ['Notion', 'Figma', 'Airtable'],
      },
      {
        id: 'interactive-demo',
        name: 'Try Before Signup',
        category: 'product',
        description: 'Create interactive demo that lets users experience product without signup',
        hypothesis: 'Reducing signup friction will increase qualified conversions',
        implementation: [
          'Build sandbox environment',
          'Create guided demo experience',
          'Capture leads at value moment',
          'Seamlessly convert to real account',
          'Track engagement through demo',
        ],
        metrics: ['Demo starts', 'Demo completion', 'Demo-to-signup rate'],
        effort: 'high',
        impact: 'high',
        risk: 'low',
        timeframe: '4-8 weeks',
        examples: ['Figma', 'Miro', 'Vercel'],
      },

      // CONTENT IDEAS
      {
        id: 'original-research',
        name: 'Industry State Report',
        category: 'content',
        description: 'Create original research report with data from your platform',
        hypothesis: 'Original data will earn backlinks, press coverage, and thought leadership',
        implementation: [
          'Identify interesting data you can share',
          'Analyze and visualize findings',
          'Create downloadable report',
          'PR outreach to journalists',
          'Promote across channels',
        ],
        metrics: ['Backlinks earned', 'Press mentions', 'Report downloads', 'Traffic'],
        effort: 'high',
        impact: 'high',
        risk: 'low',
        timeframe: '6-8 weeks',
        examples: ['HubSpot State of Marketing', 'Stripe Economic Report'],
      },
      {
        id: 'seo-programmatic',
        name: 'Programmatic SEO Pages',
        category: 'content',
        description: 'Create thousands of targeted landing pages programmatically',
        hypothesis: 'Long-tail keyword coverage will drive significant organic traffic',
        implementation: [
          'Identify scalable page templates',
          'Source data for page variations',
          'Build generation system',
          'Ensure quality and uniqueness',
          'Monitor and optimize',
        ],
        metrics: ['Pages indexed', 'Organic traffic', 'Conversion from programmatic pages'],
        effort: 'high',
        impact: 'moonshot',
        risk: 'medium',
        timeframe: '8-12 weeks',
        examples: ['Zapier (integrations)', 'Yelp (locations)', 'G2 (comparisons)'],
        prerequisites: ['Technical SEO expertise', 'Data source for variations'],
      },
      {
        id: 'free-tool',
        name: 'Viral Free Tool',
        category: 'content',
        description: 'Build free tool that solves related problem and drives signups',
        hypothesis: 'Free tool will attract audience and convert to main product',
        implementation: [
          'Identify adjacent problem worth solving',
          'Build simple, useful tool',
          'Make tool shareable',
          'Add conversion path to main product',
          'Optimize for SEO and sharing',
        ],
        metrics: ['Tool users', 'Conversions to main product', 'Backlinks', 'Traffic'],
        effort: 'medium',
        impact: 'high',
        risk: 'low',
        timeframe: '4-6 weeks',
        examples: ['HubSpot Website Grader', 'Shopify Business Name Generator'],
      },

      // COMMUNITY IDEAS
      {
        id: 'community-slack',
        name: 'Private Customer Community',
        category: 'community',
        description: 'Create exclusive community for customers and prospects',
        hypothesis: 'Community will increase engagement, retention, and referrals',
        implementation: [
          'Choose platform (Slack, Discord, Circle)',
          'Define community value proposition',
          'Create initial content and discussions',
          'Recruit founding members',
          'Establish engagement rhythms',
        ],
        metrics: ['Community size', 'Active members', 'Retention impact', 'Referrals'],
        effort: 'medium',
        impact: 'high',
        risk: 'low',
        timeframe: '4-6 weeks',
        examples: ['dbt community', 'Figma community'],
      },
      {
        id: 'ambassador-program',
        name: 'Power User Ambassador Program',
        category: 'community',
        description: 'Formalize program for most engaged users to spread the word',
        hypothesis: 'Empowered ambassadors will drive organic growth',
        implementation: [
          'Identify criteria for ambassadors',
          'Create application process',
          'Design exclusive benefits',
          'Provide resources and swag',
          'Track ambassador impact',
        ],
        metrics: ['Ambassadors recruited', 'Ambassador referrals', 'Content created'],
        effort: 'medium',
        impact: 'medium',
        risk: 'low',
        timeframe: '4-6 weeks',
        examples: ['Notion Ambassadors', 'Figma Advocates'],
      },

      // PARTNERSHIP IDEAS
      {
        id: 'integration-partnership',
        name: 'Strategic Integration Partnerships',
        category: 'partnership',
        description: 'Partner with complementary products for mutual distribution',
        hypothesis: 'Partnerships will unlock new audiences with aligned users',
        implementation: [
          'Identify complementary products',
          'Propose integration partnership',
          'Build valuable integration',
          'Co-market to both audiences',
          'Track cross-referred users',
        ],
        metrics: ['Integration users', 'Users from partner', 'Revenue from partnership'],
        effort: 'high',
        impact: 'high',
        risk: 'low',
        timeframe: '8-12 weeks',
        examples: ['Zapier integrations', 'Slack app directory'],
      },
      {
        id: 'influencer-collab',
        name: 'Micro-Influencer Collaboration',
        category: 'partnership',
        description: 'Partner with niche influencers for authentic promotion',
        hypothesis: 'Trusted recommendations will drive qualified signups',
        implementation: [
          'Identify relevant micro-influencers',
          'Create partnership offer',
          'Provide product and talking points',
          'Track attribution',
          'Build long-term relationships',
        ],
        metrics: ['Influencer reach', 'Referral signups', 'CAC from influencers'],
        effort: 'medium',
        impact: 'medium',
        risk: 'medium',
        timeframe: '4-6 weeks',
      },

      // UNCONVENTIONAL IDEAS
      {
        id: 'reverse-trial',
        name: 'Reverse Trial Model',
        category: 'unconventional',
        description: 'Give full product access for limited time, then downgrade to free',
        hypothesis: 'Experiencing premium will create desire to upgrade',
        implementation: [
          'Grant full access for 14 days',
          'Educate on premium features during trial',
          'Downgrade gracefully with clear upgrade path',
          'Send targeted upgrade campaigns',
          'Test against traditional freemium',
        ],
        metrics: ['Premium feature usage', 'Conversion rate', 'Time to conversion'],
        effort: 'medium',
        impact: 'high',
        risk: 'medium',
        timeframe: '4-6 weeks',
        examples: ['Superhuman-style onboarding'],
      },
      {
        id: 'personal-onboarding',
        name: 'Concierge Onboarding',
        category: 'unconventional',
        description: 'Offer personal onboarding calls to all new users',
        hypothesis: 'High-touch onboarding will dramatically improve activation',
        implementation: [
          'Offer 15-min setup call to all signups',
          'Train team on onboarding process',
          'Track call completion and outcomes',
          'Gather insights for product improvement',
          'Scale with playbooks and automation',
        ],
        metrics: ['Call booking rate', 'Activation rate', 'Insights gathered'],
        effort: 'high',
        impact: 'high',
        risk: 'low',
        timeframe: '2-4 weeks',
        examples: ['Superhuman', 'Ramp'],
        prerequisites: ['Team capacity for calls'],
      },
      {
        id: 'product-hunt-launch',
        name: 'Strategic Product Hunt Launch',
        category: 'unconventional',
        description: 'Execute well-prepared Product Hunt launch for massive visibility',
        hypothesis: 'Top PH placement will drive signups and establish credibility',
        implementation: [
          'Prepare launch assets (images, copy, video)',
          'Build hunter network',
          'Coordinate launch day team',
          'Engage with every comment',
          'Capture and nurture traffic',
        ],
        metrics: ['PH ranking', 'Launch day signups', 'Long-term traffic impact'],
        effort: 'medium',
        impact: 'high',
        risk: 'medium',
        timeframe: '2-4 weeks',
        prerequisites: ['Ready product', 'Existing supporter base'],
      },
      {
        id: 'waitlist-fomo',
        name: 'Exclusive Waitlist Strategy',
        category: 'unconventional',
        description: 'Create artificial scarcity with invite-only waitlist',
        hypothesis: 'Exclusivity will increase desire and drive signups',
        implementation: [
          'Create compelling waitlist page',
          'Offer skip-the-line incentives for sharing',
          'Send engaging waitlist updates',
          'Grant access in waves',
          'Make accepted users feel special',
        ],
        metrics: ['Waitlist signups', 'Viral shares', 'Activation rate of accepted users'],
        effort: 'low',
        impact: 'medium',
        risk: 'low',
        timeframe: '1-2 weeks',
        examples: ['Superhuman', 'Clubhouse'],
      },
    ];
  }
}
