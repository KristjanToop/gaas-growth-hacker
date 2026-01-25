/**
 * PlaybookGenerator - AI-Powered Growth Playbook Generation
 *
 * Generates comprehensive, actionable growth playbooks based on:
 * - Business stage and model
 * - Target growth stage (AAR framework)
 * - Industry best practices
 * - Proven growth tactics
 */

import {
  GrowthPlaybook,
  BusinessContext,
  PlaybookStep,
  Tactic,
  ExpectedOutcome,
  Risk,
  Resource,
  CapabilityResult,
  BusinessModel,
} from '../../core/types';

export class PlaybookGenerator {
  private playbookTemplates: Map<string, Partial<GrowthPlaybook>> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  async execute(input: Record<string, unknown>): Promise<CapabilityResult> {
    const targetStage = input.targetStage as string;
    const businessModel = input.businessModel as BusinessModel;
    const currentChallenge = input.currentChallenge as string | undefined;
    const budget = input.budget as string | undefined;

    const playbook = this.generatePlaybook(targetStage, businessModel, currentChallenge, budget);

    return {
      success: true,
      data: playbook,
      explanation: `Generated ${playbook.name} playbook with ${playbook.steps.length} steps targeting ${playbook.targetStage}`,
    };
  }

  generateForContext(context: BusinessContext): GrowthPlaybook[] {
    const playbooks: GrowthPlaybook[] = [];
    const { company, product, currentMetrics } = context;

    // Determine which playbooks are most relevant
    const priorities = this.analyzeGrowthPriorities(context);

    for (const priority of priorities) {
      const playbook = this.generatePlaybook(
        priority.stage,
        company.businessModel,
        priority.challenge,
        this.getBudgetLevel(company.monthlyBudget)
      );
      playbooks.push(playbook);
    }

    return playbooks;
  }

  private analyzeGrowthPriorities(context: BusinessContext): { stage: string; challenge: string }[] {
    const priorities: { stage: string; challenge: string; score: number }[] = [];
    const metrics = context.currentMetrics;

    // Check activation
    if (!metrics.activationRate || metrics.activationRate < 0.4) {
      priorities.push({ stage: 'activation', challenge: 'Low activation rate', score: 10 });
    }

    // Check retention
    if (!metrics.day7Retention || metrics.day7Retention < 0.2) {
      priorities.push({ stage: 'retention', challenge: 'Poor early retention', score: 9 });
    }

    // Check acquisition
    if (!metrics.newUsersThisMonth || metrics.newUsersThisMonth < 100) {
      priorities.push({ stage: 'acquisition', challenge: 'Need more users', score: 8 });
    }

    // Check revenue
    if (!metrics.monthlyRecurringRevenue || metrics.averageRevenuePerUser && metrics.averageRevenuePerUser < 50) {
      priorities.push({ stage: 'revenue', challenge: 'Low revenue per user', score: 7 });
    }

    // Check referral
    if (!metrics.viralCoefficient || metrics.viralCoefficient < 0.5) {
      priorities.push({ stage: 'referral', challenge: 'Low virality', score: 6 });
    }

    return priorities
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(p => ({ stage: p.stage, challenge: p.challenge }));
  }

  private getBudgetLevel(monthlyBudget?: number): string {
    if (!monthlyBudget || monthlyBudget < 1000) return 'bootstrap';
    if (monthlyBudget < 10000) return 'seed';
    return 'funded';
  }

  private generatePlaybook(
    targetStage: string,
    businessModel: BusinessModel,
    challenge?: string,
    budget?: string
  ): GrowthPlaybook {
    const template = this.getTemplate(targetStage, businessModel);

    const playbook: GrowthPlaybook = {
      id: `playbook-${targetStage}-${businessModel}-${Date.now()}`,
      name: `${this.capitalize(targetStage)} Growth Playbook for ${this.capitalize(businessModel)}`,
      targetStage: targetStage as 'acquisition' | 'activation' | 'retention' | 'revenue' | 'referral',
      difficulty: budget === 'bootstrap' ? 'beginner' : budget === 'funded' ? 'advanced' : 'intermediate',
      timeframe: this.getTimeframe(targetStage, budget),
      expectedOutcomes: this.generateOutcomes(targetStage, businessModel),
      prerequisites: this.getPrerequisites(targetStage),
      steps: this.generateSteps(targetStage, businessModel, budget),
      metrics: this.getMetrics(targetStage),
      risks: this.getRisks(targetStage),
      resources: this.getResources(targetStage, businessModel),
      caseStudies: this.getCaseStudies(targetStage, businessModel),
    };

    return playbook;
  }

