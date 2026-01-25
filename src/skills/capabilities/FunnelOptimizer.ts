/**
 * FunnelOptimizer - Growth Funnel Analysis & Optimization
 *
 * Analyzes conversion funnels to identify bottlenecks and
 * provides optimization strategies for each stage.
 */

import {
  GrowthFunnel,
  FunnelStage,
  Bottleneck,
  FunnelOptimization,
  BusinessContext,
  CapabilityResult,
} from '../../core/types';

interface FunnelBenchmark {
  stage: string;
  b2b: { good: number; average: number; poor: number };
  b2c: { good: number; average: number; poor: number };
}

export class FunnelOptimizer {
  private benchmarks: Map<string, FunnelBenchmark> = new Map();

  constructor() {
    this.initializeBenchmarks();
  }

  async execute(input: Record<string, unknown>): Promise<CapabilityResult> {
    const funnelStages = input.funnelStages as any[];
    const primaryGoal = input.primaryGoal as string;
    const currentMetrics = input.currentMetrics as Record<string, number> | undefined;

    const analysis = this.analyzeFunnel(funnelStages, primaryGoal, currentMetrics);

    return {
      success: true,
      data: {
        funnelAnalysis: analysis,
        prioritizedOptimizations: this.prioritizeOptimizations(analysis.optimizations),
        quickWins: this.identifyQuickWins(analysis),
        projectedImpact: this.calculateProjectedImpact(analysis),
      },
      explanation: `Identified ${analysis.bottlenecks.length} bottlenecks with ${analysis.optimizations.length} optimization opportunities`,
    };
  }

  analyze(context: BusinessContext): GrowthFunnel {
    const { currentMetrics, product } = context;
    const productType = product.type;

    // Build funnel stages from metrics
    const stages = this.buildFunnelFromMetrics(currentMetrics, productType);
    const bottlenecks = this.identifyBottlenecks(stages, productType);
    const optimizations = this.generateOptimizations(stages, bottlenecks, productType);

    return {
      stages,
      bottlenecks,
      optimizations,
    };
  }

  private analyzeFunnel(
    funnelStages: any[],
    primaryGoal: string,
    currentMetrics?: Record<string, number>
  ): GrowthFunnel {
    const stages = this.normalizeStages(funnelStages);
    const productType = 'b2b'; // Default, should come from context

    const bottlenecks = this.identifyBottlenecks(stages, productType);
    const optimizations = this.generateOptimizations(stages, bottlenecks, productType, primaryGoal);

    return {
      stages,
      bottlenecks,
      optimizations,
    };
  }

  private normalizeStages(rawStages: any[]): FunnelStage[] {
    return rawStages.map((stage, index) => ({
      name: stage.name || `Stage ${index + 1}`,
      description: stage.description || '',
      entryMetric: stage.entryMetric || stage.entries || 0,
      exitMetric: stage.exitMetric || stage.exits || 0,
      conversionRate: stage.conversionRate ||
        (stage.entryMetric && stage.exitMetric ? stage.exitMetric / stage.entryMetric : 0),
      dropOffReasons: stage.dropOffReasons || [],
      optimizations: [],
    }));
  }

