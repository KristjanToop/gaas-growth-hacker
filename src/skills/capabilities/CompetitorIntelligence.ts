/**
 * CompetitorIntelligence - Competitive Analysis & Strategy
 *
 * Analyzes competitors to identify opportunities, threats,
 * and develop differentiation strategies.
 */

import {
  Competitor,
  CompetitiveAnalysis,
  AcquisitionChannel,
  CapabilityResult,
} from '../../core/types';

interface CompetitorProfile {
  name: string;
  positioning: string;
  strengths: string[];
  weaknesses: string[];
  channels: AcquisitionChannel[];
  contentStrategy: string;
  pricingStrategy: string;
  keyDifferentiators: string[];
}

export class CompetitorIntelligence {
  async execute(input: Record<string, unknown>): Promise<CapabilityResult> {
    const competitors = input.competitors as string[];
    const analysisDepth = (input.analysisDepth as string) || 'standard';
    const focusAreas = input.focusAreas as string[] | undefined;

    const analysis = this.analyzeCompetitors(competitors, analysisDepth, focusAreas);
    const strategy = this.developCompetitiveStrategy(analysis);
    const opportunities = this.identifyOpportunities(analysis);

    return {
      success: true,
      data: {
        competitiveAnalysis: analysis,
        strategy,
        opportunities,
        actionItems: this.generateActionItems(analysis, strategy),
        battleCards: this.createBattleCards(analysis),
      },
      explanation: `Analyzed ${competitors.length} competitors with ${opportunities.length} opportunities identified`,
    };
  }

  private analyzeCompetitors(
    competitorNames: string[],
    depth: string,
    focusAreas?: string[]
  ): CompetitiveAnalysis {
    const competitors: Competitor[] = competitorNames.map(name =>
      this.analyzeCompetitor(name, depth)
    );

    const marketPosition = this.assessMarketPosition(competitors);
    const opportunities = this.findMarketOpportunities(competitors);
    const threats = this.identifyThreats(competitors);
    const differentiationStrategy = this.developDifferentiation(competitors);
    const competitiveAdvantages = this.identifyAdvantages(competitors);
    const gaps = this.findMarketGaps(competitors);

    return {
      competitors,
      marketPosition,
      opportunities,
      threats,
      differentiationStrategy,
      competitiveAdvantages,
      gaps,
    };
  }

  private analyzeCompetitor(name: string, depth: string): Competitor {
    // In a real implementation, this would fetch data from APIs
    // For now, we provide a framework for analysis

    return {
      name,
      website: `https://${name.toLowerCase().replace(/\s+/g, '')}.com`,
      positioning: 'To be analyzed',
      strengths: [
        'Established market presence',
        'Feature completeness',
        'Brand recognition',
      ],
      weaknesses: [
        'Legacy technology constraints',
        'Slower innovation pace',
        'Complex pricing',
      ],
      pricing: 'To be analyzed',
      marketShare: undefined,
      fundingStage: undefined,
      keyDifferentiators: [],
      channels: ['organic-search', 'paid-search', 'content-marketing'],
      productFeatures: [],
    };
  }

  private assessMarketPosition(competitors: Competitor[]): string {
    if (competitors.length === 0) {
      return 'Blue ocean opportunity - limited direct competition';
    }
    if (competitors.length <= 3) {
      return 'Emerging market with few established players - opportunity for differentiation';
    }
    if (competitors.length <= 7) {
      return 'Competitive market with room for specialized positioning';
    }
    return 'Crowded market requiring strong differentiation to compete';
  }

  private findMarketOpportunities(competitors: Competitor[]): string[] {
    return [
      'Underserved customer segments that competitors ignore',
      'Feature gaps in competitor products',
      'Poor customer experience areas in competitor offerings',
      'Pricing model innovations',
      'Integration opportunities competitors lack',
      'Vertical-specific solutions competitors overlook',
      'Geographic markets competitors under-serve',
      'Emerging use cases not well addressed',
    ];
  }

  private identifyThreats(competitors: Competitor[]): string[] {
    return [
      'Well-funded competitors may outspend on acquisition',
      'Established players bundling competing features',
      'Platform risk if building on competitor ecosystems',
      'Talent competition in hiring',
      'Commoditization of core features',
      'Network effects favoring incumbents',
      'Enterprise sales cycles favoring known brands',
    ];
  }

  private developDifferentiation(competitors: Competitor[]): string {
    return `
Focus on differentiation through:

1. **Unique Value Proposition**: Identify the ONE thing you do better than anyone else
   - What problem do you solve 10x better?
   - What unique approach or technology do you have?
   - What customer segment knows you best serve them?

2. **Experience Differentiation**: Win on user experience
   - Simpler onboarding and faster time-to-value
   - Better designed, more intuitive interface
   - Superior customer support and success

3. **Business Model Innovation**: Compete on how you sell
   - Different pricing model (usage-based, outcome-based)
   - Better alignment of price with value delivered
   - Lower switching costs or risks

4. **Category Creation**: Define a new space you can own
   - Create new language around the problem
   - Build thought leadership in emerging area
   - Position competitors as old way of doing things

5. **Community & Ecosystem**: Build moats through network
   - Developer community and integrations
   - User community and advocacy
   - Partner ecosystem

Recommended approach: Start with one dimension of differentiation and own it completely before expanding.
    `.trim();
  }

  private identifyAdvantages(competitors: Competitor[]): string[] {
    return [
      'Agility and speed of iteration as a smaller player',
      'Modern technology stack without legacy constraints',
      'Customer-centric focus vs. competitor complacency',
      'Specialized expertise in specific use cases',
      'Ability to take risks larger players cannot',
      'Direct access to customers without bureaucracy',
      'Mission-driven team motivation',
    ];
  }