  private generateSteps(targetStage: string, businessModel: BusinessModel, budget?: string): PlaybookStep[] {
    const steps: PlaybookStep[] = [];

    switch (targetStage) {
      case 'acquisition':
        steps.push(...this.getAcquisitionSteps(businessModel, budget));
        break;
      case 'activation':
        steps.push(...this.getActivationSteps(businessModel, budget));
        break;
      case 'retention':
        steps.push(...this.getRetentionSteps(businessModel, budget));
        break;
      case 'revenue':
        steps.push(...this.getRevenueSteps(businessModel, budget));
        break;
      case 'referral':
        steps.push(...this.getReferralSteps(businessModel, budget));
        break;
    }

    return steps;
  }

  private getAcquisitionSteps(businessModel: BusinessModel, budget?: string): PlaybookStep[] {
    const steps: PlaybookStep[] = [
      {
        order: 1,
        title: 'Define Your Ideal Customer Profile',
        description: 'Create detailed ICPs to focus acquisition efforts on highest-value prospects',
        tactics: [
          {
            name: 'ICP Workshop',
            description: 'Analyze best customers to identify common characteristics',
            implementation: [
              'List your top 10 most successful customers',
              'Identify common firmographics (company size, industry, location)',
              'Document common pain points and use cases',
              'Note how they found you and their buying process',
              'Create 2-3 distinct ICP documents',
            ],
            tools: ['Notion', 'Airtable', 'Google Docs'],
          },
          {
            name: 'Customer Interview Sprint',
            description: 'Talk to customers to understand their journey and needs',
            implementation: [
              'Schedule 10-15 customer interviews',
              'Prepare interview script focusing on problems, not features',
              'Record and transcribe all interviews',
              'Synthesize patterns into ICP refinements',
            ],
          },
        ],
        duration: '1-2 weeks',
        deliverables: ['2-3 detailed ICP documents', 'Customer interview insights report'],
        successCriteria: ['ICPs include firmographics, psychographics, and behavioral data'],
      },
      {
        order: 2,
        title: 'Channel Identification & Prioritization',
        description: 'Identify and prioritize the most effective acquisition channels for your ICP',
        tactics: [
          {
            name: 'Channel Brainstorm',
            description: 'Map all potential channels where your ICP can be reached',
            implementation: [
              'List all channels competitors are using',
              'Identify where your ICP spends time online',
              'Rate each channel on reach, cost, and fit',
              'Select top 3 channels to test',
            ],
          },
          {
            name: 'Competitor Channel Analysis',
            description: 'Analyze competitor acquisition strategies',
            implementation: [
              'Use SimilarWeb to analyze competitor traffic sources',
              'Review competitor content and social presence',
              'Identify gaps and opportunities',
              'Document successful competitor tactics to adapt',
            ],
            tools: ['SimilarWeb', 'Ahrefs', 'SpyFu'],
          },
        ],
        duration: '1 week',
        deliverables: ['Channel prioritization matrix', 'Competitor channel analysis'],
        successCriteria: ['Top 3 channels identified with clear rationale'],
      },
      {
        order: 3,
        title: 'Build Your Content Engine',
        description: 'Create a sustainable content system that attracts and converts your ICP',
        tactics: [
          {
            name: 'Content Pillar Strategy',
            description: 'Define 3-5 content pillars aligned with your product and ICP needs',
            implementation: [
              'Identify top problems your ICP searches for',
              'Map problems to content topics',
              'Create pillar page outlines',
              'Plan supporting content cluster',
            ],
          },
          {
            name: 'SEO Foundation',
            description: 'Build organic search presence for sustainable acquisition',
            implementation: [
              'Conduct keyword research for each pillar',
              'Optimize existing pages for target keywords',
              'Create new content targeting high-intent keywords',
              'Build internal linking structure',
              'Start link building outreach',
            ],
            tools: ['Ahrefs', 'Clearscope', 'Surfer SEO'],
          },
        ],
        duration: '2-4 weeks',
        deliverables: ['Content calendar', '5-10 SEO-optimized articles', 'Link building strategy'],
        successCriteria: ['Organic traffic increasing MoM', 'Ranking for 10+ target keywords'],
      },
      {
        order: 4,
        title: 'Launch Outbound Engine',
        description: 'Build systematic outbound acquisition for predictable growth',
        tactics: [
          {
            name: 'Cold Outreach System',
            description: 'Create personalized outreach at scale',
            implementation: [
              'Build prospect list matching ICP',
              'Create personalized email sequences',
              'Set up tracking and automation',
              'Define follow-up cadence',
              'Measure and iterate on messaging',
            ],
            tools: ['Apollo.io', 'Lemlist', 'Outreach.io'],
          },
          {
            name: 'LinkedIn Growth',
            description: 'Leverage LinkedIn for B2B acquisition',
            implementation: [
              'Optimize founder/team profiles',
              'Create content posting schedule',
              'Engage strategically with ICP posts',
              'Use Sales Navigator for prospecting',
              'Test LinkedIn InMail campaigns',
            ],
            tools: ['LinkedIn Sales Navigator', 'Taplio', 'Shield'],
          },
        ],
        duration: '2-3 weeks',
        deliverables: ['Prospect database', 'Email sequences', 'LinkedIn content calendar'],
        successCriteria: ['20%+ email open rates', '5%+ response rates'],
      },
      {
        order: 5,
        title: 'Community & Partnership Growth',
        description: 'Build acquisition through community and strategic partnerships',
        tactics: [
          {
            name: 'Community Infiltration',
            description: 'Become a valuable member of communities where your ICP gathers',
            implementation: [
              'Identify top 10 communities for your ICP',
              'Create value-first engagement strategy',
              'Share insights and help others genuinely',
              'Build relationships with community leaders',
              'Subtly introduce your product when relevant',
            ],
          },
          {
            name: 'Partnership Flywheel',
            description: 'Create mutually beneficial partnerships for distribution',
            implementation: [
              'Identify complementary products with shared ICP',
              'Create partnership value proposition',
              'Reach out with specific co-marketing ideas',
              'Execute first partnership campaign',
              'Measure and expand successful partnerships',
            ],
          },
        ],
        duration: 'Ongoing',
        deliverables: ['Community engagement tracker', 'Partnership pipeline'],
        successCriteria: ['Active in 5+ relevant communities', '2+ partnership deals'],
      },
    ];

    return steps;
  }