  private buildFunnelFromMetrics(metrics: any, productType: string): FunnelStage[] {
    const stages: FunnelStage[] = [];

    // Awareness to Interest (Traffic to Signup)
    const traffic = metrics.monthlyActiveUsers ? metrics.monthlyActiveUsers * 10 : 10000;
    const signups = metrics.newUsersThisMonth || Math.round(traffic * 0.03);
    stages.push({
      name: 'Awareness → Interest',
      description: 'Visitors becoming signups',
      entryMetric: traffic,
      exitMetric: signups,
      conversionRate: signups / traffic,
      dropOffReasons: [
        'Unclear value proposition',
        'Poor landing page experience',
        'Weak call-to-action',
        'Trust issues',
      ],
      optimizations: [],
    });

    // Interest to Activation
    const activated = metrics.activationRate
      ? Math.round(signups * metrics.activationRate)
      : Math.round(signups * 0.4);
    stages.push({
      name: 'Interest → Activation',
      description: 'Signups experiencing core value',
      entryMetric: signups,
      exitMetric: activated,
      conversionRate: activated / signups,
      dropOffReasons: [
        'Complicated onboarding',
        'Time to value too long',
        'Unclear next steps',
        'Technical issues',
      ],
      optimizations: [],
    });

    // Activation to Retention
    const retained = metrics.day30Retention
      ? Math.round(activated * metrics.day30Retention)
      : Math.round(activated * 0.25);
    stages.push({
      name: 'Activation → Retention',
      description: 'Active users becoming regular users',
      entryMetric: activated,
      exitMetric: retained,
      conversionRate: retained / activated,
      dropOffReasons: [
        'Product not sticky enough',
        'Lack of habit formation',
        'Better alternatives found',
        'Use case not recurring',
      ],
      optimizations: [],
    });

    // Retention to Revenue
    const paying = metrics.monthlyRecurringRevenue && metrics.averageRevenuePerUser
      ? Math.round(metrics.monthlyRecurringRevenue / metrics.averageRevenuePerUser)
      : Math.round(retained * 0.1);
    stages.push({
      name: 'Retention → Revenue',
      description: 'Retained users becoming paying customers',
      entryMetric: retained,
      exitMetric: paying,
      conversionRate: paying / retained,
      dropOffReasons: [
        'Pricing not aligned with value',
        'Free tier too generous',
        'Payment friction',
        'Unclear upgrade path',
      ],
      optimizations: [],
    });

    // Revenue to Referral
    const referrers = metrics.viralCoefficient
      ? Math.round(paying * metrics.viralCoefficient)
      : Math.round(paying * 0.15);
    stages.push({
      name: 'Revenue → Referral',
      description: 'Customers becoming advocates',
      entryMetric: paying,
      exitMetric: referrers,
      conversionRate: referrers / paying,
      dropOffReasons: [
        'No referral program',
        'Low satisfaction',
        'No incentive to share',
        'Sharing not easy',
      ],
      optimizations: [],
    });

    return stages;
  }