  private findMarketGaps(competitors: Competitor[]): string[] {
    return [
      'SMB market often underserved by enterprise-focused competitors',
      'Specific industry verticals with unique needs',
      'International markets with localization requirements',
      'Integration with emerging platforms',
      'Mobile-first use cases',
      'Collaborative/team features',
      'AI/automation capabilities',
      'Compliance requirements for specific industries',
    ];
  }

  private developCompetitiveStrategy(analysis: CompetitiveAnalysis): {
    positioning: string;
    keyMessages: string[];
    targetSegments: string[];
    differentiators: string[];
    avoidBattles: string[];
  } {
    return {
      positioning: 'Position as the modern, customer-centric alternative focused on specific outcomes',
      keyMessages: [
        'Built for how teams work today, not yesterday',
        'Faster time-to-value with modern UX',
        'Pricing that aligns with the value you get',
        'Customer success, not just customer support',
        'Integrates with your existing workflow',
      ],
      targetSegments: [
        'Companies frustrated with legacy solutions',
        'Fast-growing teams needing scalable tools',
        'Tech-forward organizations valuing innovation',
        'Specific verticals underserved by generalists',
      ],
      differentiators: [
        'Superior user experience',
        'Faster implementation',
        'Better value alignment',
        'Modern integrations',
        'Responsive product development',
      ],
      avoidBattles: [
        'Feature-for-feature comparisons with mature products',
        'Enterprise deals requiring extensive compliance',
        'Price wars with well-funded competitors',
        'Markets where network effects favor incumbents',
      ],
    };
  }

  private identifyOpportunities(analysis: CompetitiveAnalysis): {
    opportunity: string;
    rationale: string;
    actionable: string;
  }[] {
    return [
      {
        opportunity: 'Vertical specialization',
        rationale: 'Generalist competitors cannot optimize for specific industry needs',
        actionable: 'Identify 2-3 verticals where you have traction and double down',
      },
      {
        opportunity: 'Experience gap',
        rationale: 'Legacy products often have poor UX from years of feature accumulation',
        actionable: 'Conduct user testing on competitor products to find pain points',
      },
      {
        opportunity: 'Pricing innovation',
        rationale: 'Traditional pricing often poorly aligned with customer value',
        actionable: 'Develop usage-based or outcome-based pricing model',
      },
      {
        opportunity: 'Integration ecosystem',
        rationale: 'Better integrations reduce friction and increase stickiness',
        actionable: 'Build integrations with tools your ICP uses daily',
      },
      {
        opportunity: 'Community and content',
        rationale: 'Build trust and awareness through education',
        actionable: 'Create comprehensive content hub and user community',
      },
    ];
  }

  private generateActionItems(
    analysis: CompetitiveAnalysis,
    strategy: any
  ): {
    priority: 'high' | 'medium' | 'low';
    action: string;
    timeframe: string;
  }[] {
    return [
      {
        priority: 'high',
        action: 'Create competitive positioning document',
        timeframe: 'This week',
      },
      {
        priority: 'high',
        action: 'Develop battle cards for sales team',
        timeframe: '2 weeks',
      },
      {
        priority: 'high',
        action: 'Identify and document key differentiators',
        timeframe: '1 week',
      },
      {
        priority: 'medium',
        action: 'Set up competitor monitoring (pricing, features, content)',
        timeframe: '2 weeks',
      },
      {
        priority: 'medium',
        action: 'Interview customers who switched from competitors',
        timeframe: '3 weeks',
      },
      {
        priority: 'medium',
        action: 'Create comparison page on website',
        timeframe: '4 weeks',
      },
      {
        priority: 'low',
        action: 'Analyze competitor content and SEO strategy',
        timeframe: '4 weeks',
      },
      {
        priority: 'low',
        action: 'Research competitor funding and team growth',
        timeframe: '4 weeks',
      },
    ];
  }

  private createBattleCards(analysis: CompetitiveAnalysis): {
    competitor: string;
    whenTheyWin: string[];
    whenWeWin: string[];
    objectionHandlers: { objection: string; response: string }[];
    landmines: string[];
  }[] {
    return analysis.competitors.map(competitor => ({
      competitor: competitor.name,
      whenTheyWin: [
        'Enterprise deals requiring extensive compliance',
        'Customers needing features we do not have yet',
        'RFP processes favoring established vendors',
        'Price-only decisions with no value consideration',
      ],
      whenWeWin: [
        'Customers valuing speed and ease of use',
        'Teams frustrated with legacy complexity',
        'Use cases requiring modern integrations',
        'Companies wanting responsive vendor relationship',
      ],
      objectionHandlers: [
        {
          objection: 'You are newer/smaller than [competitor]',
          response: 'That means we are more agile, responsive, and focused on your success. Our customers get direct access to our team and influence our roadmap.',
        },
        {
          objection: '[Competitor] has more features',
          response: 'More features often means more complexity. We focus on the features that matter most, done exceptionally well. What specific capability are you looking for?',
        },
        {
          objection: 'We already use [competitor]',
          response: 'Many of our customers switched from [competitor]. What prompted you to explore alternatives? We would be happy to show you specifically how we address those pain points.',
        },
      ],
      landmines: [
        'Ask about their experience with [competitor] support response times',
        'Ask how long their last implementation took',
        'Ask about hidden costs (implementation, training, integrations)',
        'Ask when they last saw a meaningful product update',
      ],
    }));
  }
}