  private getActivationSteps(businessModel: BusinessModel, budget?: string): PlaybookStep[] {
    return [
      {
        order: 1,
        title: 'Define Your Activation Moment',
        description: 'Identify the exact moment when users first experience your core value',
        tactics: [
          {
            name: 'Aha Moment Analysis',
            description: 'Analyze user behavior to find correlation with retention',
            implementation: [
              'List all possible activation events in your product',
              'Analyze which events correlate with long-term retention',
              'Interview retained users about their first experience',
              'Define your activation metric precisely',
            ],
          },
          {
            name: 'Time-to-Value Mapping',
            description: 'Map the journey from signup to activation',
            implementation: [
              'Document every step from signup to activation',
              'Measure time spent at each step',
              'Identify where users drop off',
              'Calculate current time-to-value',
            ],
          },
        ],
        duration: '1-2 weeks',
        deliverables: ['Activation metric definition', 'Time-to-value baseline'],
        successCriteria: ['Clear, measurable activation moment defined'],
      },
      {
        order: 2,
        title: 'Streamline Onboarding Flow',
        description: 'Remove friction and guide users to activation as fast as possible',
        tactics: [
          {
            name: 'Onboarding Audit',
            description: 'Identify and eliminate friction in the onboarding process',
            implementation: [
              'Record 10 user sessions going through onboarding',
              'Note every point of confusion or hesitation',
              'List all required fields and steps',
              'Identify what can be removed or delayed',
              'Prioritize changes by impact and effort',
            ],
            tools: ['Hotjar', 'FullStory', 'Maze'],
          },
          {
            name: 'Progressive Onboarding',
            description: 'Break onboarding into digestible steps',
            implementation: [
              'Define minimum viable onboarding (just to activation)',
              'Move non-essential setup to later',
              'Create contextual prompts instead of upfront forms',
              'Add progress indicators',
              'Celebrate small wins along the way',
            ],
          },
        ],
        duration: '2-3 weeks',
        deliverables: ['Simplified onboarding flow', 'Reduced steps to activation'],
        successCriteria: ['50% reduction in time-to-value', '20% increase in activation rate'],
      },
      {
        order: 3,
        title: 'Implement Activation Triggers',
        description: 'Proactively guide users toward activation with smart triggers',
        tactics: [
          {
            name: 'Behavioral Email Sequences',
            description: 'Trigger emails based on user actions to drive activation',
            implementation: [
              'Map user journey and identify key decision points',
              'Create emails for each trigger point',
              'Set up automation rules',
              'Include clear CTAs leading to activation',
              'Personalize based on user segment',
            ],
            tools: ['Customer.io', 'Intercom', 'Braze'],
          },
          {
            name: 'In-App Guidance',
            description: 'Guide users with contextual in-app prompts',
            implementation: [
              'Add tooltips for key features',
              'Create interactive product tours',
              'Show empty states with clear next actions',
              'Add checklist for activation steps',
              'Use modals sparingly for critical guidance',
            ],
            tools: ['Appcues', 'Pendo', 'Userpilot'],
          },
        ],
        duration: '2-3 weeks',
        deliverables: ['Activation email sequence', 'In-app guidance system'],
        successCriteria: ['Higher email engagement', 'More users completing activation checklist'],
      },
      {
        order: 4,
        title: 'Personalize the Activation Path',
        description: 'Create tailored activation paths for different user segments',
        tactics: [
          {
            name: 'Segmented Onboarding',
            description: 'Ask qualifying questions to customize the experience',
            implementation: [
              'Identify 2-3 key user segments',
              'Create segment-specific value propositions',
              'Add simple segmentation question in onboarding',
              'Customize copy, examples, and templates per segment',
              'Measure activation rate by segment',
            ],
          },
          {
            name: 'Use Case Templates',
            description: 'Provide pre-built templates to accelerate time-to-value',
            implementation: [
              'Identify most common use cases',
              'Create templates for each use case',
              'Present relevant templates during onboarding',
              'Make templates easily customizable',
              'Track which templates lead to best retention',
            ],
          },
        ],
        duration: '2-3 weeks',
        deliverables: ['Segmented onboarding flows', 'Use case templates'],
        successCriteria: ['Improved activation rate for each segment'],
      },
      {
        order: 5,
        title: 'High-Touch Activation Support',
        description: 'Provide human support for users who need extra help activating',
        tactics: [
          {
            name: 'Activation Concierge',
            description: 'Proactively reach out to struggling users',
            implementation: [
              'Identify users who signed up but have not activated',
              'Segment by engagement level and potential value',
              'Reach out personally via email or chat',
              'Offer 1:1 onboarding calls',
              'Document common blockers for product fixes',
            ],
          },
          {
            name: 'Self-Service Resources',
            description: 'Create resources for users who prefer self-service',
            implementation: [
              'Build comprehensive knowledge base',
              'Create video tutorials for key flows',
              'Add contextual help within the product',
              'Set up chatbot for common questions',
              'Make resources easily discoverable',
            ],
            tools: ['Intercom', 'Zendesk', 'Loom'],
          },
        ],
        duration: 'Ongoing',
        deliverables: ['Activation support playbook', 'Self-service resource library'],
        successCriteria: ['Reduced time to activation for supported users'],
      },
    ];
  }

