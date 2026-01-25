/**
 * RetentionEngine - Retention Strategy Development
 *
 * Creates comprehensive retention and engagement strategies
 * to reduce churn and increase customer lifetime value.
 */

import {
  BusinessContext,
  CapabilityResult,
} from '../../core/types';

interface RetentionStrategy {
  name: string;
  description: string;
  tactics: RetentionTactic[];
  expectedImpact: string;
  timeframe: string;
  effort: 'low' | 'medium' | 'high';
}

interface RetentionTactic {
  name: string;
  description: string;
  implementation: string[];
  tools?: string[];
  metrics: string[];
}

interface ChurnRiskSegment {
  name: string;
  characteristics: string[];
  riskLevel: 'high' | 'medium' | 'low';
  interventions: string[];
}

export class RetentionEngine {
  async execute(input: Record<string, unknown>): Promise<CapabilityResult> {
    const currentRetention = input.currentRetention as Record<string, number> | undefined;
    const productType = input.productType as string;
    const userSegments = input.userSegments as string[] | undefined;
    const churnReasons = input.churnReasons as string[] | undefined;

    const strategies = this.developRetentionStrategies(productType, currentRetention, churnReasons);
    const riskSegments = this.identifyRiskSegments(userSegments, churnReasons);
    const playbook = this.createRetentionPlaybook(strategies, riskSegments, productType);

    return {
      success: true,
      data: {
        strategies,
        riskSegments,
        playbook,
        benchmarks: this.getRetentionBenchmarks(productType),
        quickWins: this.identifyQuickWins(strategies),
      },
      explanation: `Developed ${strategies.length} retention strategies targeting key churn risks`,
    };
  }