  private identifyBottlenecks(stages: FunnelStage[], productType: string): Bottleneck[] {
    const bottlenecks: Bottleneck[] = [];

    for (const stage of stages) {
      const benchmark = this.getBenchmark(stage.name, productType);

      if (!benchmark) continue;

      const thresholds = productType === 'b2b' ? benchmark.b2b : benchmark.b2c;

      if (stage.conversionRate < thresholds.poor) {
        bottlenecks.push({
          stage: stage.name,
          severity: 'critical',
          cause: stage.dropOffReasons[0] || 'Unknown cause',
          impact: `Conversion rate ${(stage.conversionRate * 100).toFixed(1)}% is critically below benchmark of ${(thresholds.poor * 100).toFixed(1)}%`,
          solutions: this.getSolutionsForStage(stage.name, 'critical'),
        });
      } else if (stage.conversionRate < thresholds.average) {
        bottlenecks.push({
          stage: stage.name,
          severity: 'high',
          cause: stage.dropOffReasons[0] || 'Suboptimal conversion',
          impact: `Conversion rate ${(stage.conversionRate * 100).toFixed(1)}% is below average benchmark of ${(thresholds.average * 100).toFixed(1)}%`,
          solutions: this.getSolutionsForStage(stage.name, 'high'),
        });
      } else if (stage.conversionRate < thresholds.good) {
        bottlenecks.push({
          stage: stage.name,
          severity: 'medium',
          cause: 'Room for optimization',
          impact: `Conversion rate ${(stage.conversionRate * 100).toFixed(1)}% has room to improve to ${(thresholds.good * 100).toFixed(1)}%`,
          solutions: this.getSolutionsForStage(stage.name, 'medium'),
        });
      }
    }

    return bottlenecks.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  private getBenchmark(stageName: string, productType: string): FunnelBenchmark | undefined {
    // Map stage names to benchmark keys
    const stageMapping: Record<string, string> = {
      'Awareness → Interest': 'visitor-to-signup',
      'Interest → Activation': 'signup-to-activation',
      'Activation → Retention': 'activation-to-retention',
      'Retention → Revenue': 'retention-to-revenue',
      'Revenue → Referral': 'revenue-to-referral',
    };

    const key = stageMapping[stageName];
    return key ? this.benchmarks.get(key) : undefined;
  }

  private getSolutionsForStage(stageName: string, severity: string): string[] {
    const solutions: Record<string, string[]> = {
      'Awareness → Interest': [
        'Clarify value proposition above the fold',
        'Add social proof and testimonials',
        'Simplify signup form to essential fields only',
        'Create compelling CTA with clear benefit',
        'Add live chat for instant support',
        'Implement exit-intent popup with offer',
      ],
      'Interest → Activation': [
        'Reduce steps to first value moment',
        'Add interactive onboarding tutorial',
        'Provide templates and quick-start options',
        'Send behavioral onboarding emails',
        'Offer concierge onboarding for key segments',
        'Remove unnecessary setup steps',
      ],
      'Activation → Retention': [
        'Identify and reinforce habit triggers',
        'Implement engagement notifications',
        'Create reasons to return (new content, social)',
        'Build streak or progress mechanics',
        'Send re-engagement campaigns',
        'Improve core product stickiness',
      ],
      'Retention → Revenue': [
        'Align pricing tiers with value delivery',
        'Create clear upgrade triggers',
        'Implement usage-based prompts',
        'Reduce payment friction',
        'Offer limited-time upgrade incentives',
        'Show ROI and value dashboard',
      ],
      'Revenue → Referral': [
        'Launch referral program with incentives',
        'Add easy share buttons at key moments',
        'Create shareable achievements',
        'Ask for referrals after positive experiences',
        'Make referral rewards immediate',
        'Build community for advocates',
      ],
    };

    return solutions[stageName] || ['Analyze and optimize this stage'];
  }

  private generateOptimizations(
    stages: FunnelStage[],
    bottlenecks: Bottleneck[],
    productType: string,
    primaryGoal?: string
  ): FunnelOptimization[] {
    const optimizations: FunnelOptimization[] = [];

    // Add optimizations from bottlenecks
    for (const bottleneck of bottlenecks) {
      for (const solution of bottleneck.solutions.slice(0, 3)) {
        optimizations.push({
          stage: bottleneck.stage,
          tactic: solution,
          expectedLift: this.estimateLift(bottleneck.severity),
          effort: this.estimateEffort(solution),
          priority: this.calculateOptimizationPriority(bottleneck.severity, solution, primaryGoal),
        });
      }
    }

    // Add general optimizations for each stage
    for (const stage of stages) {
      const generalOpts = this.getGeneralOptimizations(stage.name);
      for (const opt of generalOpts) {
        if (!optimizations.some(o => o.tactic === opt.tactic)) {
          optimizations.push({
            ...opt,
            stage: stage.name,
          });
        }
      }
    }

    return optimizations.sort((a, b) => b.priority - a.priority);
  }

  private estimateLift(severity: string): string {
    const lifts: Record<string, string> = {
      critical: '50-100% improvement potential',
      high: '25-50% improvement potential',
      medium: '10-25% improvement potential',
      low: '5-10% improvement potential',
    };
    return lifts[severity] || '10-20% improvement potential';
  }

  private estimateEffort(tactic: string): 'low' | 'medium' | 'high' {
    const lowEffortKeywords = ['add', 'change', 'update', 'clarify', 'simplify'];
    const highEffortKeywords = ['build', 'implement', 'create system', 'redesign'];

    const tacticLower = tactic.toLowerCase();

    if (lowEffortKeywords.some(k => tacticLower.includes(k))) return 'low';
    if (highEffortKeywords.some(k => tacticLower.includes(k))) return 'high';
    return 'medium';
  }

  private calculateOptimizationPriority(
    severity: string,
    tactic: string,
    primaryGoal?: string
  ): number {
    let priority = 5;

    // Severity boost
    if (severity === 'critical') priority += 4;
    if (severity === 'high') priority += 3;
    if (severity === 'medium') priority += 1;

    // Effort adjustment
    const effort = this.estimateEffort(tactic);
    if (effort === 'low') priority += 2;
    if (effort === 'high') priority -= 1;

    // Goal alignment
    if (primaryGoal) {
      const tacticLower = tactic.toLowerCase();
      if (tacticLower.includes(primaryGoal.toLowerCase())) {
        priority += 2;
      }
    }

    return Math.min(10, Math.max(1, priority));
  }

  private getGeneralOptimizations(stageName: string): Partial<FunnelOptimization>[] {
    return [
      { tactic: 'Set up funnel tracking in analytics', expectedLift: 'Enables optimization', effort: 'low', priority: 8 },
      { tactic: 'Implement session recordings for this stage', expectedLift: 'Qualitative insights', effort: 'low', priority: 7 },
    ];
  }

  private prioritizeOptimizations(optimizations: FunnelOptimization[]): FunnelOptimization[] {
    return [...optimizations].sort((a, b) => {
      // Sort by priority descending, then by effort ascending
      if (b.priority !== a.priority) return b.priority - a.priority;

      const effortOrder = { low: 0, medium: 1, high: 2 };
      return effortOrder[a.effort] - effortOrder[b.effort];
    });
  }

  private identifyQuickWins(analysis: GrowthFunnel): FunnelOptimization[] {
    return analysis.optimizations.filter(
      opt => opt.effort === 'low' && opt.priority >= 6
    ).slice(0, 5);
  }

  private calculateProjectedImpact(analysis: GrowthFunnel): {
    metric: string;
    currentValue: string;
    projectedValue: string;
    improvement: string;
  }[] {
    const impacts: { metric: string; currentValue: string; projectedValue: string; improvement: string }[] = [];

    // Calculate cumulative conversion rate
    let currentConversion = 1;
    for (const stage of analysis.stages) {
      currentConversion *= stage.conversionRate;
    }

    // Estimate improved conversion if bottlenecks are fixed
    let projectedConversion = 1;
    for (const stage of analysis.stages) {
      const bottleneck = analysis.bottlenecks.find(b => b.stage === stage.name);
      let improvedRate = stage.conversionRate;

      if (bottleneck) {
        if (bottleneck.severity === 'critical') improvedRate *= 1.5;
        else if (bottleneck.severity === 'high') improvedRate *= 1.3;
        else improvedRate *= 1.15;
      }

      projectedConversion *= Math.min(improvedRate, 0.95);
    }

    impacts.push({
      metric: 'End-to-End Conversion',
      currentValue: `${(currentConversion * 100).toFixed(2)}%`,
      projectedValue: `${(projectedConversion * 100).toFixed(2)}%`,
      improvement: `${((projectedConversion / currentConversion - 1) * 100).toFixed(0)}% increase`,
    });

    return impacts;
  }

  private initializeBenchmarks(): void {
    this.benchmarks.set('visitor-to-signup', {
      stage: 'Visitor to Signup',
      b2b: { good: 0.05, average: 0.02, poor: 0.01 },
      b2c: { good: 0.08, average: 0.04, poor: 0.02 },
    });

    this.benchmarks.set('signup-to-activation', {
      stage: 'Signup to Activation',
      b2b: { good: 0.50, average: 0.30, poor: 0.15 },
      b2c: { good: 0.60, average: 0.40, poor: 0.20 },
    });

    this.benchmarks.set('activation-to-retention', {
      stage: 'Activation to D30 Retention',
      b2b: { good: 0.40, average: 0.25, poor: 0.10 },
      b2c: { good: 0.30, average: 0.15, poor: 0.05 },
    });

    this.benchmarks.set('retention-to-revenue', {
      stage: 'Retention to Paid',
      b2b: { good: 0.15, average: 0.08, poor: 0.03 },
      b2c: { good: 0.08, average: 0.04, poor: 0.01 },
    });

    this.benchmarks.set('revenue-to-referral', {
      stage: 'Paid to Referrer',
      b2b: { good: 0.25, average: 0.10, poor: 0.03 },
      b2c: { good: 0.20, average: 0.08, poor: 0.02 },
    });
  }
}