  private getRetentionSteps(businessModel: BusinessModel, budget?: string): PlaybookStep[] {
    return [
      {
        order: 1,
        title: 'Understand Your Retention Curve',
        description: 'Map and analyze your retention patterns to identify improvement opportunities',
        tactics: [
          {
            name: 'Cohort Analysis Setup',
            description: 'Implement cohort tracking to understand retention patterns',
            implementation: [
              'Set up cohort tracking in your analytics',
              'Define meaningful cohort segments',
              'Track Day 1, Day 7, Day 30, Day 90 retention',
              'Identify which cohorts retain best',
              'Correlate retention with acquisition channel and behavior',
            ],
            tools: ['Amplitude', 'Mixpanel', 'Heap'],
          },
          {
            name: 'Churn Analysis',
            description: 'Understand why users leave',
            implementation: [
              'Implement cancellation survey',
              'Interview churned customers',
              'Analyze last actions before churn',
              'Identify patterns in churned user behavior',
              'Create churn risk scoring model',
            ],
          },
        ],
        duration: '1-2 weeks',
        deliverables: ['Retention dashboard', 'Churn analysis report'],
        successCriteria: ['Clear understanding of retention patterns and churn reasons'],
      },
      {
        order: 2,
        title: 'Build Habit-Forming Features',
        description: 'Design product features that create habitual usage',
        tactics: [
          {
            name: 'Hook Model Implementation',
            description: 'Apply the Hook Model to create habit loops',
            implementation: [
              'Identify internal triggers (user emotions/situations)',
              'Design external triggers (notifications, emails)',
              'Simplify the action to minimum steps',
              'Create variable rewards for engagement',
              'Encourage user investment in the product',
            ],
          },
          {
            name: 'Engagement Loops',
            description: 'Create loops that bring users back regularly',
            implementation: [
              'Identify natural usage frequency for your product',
              'Create reasons to return (new content, social, progress)',
              'Implement streak mechanics where appropriate',
              'Add collaborative features that require return',
              'Build notification strategy around key moments',
            ],
          },
        ],
        duration: '3-4 weeks',
        deliverables: ['Hook model documentation', 'Engagement feature roadmap'],
        successCriteria: ['Increased session frequency', 'Improved D7 and D30 retention'],
      },
      {
        order: 3,
        title: 'Implement Proactive Retention',
        description: 'Identify and save at-risk users before they churn',
        tactics: [
          {
            name: 'Churn Prediction',
            description: 'Build early warning system for churn risk',
            implementation: [
              'Define leading indicators of churn',
              'Create health score based on engagement',
              'Set up alerts for declining health scores',
              'Create intervention playbooks for each risk level',
              'Automate outreach for at-risk users',
            ],
          },
          {
            name: 'Win-Back Campaigns',
            description: 'Re-engage churned users',
            implementation: [
              'Segment churned users by reason and value',
              'Create personalized win-back sequences',
              'Offer incentives for return where appropriate',
              'Highlight new features or improvements',
              'Make it easy to return with saved data',
            ],
          },
        ],
        duration: '2-3 weeks',
        deliverables: ['Health scoring system', 'Win-back campaign sequences'],
        successCriteria: ['Reduced churn rate', 'Successful win-back of churned users'],
      },
      {
        order: 4,
        title: 'Build Community & Connection',
        description: 'Create community around your product to increase stickiness',
        tactics: [
          {
            name: 'User Community',
            description: 'Build spaces for users to connect and help each other',
            implementation: [
              'Choose community platform (Slack, Discord, Circle)',
              'Create clear community guidelines and value prop',
              'Seed with initial valuable content and discussions',
              'Recruit community champions',
              'Integrate community touchpoints in product',
            ],
            tools: ['Slack', 'Discord', 'Circle', 'Discourse'],
          },
          {
            name: 'Customer Success Program',
            description: 'Proactively help customers succeed',
            implementation: [
              'Define success milestones for customers',
              'Create regular check-in cadence',
              'Celebrate customer wins publicly',
              'Gather feedback for product improvements',
              'Build relationships that increase switching costs',
            ],
          },
        ],
        duration: 'Ongoing',
        deliverables: ['Active user community', 'Customer success playbook'],
        successCriteria: ['Community engagement metrics', 'Higher retention for community members'],
      },
      {
        order: 5,
        title: 'Continuous Value Delivery',
        description: 'Keep delivering new value to maintain engagement',
        tactics: [
          {
            name: 'Feature Adoption Campaigns',
            description: 'Drive adoption of features that improve retention',
            implementation: [
              'Identify features correlated with retention',
              'Create campaigns to drive feature adoption',
              'Use in-app prompts and email sequences',
              'Measure feature adoption by cohort',
              'Iterate based on adoption data',
            ],
          },
          {
            name: 'Personalized Value Communication',
            description: 'Show users the value they are getting',
            implementation: [
              'Create value dashboards showing ROI',
              'Send periodic value recap emails',
              'Celebrate user milestones and achievements',
              'Compare performance to benchmarks',
              'Make value quantifiable and shareable',
            ],
          },
        ],
        duration: 'Ongoing',
        deliverables: ['Feature adoption campaigns', 'Value communication system'],
        successCriteria: ['Higher feature adoption', 'Users can articulate value received'],
      },
    ];
  }