  private developRetentionStrategies(
    productType: string,
    currentRetention?: Record<string, number>,
    churnReasons?: string[]
  ): RetentionStrategy[] {
    const strategies: RetentionStrategy[] = [];

    // Onboarding Optimization Strategy
    strategies.push({
      name: 'Onboarding Excellence',
      description: 'Optimize the first 7 days to maximize activation and early retention',
      tactics: [
        {
          name: 'Welcome Sequence',
          description: 'Create personalized welcome experience',
          implementation: [
            'Segment users by use case during signup',
            'Create tailored welcome emails per segment',
            'Provide quick-start guides for each use case',
            'Set up milestone celebrations',
            'Schedule check-in at day 3 and day 7',
          ],
          tools: ['Customer.io', 'Intercom', 'Userlist'],
          metrics: ['Day 1 retention', 'Activation rate', 'Time to value'],
        },
        {
          name: 'Activation Acceleration',
          description: 'Get users to core value faster',
          implementation: [
            'Identify your activation moment',
            'Remove friction before activation',
            'Provide templates and examples',
            'Offer setup assistance',
            'Track and optimize activation funnel',
          ],
          metrics: ['Activation rate', 'Time to activation', 'Completion rate'],
        },
      ],
      expectedImpact: '15-25% improvement in Day 7 retention',
      timeframe: '2-4 weeks',
      effort: 'medium',
    });

    // Engagement Loop Strategy
    strategies.push({
      name: 'Engagement Loops',
      description: 'Create habit-forming product experiences that bring users back',
      tactics: [
        {
          name: 'Variable Rewards',
          description: 'Implement rewarding experiences that vary',
          implementation: [
            'Identify potential reward moments',
            'Add unexpected delights and discoveries',
            'Create progress tracking and achievements',
            'Implement gamification where appropriate',
            'Test different reward mechanisms',
          ],
          metrics: ['Sessions per user', 'Feature engagement', 'Return rate'],
        },
        {
          name: 'Trigger Optimization',
          description: 'Create effective reasons to return',
          implementation: [
            'Map natural usage triggers',
            'Create external triggers (notifications, emails)',
            'Time triggers around user habits',
            'Personalize trigger content',
            'Optimize trigger frequency',
          ],
          tools: ['OneSignal', 'Braze', 'Customer.io'],
          metrics: ['Notification CTR', 'Re-engagement rate', 'DAU/MAU'],
        },
      ],
      expectedImpact: '20-30% improvement in weekly retention',
      timeframe: '4-8 weeks',
      effort: 'high',
    });

    // Proactive Retention Strategy
    strategies.push({
      name: 'Proactive Churn Prevention',
      description: 'Identify and save at-risk users before they churn',
      tactics: [
        {
          name: 'Health Scoring',
          description: 'Build predictive churn model',
          implementation: [
            'Define engagement signals (login frequency, feature usage, etc.)',
            'Create health score formula',
            'Set up automated health tracking',
            'Define threshold for at-risk users',
            'Create intervention playbooks per risk level',
          ],
          tools: ['Amplitude', 'Mixpanel', 'ChurnZero'],
          metrics: ['Health score distribution', 'Churn prediction accuracy', 'Save rate'],
        },
        {
          name: 'Intervention Campaigns',
          description: 'Systematic outreach to at-risk users',
          implementation: [
            'Create email sequences for declining engagement',
            'Set up in-app messages for dormant users',
            'Train support for proactive outreach',
            'Offer assistance and resources',
            'Track intervention effectiveness',
          ],
          metrics: ['Intervention rate', 'Recovery rate', 'Time to intervention'],
        },
      ],
      expectedImpact: '10-20% reduction in churn',
      timeframe: '4-6 weeks',
      effort: 'medium',
    });

    // Customer Success Strategy
    strategies.push({
      name: 'Customer Success Program',
      description: 'Proactively ensure customers achieve their goals',
      tactics: [
        {
          name: 'Success Milestones',
          description: 'Define and track customer success metrics',
          implementation: [
            'Define success for each customer segment',
            'Create milestone tracking system',
            'Schedule success reviews',
            'Celebrate achievements publicly',
            'Address missed milestones proactively',
          ],
          metrics: ['Milestone completion rate', 'Customer health score', 'NPS'],
        },
        {
          name: 'Quarterly Business Reviews',
          description: 'Regular touchpoints with key accounts',
          implementation: [
            'Identify accounts for QBR cadence',
            'Create QBR template and agenda',
            'Prepare value delivered metrics',
            'Discuss goals and roadmap',
            'Document action items and follow up',
          ],
          tools: ['Notion', 'Gong', 'Catalyst'],
          metrics: ['QBR completion rate', 'Expansion rate', 'Retention rate'],
        },
      ],
      expectedImpact: '15-30% improvement in net revenue retention',
      timeframe: 'Ongoing',
      effort: 'high',
    });

    // Re-engagement Strategy
    strategies.push({
      name: 'Win-Back Campaigns',
      description: 'Re-engage churned or dormant users',
      tactics: [
        {
          name: 'Dormant User Reactivation',
          description: 'Bring back users who stopped engaging',
          implementation: [
            'Define dormancy threshold',
            'Segment dormant users by previous engagement',
            'Create reactivation email sequence',
            'Highlight new features and improvements',
            'Offer incentive for return',
          ],
          tools: ['Customer.io', 'Mailchimp', 'Braze'],
          metrics: ['Reactivation rate', 'Reactivated user retention', 'Revenue recovered'],
        },
        {
          name: 'Churned Customer Recovery',
          description: 'Win back customers who cancelled',
          implementation: [
            'Segment churned customers by reason and value',
            'Wait appropriate cooling-off period',
            'Create personalized win-back offers',
            'Address original churn reason',
            'Make return process frictionless',
          ],
          metrics: ['Win-back rate', 'Second-time retention', 'Revenue recovered'],
        },
      ],
      expectedImpact: '5-15% of churned users recovered',
      timeframe: '2-4 weeks',
      effort: 'low',
    });

    // Community & Stickiness Strategy
    strategies.push({
      name: 'Community & Network Effects',
      description: 'Increase switching costs through community and connections',
      tactics: [
        {
          name: 'User Community',
          description: 'Build community around your product',
          implementation: [
            'Choose community platform',
            'Create initial content and discussions',
            'Recruit community champions',
            'Host regular events (AMAs, workshops)',
            'Connect community to product experience',
          ],
          tools: ['Slack', 'Discord', 'Circle', 'Discourse'],
          metrics: ['Community members', 'Active participants', 'Community-driven retention lift'],
        },
        {
          name: 'Data & Integration Lock-in',
          description: 'Increase value of staying through data and integrations',
          implementation: [
            'Encourage data input and customization',
            'Build valuable integrations',
            'Create historical analytics and insights',
            'Make data export possible but product sticky',
            'Highlight accumulated value',
          ],
          metrics: ['Integration adoption', 'Data depth', 'Switching cost perception'],
        },
      ],
      expectedImpact: '20-40% reduction in churn for community members',
      timeframe: '8-12 weeks',
      effort: 'high',
    });

    return strategies;
  }