  private getRevenueSteps(businessModel: BusinessModel, budget?: string): PlaybookStep[] {
    return [
      {
        order: 1,
        title: 'Optimize Pricing Strategy',
        description: 'Ensure your pricing captures the value you deliver',
        tactics: [
          {
            name: 'Value Metric Alignment',
            description: 'Align pricing with how customers receive value',
            implementation: [
              'Identify your core value metric',
              'Analyze how value scales with usage',
              'Test different pricing structures',
              'Survey customers on pricing perception',
              'Implement value-based pricing tiers',
            ],
          },
          {
            name: 'Pricing Page Optimization',
            description: 'Optimize pricing presentation for conversion',
            implementation: [
              'Simplify pricing to 3-4 clear options',
              'Anchor with highest tier first',
              'Highlight most popular/recommended tier',
              'Show clear feature differentiation',
              'Add social proof and guarantees',
            ],
          },
        ],
        duration: '2-3 weeks',
        deliverables: ['Optimized pricing strategy', 'New pricing page'],
        successCriteria: ['Improved conversion rate', 'Higher ARPU'],
      },
      {
        order: 2,
        title: 'Implement Expansion Revenue',
        description: 'Grow revenue from existing customers through upsells and cross-sells',
        tactics: [
          {
            name: 'Usage-Based Upsells',
            description: 'Trigger upgrades based on usage patterns',
            implementation: [
              'Define upgrade triggers (usage limits, team size, features)',
              'Create in-app upgrade prompts',
              'Build email sequences for approaching limits',
              'Offer seamless upgrade experience',
              'Track upgrade conversion rates',
            ],
          },
          {
            name: 'Expansion Playbook',
            description: 'Systematically expand accounts',
            implementation: [
              'Identify expansion opportunities in existing accounts',
              'Create land-and-expand strategy',
              'Train team on expansion conversations',
              'Build case studies for internal selling',
              'Track net revenue retention',
            ],
          },
        ],
        duration: '3-4 weeks',
        deliverables: ['Expansion automation', 'Account expansion playbook'],
        successCriteria: ['Positive net revenue retention', 'Higher expansion MRR'],
      },
      {
        order: 3,
        title: 'Reduce Revenue Leakage',
        description: 'Minimize involuntary churn and failed payments',
        tactics: [
          {
            name: 'Dunning Optimization',
            description: 'Recover failed payments automatically',
            implementation: [
              'Implement smart retry logic',
              'Send payment failure notifications',
              'Offer easy card update flow',
              'Create escalation sequence',
              'Consider backup payment methods',
            ],
            tools: ['Stripe', 'Chargebee', 'ProfitWell Retain'],
          },
          {
            name: 'Cancellation Flow Optimization',
            description: 'Save customers attempting to cancel',
            implementation: [
              'Add cancellation survey',
              'Offer alternatives (pause, downgrade, discount)',
              'Address common objections',
              'Make it easy but add friction thoughtfully',
              'Track save rates by reason',
            ],
          },
        ],
        duration: '1-2 weeks',
        deliverables: ['Dunning system', 'Optimized cancellation flow'],
        successCriteria: ['Reduced involuntary churn', 'Higher save rate'],
      },
      {
        order: 4,
        title: 'Build Annual Contract Motion',
        description: 'Shift customers to annual plans for better retention and cash flow',
        tactics: [
          {
            name: 'Annual Plan Incentives',
            description: 'Create compelling reasons to go annual',
            implementation: [
              'Offer meaningful discount (15-20%)',
              'Add exclusive features for annual plans',
              'Create urgency with limited-time offers',
              'Highlight total savings prominently',
              'Make switching seamless',
            ],
          },
          {
            name: 'Annual Conversion Campaign',
            description: 'Systematically convert monthly to annual',
            implementation: [
              'Identify monthly customers with good health scores',
              'Create personalized upgrade offers',
              'Time offers around renewals',
              'Use customer success for high-value accounts',
              'Track annual conversion rate',
            ],
          },
        ],
        duration: '2-3 weeks',
        deliverables: ['Annual plan strategy', 'Conversion campaign'],
        successCriteria: ['Higher percentage of annual contracts'],
      },
      {
        order: 5,
        title: 'Implement Monetization Experiments',
        description: 'Continuously test new revenue opportunities',
        tactics: [
          {
            name: 'New Revenue Streams',
            description: 'Identify and test additional monetization',
            implementation: [
              'Analyze what customers would pay for',
              'Test add-on features or services',
              'Explore marketplace or platform opportunities',
              'Consider professional services',
              'Measure willingness to pay',
            ],
          },
          {
            name: 'Packaging Experiments',
            description: 'Test different feature packaging',
            implementation: [
              'Identify features that could be unbundled',
              'Test different tier configurations',
              'Measure impact on conversion and ARPU',
              'Gather qualitative feedback',
              'Iterate based on results',
            ],
          },
        ],
        duration: 'Ongoing',
        deliverables: ['Revenue experiment roadmap', 'New monetization features'],
        successCriteria: ['Diversified revenue streams', 'Improved unit economics'],
      },
    ];
  }

  private getReferralSteps(businessModel: BusinessModel, budget?: string): PlaybookStep[] {
    return [
      {
        order: 1,
        title: 'Design Your Referral Program',
        description: 'Create a referral program aligned with your product and users',
        tactics: [
          {
            name: 'Incentive Design',
            description: 'Choose the right incentives for referrers and referred',
            implementation: [
              'Analyze what motivates your users (monetary, features, status)',
              'Design two-sided incentive (referrer + referred)',
              'Ensure incentives are sustainable at scale',
              'Make incentives easy to understand',
              'Test different incentive structures',
            ],
          },
          {
            name: 'Referral Mechanics',
            description: 'Design the technical flow of referrals',
            implementation: [
              'Create unique referral links/codes',
              'Build tracking system for attribution',
              'Design sharing interface',
              'Implement reward fulfillment',
              'Add fraud prevention measures',
            ],
            tools: ['ReferralCandy', 'Viral Loops', 'GrowSurf'],
          },
        ],
        duration: '2-3 weeks',
        deliverables: ['Referral program design', 'Technical implementation'],
        successCriteria: ['Working referral system', 'Clear incentive structure'],
      },
      {
        order: 2,
        title: 'Identify Referral Triggers',
        description: 'Find the best moments to ask for referrals',
        tactics: [
          {
            name: 'Moment Mapping',
            description: 'Identify high-emotion moments for referral asks',
            implementation: [
              'Map customer journey for peak satisfaction moments',
              'Identify achievement or success triggers',
              'Note moments of social interaction',
              'Test referral prompts at different times',
              'Measure referral rates by trigger point',
            ],
          },
          {
            name: 'NPS-Based Referrals',
            description: 'Leverage satisfied customers for referrals',
            implementation: [
              'Implement NPS surveys',
              'Follow up promoters with referral ask',
              'Personalize ask based on NPS feedback',
              'Track correlation between NPS and referrals',
              'Create special programs for top promoters',
            ],
          },
        ],
        duration: '1-2 weeks',
        deliverables: ['Trigger map', 'NPS-referral integration'],
        successCriteria: ['Higher referral rate from optimized triggers'],
      },
      {
        order: 3,
        title: 'Build Viral Loops',
        description: 'Create product-native viral mechanics beyond traditional referrals',
        tactics: [
          {
            name: 'Collaboration Virality',
            description: 'Make sharing inherent to product use',
            implementation: [
              'Add features that require inviting others',
              'Create shareable outputs/content',
              'Build team/workspace features',
              'Add public profiles or portfolios',
              'Enable social features',
            ],
          },
          {
            name: 'Network Effects',
            description: 'Build features that improve with more users',
            implementation: [
              'Identify where network effects could exist',
              'Build features that create user-to-user value',
              'Create marketplace or platform dynamics',
              'Measure and communicate network value',
              'Focus growth on network density',
            ],
          },
        ],
        duration: '4-6 weeks',
        deliverables: ['Viral feature specifications', 'Network effect strategy'],
        successCriteria: ['Improved viral coefficient', 'Organic user growth'],
      },
      {
        order: 4,
        title: 'Launch Ambassador Program',
        description: 'Create a program for your most passionate advocates',
        tactics: [
          {
            name: 'Ambassador Identification',
            description: 'Find and recruit your best advocates',
            implementation: [
              'Identify highly engaged users',
              'Look for users already sharing organically',
              'Create application process',
              'Define ambassador criteria and benefits',
              'Build ambassador community',
            ],
          },
          {
            name: 'Ambassador Enablement',
            description: 'Give ambassadors tools to succeed',
            implementation: [
              'Create branded assets and templates',
              'Provide exclusive early access',
              'Set up private communication channel',
              'Offer special incentives and recognition',
              'Track and reward top performers',
            ],
          },
        ],
        duration: '3-4 weeks',
        deliverables: ['Ambassador program', 'Ambassador toolkit'],
        successCriteria: ['Active ambassador community', 'Ambassador-driven referrals'],
      },
      {
        order: 5,
        title: 'Optimize & Scale Referrals',
        description: 'Continuously improve referral program performance',
        tactics: [
          {
            name: 'Referral Analytics',
            description: 'Track and optimize referral performance',
            implementation: [
              'Build referral dashboard',
              'Track full referral funnel',
              'Measure viral coefficient and cycle time',
              'Identify top referral channels',
              'A/B test program elements',
            ],
          },
          {
            name: 'Referral Nurturing',
            description: 'Help referred users convert and become referrers',
            implementation: [
              'Create special onboarding for referred users',
              'Acknowledge the referrer connection',
              'Fast-track referred users to activation',
              'Prompt new users to refer once activated',
              'Create referral chains',
            ],
          },
        ],
        duration: 'Ongoing',
        deliverables: ['Referral analytics dashboard', 'Referral nurture sequences'],
        successCriteria: ['K-factor above 1', 'Sustainable referral growth'],
      },
    ];
  }