  private identifyRiskSegments(
    userSegments?: string[],
    churnReasons?: string[]
  ): ChurnRiskSegment[] {
    const segments: ChurnRiskSegment[] = [
      {
        name: 'Never Activated',
        characteristics: [
          'Signed up but never completed onboarding',
          'Zero or minimal feature usage',
          'No login after first session',
        ],
        riskLevel: 'high',
        interventions: [
          'Immediate onboarding assistance email',
          'Offer live setup call',
          'Simplify first steps',
          'Send use case specific guides',
        ],
      },
      {
        name: 'Early Churners',
        characteristics: [
          'Active in first week, then stopped',
          'Completed onboarding but did not return',
          'Explored features but did not adopt',
        ],
        riskLevel: 'high',
        interventions: [
          'Day 7 check-in email',
          'Highlight features they missed',
          'Offer extended trial or assistance',
          'Survey for feedback on experience',
        ],
      },
      {
        name: 'Declining Engagement',
        characteristics: [
          'Was active, now logging in less',
          'Using fewer features than before',
          'Team activity decreasing',
        ],
        riskLevel: 'medium',
        interventions: [
          'Personalized re-engagement email',
          'Share new features and updates',
          'Customer success outreach',
          'Usage trend alert to account owner',
        ],
      },
      {
        name: 'Single User Dependency',
        characteristics: [
          'Only one user in team account',
          'High usage concentrated in one person',
          'No collaboration features used',
        ],
        riskLevel: 'medium',
        interventions: [
          'Encourage team invites',
          'Highlight collaboration features',
          'Offer team onboarding session',
          'Create team-based incentives',
        ],
      },
      {
        name: 'Price Sensitive',
        characteristics: [
          'On lowest tier',
          'Previous pricing inquiries',
          'High usage relative to plan',
        ],
        riskLevel: 'medium',
        interventions: [
          'Proactive value demonstration',
          'ROI calculator and case studies',
          'Flexible payment options',
          'Annual discount offer',
        ],
      },
      {
        name: 'Expansion Ready',
        characteristics: [
          'Hitting plan limits',
          'High engagement and satisfaction',
          'Growing team',
        ],
        riskLevel: 'low',
        interventions: [
          'Proactive upgrade conversation',
          'Expansion ROI demonstration',
          'Premium feature trial',
          'Volume discount for growth',
        ],
      },
    ];

    return segments;
  }

  private createRetentionPlaybook(
    strategies: RetentionStrategy[],
    segments: ChurnRiskSegment[],
    productType: string
  ): {
    phase1: { focus: string; actions: string[] };
    phase2: { focus: string; actions: string[] };
    phase3: { focus: string; actions: string[] };
  } {
    return {
      phase1: {
        focus: 'Foundation & Quick Wins (Week 1-4)',
        actions: [
          'Set up retention cohort tracking',
          'Implement churn survey at cancellation',
          'Create basic health score model',
          'Launch reactivation email sequence',
          'Fix top 3 onboarding friction points',
        ],
      },
      phase2: {
        focus: 'Systematic Retention (Week 5-12)',
        actions: [
          'Build automated intervention system',
          'Launch customer success program',
          'Implement engagement notifications',
          'Create segment-specific retention campaigns',
          'Build community foundation',
        ],
      },
      phase3: {
        focus: 'Optimization & Scale (Week 13+)',
        actions: [
          'Optimize based on retention data',
          'Scale successful interventions',
          'Build advanced health scoring',
          'Expand community programs',
          'Develop network effects',
        ],
      },
    };
  }

  private getRetentionBenchmarks(productType: string): {
    metric: string;
    good: string;
    average: string;
    poor: string;
  }[] {
    if (productType === 'b2b' || productType === 'saas') {
      return [
        { metric: 'Day 1 Retention', good: '>80%', average: '60-80%', poor: '<60%' },
        { metric: 'Day 7 Retention', good: '>50%', average: '30-50%', poor: '<30%' },
        { metric: 'Day 30 Retention', good: '>30%', average: '15-30%', poor: '<15%' },
        { metric: 'Monthly Churn', good: '<3%', average: '3-7%', poor: '>7%' },
        { metric: 'Net Revenue Retention', good: '>110%', average: '90-110%', poor: '<90%' },
        { metric: 'NPS Score', good: '>50', average: '20-50', poor: '<20' },
      ];
    } else {
      return [
        { metric: 'Day 1 Retention', good: '>60%', average: '40-60%', poor: '<40%' },
        { metric: 'Day 7 Retention', good: '>30%', average: '15-30%', poor: '<15%' },
        { metric: 'Day 30 Retention', good: '>15%', average: '8-15%', poor: '<8%' },
        { metric: 'Monthly Churn', good: '<5%', average: '5-10%', poor: '>10%' },
        { metric: 'DAU/MAU Ratio', good: '>25%', average: '10-25%', poor: '<10%' },
        { metric: 'NPS Score', good: '>40', average: '10-40', poor: '<10' },
      ];
    }
  }

  private identifyQuickWins(strategies: RetentionStrategy[]): {
    action: string;
    impact: string;
    effort: string;
  }[] {
    return [
      { action: 'Add cancellation survey to capture churn reasons', impact: 'Insights for improvement', effort: '1 day' },
      { action: 'Set up basic cohort retention tracking', impact: 'Visibility into retention', effort: '2-3 days' },
      { action: 'Create reactivation email for 7-day dormant users', impact: '5-10% reactivation', effort: '1 day' },
      { action: 'Add in-app NPS survey for active users', impact: 'Satisfaction insights', effort: '1 day' },
      { action: 'Implement usage-based health score', impact: 'Early warning system', effort: '3-5 days' },
    ];
  }
}