  private generateOutcomes(targetStage: string, businessModel: BusinessModel): ExpectedOutcome[] {
    const outcomes: Record<string, ExpectedOutcome[]> = {
      acquisition: [
        { metric: 'Monthly signups', improvement: '2-3x increase', timeframe: '3 months', confidence: 0.7 },
        { metric: 'Cost per acquisition', improvement: '30-50% reduction', timeframe: '3 months', confidence: 0.6 },
        { metric: 'Organic traffic', improvement: '50-100% increase', timeframe: '6 months', confidence: 0.65 },
      ],
      activation: [
        { metric: 'Activation rate', improvement: '20-40% increase', timeframe: '2 months', confidence: 0.75 },
        { metric: 'Time to value', improvement: '50% reduction', timeframe: '2 months', confidence: 0.7 },
        { metric: 'Onboarding completion', improvement: '30% increase', timeframe: '1 month', confidence: 0.8 },
      ],
      retention: [
        { metric: 'Day 7 retention', improvement: '15-25% increase', timeframe: '2 months', confidence: 0.7 },
        { metric: 'Monthly churn', improvement: '20-30% reduction', timeframe: '3 months', confidence: 0.65 },
        { metric: 'DAU/MAU ratio', improvement: '10-20% increase', timeframe: '3 months', confidence: 0.6 },
      ],
      revenue: [
        { metric: 'ARPU', improvement: '15-30% increase', timeframe: '3 months', confidence: 0.7 },
        { metric: 'Net revenue retention', improvement: '10-20% increase', timeframe: '6 months', confidence: 0.6 },
        { metric: 'Annual contract %', improvement: '2x increase', timeframe: '6 months', confidence: 0.65 },
      ],
      referral: [
        { metric: 'Viral coefficient', improvement: 'Achieve K > 0.5', timeframe: '3 months', confidence: 0.6 },
        { metric: 'Referral signups', improvement: '20-30% of new users', timeframe: '6 months', confidence: 0.55 },
        { metric: 'Viral cycle time', improvement: '30% reduction', timeframe: '3 months', confidence: 0.6 },
      ],
    };

    return outcomes[targetStage] || [];
  }

  private getPrerequisites(targetStage: string): string[] {
    const prerequisites: Record<string, string[]> = {
      acquisition: [
        'Clear understanding of target customer',
        'Working product with basic analytics',
        'Ability to track acquisition sources',
      ],
      activation: [
        'Defined activation metric',
        'User journey tracking in place',
        'Ability to modify onboarding flow',
      ],
      retention: [
        'Cohort analysis capability',
        'User engagement tracking',
        'Ability to send targeted communications',
      ],
      revenue: [
        'Working payment system',
        'Pricing page exists',
        'Basic revenue tracking',
      ],
      referral: [
        'Satisfied user base',
        'Ability to track referrals',
        'Infrastructure for incentive distribution',
      ],
    };

    return prerequisites[targetStage] || [];
  }

  private getMetrics(targetStage: string): string[] {
    const metrics: Record<string, string[]> = {
      acquisition: ['CAC', 'Signup conversion rate', 'Traffic by source', 'Lead quality score', 'Sales cycle length'],
      activation: ['Activation rate', 'Time to value', 'Onboarding completion rate', 'Feature adoption rate'],
      retention: ['D1/D7/D30 retention', 'Churn rate', 'DAU/MAU ratio', 'Session frequency', 'NPS'],
      revenue: ['MRR/ARR', 'ARPU', 'LTV', 'Net revenue retention', 'Expansion revenue'],
      referral: ['Viral coefficient (K)', 'Viral cycle time', 'Referral conversion rate', 'Share rate'],
    };

    return metrics[targetStage] || [];
  }

  private getRisks(targetStage: string): Risk[] {
    return [
      {
        description: 'Changes may negatively impact existing user experience',
        probability: 'medium',
        impact: 'medium',
        mitigation: 'Roll out changes gradually and monitor metrics closely',
      },
      {
        description: 'Resource constraints may slow implementation',
        probability: 'high',
        impact: 'medium',
        mitigation: 'Prioritize highest-impact tactics and execute incrementally',
      },
      {
        description: 'Tactics may not work for your specific context',
        probability: 'medium',
        impact: 'low',
        mitigation: 'Treat each tactic as an experiment and iterate based on results',
      },
    ];
  }

  private getResources(targetStage: string, businessModel: BusinessModel): Resource[] {
    return [
      { type: 'guide', name: 'Growth Stage Deep Dive', description: `Comprehensive guide to ${targetStage} strategies` },
      { type: 'template', name: 'Playbook Execution Tracker', description: 'Track progress on playbook implementation' },
      { type: 'tool', name: 'Metrics Dashboard Template', description: 'Template for tracking key metrics' },
    ];
  }

  private getCaseStudies(targetStage: string, businessModel: BusinessModel): { company: string; industry: string; challenge: string; solution: string; results: string[] }[] {
    const caseStudies: Record<string, { company: string; industry: string; challenge: string; solution: string; results: string[] }[]> = {
      acquisition: [
        {
          company: 'Dropbox',
          industry: 'SaaS/Storage',
          challenge: 'Needed cost-effective user acquisition',
          solution: 'Referral program with extra storage for both parties',
          results: ['3900% growth in 15 months', 'Reduced CAC by 60%'],
        },
      ],
      activation: [
        {
          company: 'Slack',
          industry: 'SaaS/Communication',
          challenge: 'Users signed up but did not engage',
          solution: 'Focused on getting teams to send 2000 messages',
          results: ['93% retention after 2000 messages', 'Clear activation metric'],
        },
      ],
      retention: [
        {
          company: 'Duolingo',
          industry: 'EdTech',
          challenge: 'Language learning requires long-term commitment',
          solution: 'Streaks, gamification, and push notifications',
          results: ['Industry-leading retention', '30+ million DAU'],
        },
      ],
      revenue: [
        {
          company: 'Notion',
          industry: 'SaaS/Productivity',
          challenge: 'Convert free users to paid',
          solution: 'Team features and usage-based pricing',
          results: ['$10B valuation', 'Strong expansion revenue'],
        },
      ],
      referral: [
        {
          company: 'PayPal',
          industry: 'FinTech',
          challenge: 'Build network effects for payments',
          solution: '$10 for referrer and $10 for referred',
          results: ['7-10% daily growth', 'Rapid market dominance'],
        },
      ],
    };

    return caseStudies[targetStage] || [];
  }

  private getTemplate(targetStage: string, businessModel: BusinessModel): Partial<GrowthPlaybook> | undefined {
    return this.playbookTemplates.get(`${targetStage}-${businessModel}`);
  }

  private getTimeframe(targetStage: string, budget?: string): string {
    const baseTimeframes: Record<string, string> = {
      acquisition: '8-12 weeks',
      activation: '4-6 weeks',
      retention: '6-10 weeks',
      revenue: '6-8 weeks',
      referral: '8-12 weeks',
    };

    return baseTimeframes[targetStage] || '8-12 weeks';
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private initializeTemplates(): void {
    // Templates can be expanded as needed
  }
}
