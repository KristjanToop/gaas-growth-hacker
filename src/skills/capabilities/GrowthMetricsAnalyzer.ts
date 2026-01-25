/**
 * GrowthMetricsAnalyzer - Growth Metrics Analysis & Insights
 *
 * Analyzes growth metrics to identify trends, benchmark performance,
 * and provide actionable insights.
 */

import {
  GrowthMetrics,
  CapabilityResult,
} from '../../core/types';

interface MetricAnalysis {
  metric: string;
  currentValue: number | string;
  benchmark: { good: string; average: string; poor: string };
  status: 'excellent' | 'good' | 'average' | 'needs-improvement' | 'critical';
  trend?: 'improving' | 'stable' | 'declining';
  insights: string[];
  recommendations: string[];
}

interface GrowthModel {
  name: string;
  formula: string;
  currentValue: number;
  interpretation: string;
  improvement: string;
}

export class GrowthMetricsAnalyzer {
  async execute(input: Record<string, unknown>): Promise<CapabilityResult> {
    const metrics = input.metrics as GrowthMetrics;
    const benchmarks = input.benchmarks as Record<string, unknown> | undefined;
    const timeframe = input.timeframe as string | undefined;

    const analysis = this.analyzeMetrics(metrics);
    const growthModels = this.calculateGrowthModels(metrics);
    const healthScore = this.calculateHealthScore(metrics);
    const priorities = this.prioritizeImprovements(analysis);

    return {
      success: true,
      data: {
        metricAnalysis: analysis,
        growthModels,
        healthScore,
        priorities,
        dashboard: this.createDashboardRecommendation(metrics),
        forecasts: this.generateForecasts(metrics),
      },
      explanation: `Analyzed ${Object.keys(metrics).length} metrics. Health score: ${healthScore.score}/100`,
    };
  }

  private analyzeMetrics(metrics: GrowthMetrics): MetricAnalysis[] {
    const analyses: MetricAnalysis[] = [];

    // Acquisition Metrics
    if (metrics.monthlyActiveUsers !== undefined) {
      analyses.push(this.analyzeMAU(metrics.monthlyActiveUsers, metrics.newUsersThisMonth));
    }

    if (metrics.costPerAcquisition !== undefined) {
      analyses.push(this.analyzeCAC(metrics.costPerAcquisition, metrics.lifetimeValue));
    }

    if (metrics.signupConversionRate !== undefined) {
      analyses.push(this.analyzeSignupRate(metrics.signupConversionRate));
    }

    // Activation Metrics
    if (metrics.activationRate !== undefined) {
      analyses.push(this.analyzeActivation(metrics.activationRate, metrics.timeToValue));
    }

    // Retention Metrics
    if (metrics.day7Retention !== undefined) {
      analyses.push(this.analyzeRetention(
        metrics.day1Retention,
        metrics.day7Retention,
        metrics.day30Retention
      ));
    }

    if (metrics.monthlyChurnRate !== undefined) {
      analyses.push(this.analyzeChurn(metrics.monthlyChurnRate));
    }

    // Revenue Metrics
    if (metrics.monthlyRecurringRevenue !== undefined) {
      analyses.push(this.analyzeMRR(metrics.monthlyRecurringRevenue, metrics.netRevenueRetention));
    }

    if (metrics.averageRevenuePerUser !== undefined && metrics.lifetimeValue !== undefined) {
      analyses.push(this.analyzeUnitEconomics(
        metrics.averageRevenuePerUser,
        metrics.lifetimeValue,
        metrics.costPerAcquisition
      ));
    }

    // Viral Metrics
    if (metrics.viralCoefficient !== undefined) {
      analyses.push(this.analyzeVirality(metrics.viralCoefficient, metrics.viralCycleTime));
    }

    // Engagement Metrics
    if (metrics.sessionsPerUser !== undefined) {
      analyses.push(this.analyzeEngagement(
        metrics.sessionsPerUser,
        metrics.sessionDuration,
        metrics.npsScore
      ));
    }

    return analyses;
  }

  private analyzeMAU(mau: number, newUsers?: number): MetricAnalysis {
    const growthRate = newUsers && mau > 0 ? (newUsers / mau) * 100 : undefined;

    return {
      metric: 'Monthly Active Users',
      currentValue: mau,
      benchmark: { good: '10%+ MoM growth', average: '5-10% MoM growth', poor: '<5% MoM growth' },
      status: growthRate && growthRate > 10 ? 'good' : growthRate && growthRate > 5 ? 'average' : 'needs-improvement',
      insights: [
        `Current MAU: ${mau.toLocaleString()}`,
        newUsers ? `New users this month: ${newUsers.toLocaleString()} (${growthRate?.toFixed(1)}% growth)` : 'New user tracking not available',
      ],
      recommendations: [
        'Track MAU cohorts by acquisition channel',
        'Monitor activated vs. total MAU',
        'Set up weekly growth rate tracking',
      ],
    };
  }

  private analyzeCAC(cac: number, ltv?: number): MetricAnalysis {
    const ltvCacRatio = ltv ? ltv / cac : undefined;

    let status: MetricAnalysis['status'] = 'needs-improvement';
    if (ltvCacRatio && ltvCacRatio > 3) status = 'excellent';
    else if (ltvCacRatio && ltvCacRatio > 2) status = 'good';
    else if (ltvCacRatio && ltvCacRatio > 1) status = 'average';
    else status = 'critical';

    return {
      metric: 'Customer Acquisition Cost',
      currentValue: `$${cac}`,
      benchmark: { good: 'LTV:CAC > 3:1', average: 'LTV:CAC 2-3:1', poor: 'LTV:CAC < 2:1' },
      status,
      insights: [
        `CAC: $${cac}`,
        ltv ? `LTV: $${ltv}` : 'LTV not provided',
        ltvCacRatio ? `LTV:CAC ratio: ${ltvCacRatio.toFixed(1)}:1` : 'Calculate LTV to assess unit economics',
      ],
      recommendations: ltvCacRatio && ltvCacRatio < 3 ? [
        'Optimize highest CAC channels',
        'Improve conversion rates to reduce CAC',
        'Increase customer lifetime value through retention',
        'Test lower-cost acquisition channels',
      ] : [
        'Healthy unit economics - consider scaling acquisition spend',
        'Track CAC by channel to identify best performers',
      ],
    };
  }

  private analyzeSignupRate(rate: number): MetricAnalysis {
    return {
      metric: 'Signup Conversion Rate',
      currentValue: `${(rate * 100).toFixed(1)}%`,
      benchmark: { good: '>5%', average: '2-5%', poor: '<2%' },
      status: rate > 0.05 ? 'good' : rate > 0.02 ? 'average' : 'needs-improvement',
      insights: [
        `${(rate * 100).toFixed(1)}% of visitors sign up`,
        `For every 1000 visitors, ${Math.round(rate * 1000)} sign up`,
      ],
      recommendations: rate < 0.05 ? [
        'Clarify value proposition above the fold',
        'Reduce signup form friction',
        'Add social proof near signup CTA',
        'Test different CTAs and copy',
      ] : [
        'Good signup rate - focus on activation',
        'Consider traffic quality optimization',
      ],
    };
  }

  private analyzeActivation(rate: number, ttv?: number): MetricAnalysis {
    return {
      metric: 'Activation Rate',
      currentValue: `${(rate * 100).toFixed(1)}%`,
      benchmark: { good: '>50%', average: '30-50%', poor: '<30%' },
      status: rate > 0.5 ? 'good' : rate > 0.3 ? 'average' : 'needs-improvement',
      insights: [
        `${(rate * 100).toFixed(1)}% of signups reach activation`,
        ttv ? `Time to value: ${ttv} hours` : 'Time to value not tracked',
        `${((1 - rate) * 100).toFixed(1)}% drop off before activation`,
      ],
      recommendations: rate < 0.5 ? [
        'Identify and remove activation blockers',
        'Simplify onboarding to essential steps only',
        'Add guidance and templates',
        'Implement activation emails',
        'Offer onboarding assistance',
      ] : [
        'Strong activation - protect and optimize',
        'Track activation by cohort and source',
      ],
    };
  }

  private analyzeRetention(d1?: number, d7?: number, d30?: number): MetricAnalysis {
    const values: string[] = [];
    if (d1) values.push(`D1: ${(d1 * 100).toFixed(0)}%`);
    if (d7) values.push(`D7: ${(d7 * 100).toFixed(0)}%`);
    if (d30) values.push(`D30: ${(d30 * 100).toFixed(0)}%`);

    const status = d7 && d7 > 0.4 ? 'good' : d7 && d7 > 0.2 ? 'average' : 'needs-improvement';

    return {
      metric: 'Retention Rates',
      currentValue: values.join(', ') || 'Not tracked',
      benchmark: { good: 'D7 >40%, D30 >25%', average: 'D7 20-40%, D30 15-25%', poor: 'D7 <20%, D30 <15%' },
      status,
      insights: [
        ...values.map(v => v),
        d7 && d30 ? `${((1 - (d30 / d7)) * 100).toFixed(0)}% drop between D7 and D30` : '',
      ].filter(Boolean),
      recommendations: status !== 'good' ? [
        'Implement cohort analysis to understand retention patterns',
        'Identify retention-correlated behaviors',
        'Build engagement loops and triggers',
        'Develop re-engagement campaigns',
        'Interview churned users',
      ] : [
        'Strong retention foundation',
        'Focus on extending retention curve',
      ],
    };
  }

  private analyzeChurn(churn: number): MetricAnalysis {
    return {
      metric: 'Monthly Churn Rate',
      currentValue: `${(churn * 100).toFixed(1)}%`,
      benchmark: { good: '<3%', average: '3-7%', poor: '>7%' },
      status: churn < 0.03 ? 'good' : churn < 0.07 ? 'average' : 'critical',
      insights: [
        `${(churn * 100).toFixed(1)}% of customers churn monthly`,
        `Annual churn: ~${((1 - Math.pow(1 - churn, 12)) * 100).toFixed(0)}%`,
        `Average customer lifetime: ${(1 / churn).toFixed(1)} months`,
      ],
      recommendations: churn > 0.05 ? [
        'Implement churn prediction and intervention',
        'Analyze churn reasons through surveys',
        'Create retention playbooks',
        'Build customer success program',
        'Improve onboarding to reduce early churn',
      ] : [
        'Healthy churn - maintain focus on retention',
        'Look for expansion opportunities',
      ],
    };
  }

  private analyzeMRR(mrr: number, nrr?: number): MetricAnalysis {
    return {
      metric: 'Monthly Recurring Revenue',
      currentValue: `$${mrr.toLocaleString()}`,
      benchmark: { good: 'NRR >110%', average: 'NRR 90-110%', poor: 'NRR <90%' },
      status: nrr && nrr > 1.1 ? 'excellent' : nrr && nrr > 0.9 ? 'average' : 'needs-improvement',
      insights: [
        `MRR: $${mrr.toLocaleString()}`,
        `ARR: $${(mrr * 12).toLocaleString()}`,
        nrr ? `Net Revenue Retention: ${(nrr * 100).toFixed(0)}%` : 'NRR not tracked',
      ],
      recommendations: [
        'Track MRR movements (new, expansion, contraction, churn)',
        'Implement expansion revenue tactics',
        'Focus on reducing revenue churn',
        nrr && nrr < 1 ? 'Critical: Revenue shrinking without new sales' : '',
      ].filter(Boolean),
    };
  }

  private analyzeUnitEconomics(arpu: number, ltv: number, cac?: number): MetricAnalysis {
    const ltvCacRatio = cac ? ltv / cac : undefined;
    const paybackMonths = cac && arpu ? cac / arpu : undefined;

    return {
      metric: 'Unit Economics',
      currentValue: `LTV: $${ltv}, ARPU: $${arpu}`,
      benchmark: { good: 'LTV:CAC >3, Payback <12mo', average: 'LTV:CAC 2-3', poor: 'LTV:CAC <2' },
      status: ltvCacRatio && ltvCacRatio > 3 ? 'excellent' : ltvCacRatio && ltvCacRatio > 2 ? 'good' : 'needs-improvement',
      insights: [
        `ARPU: $${arpu}/month`,
        `LTV: $${ltv}`,
        ltvCacRatio ? `LTV:CAC: ${ltvCacRatio.toFixed(1)}:1` : 'CAC needed for full analysis',
        paybackMonths ? `CAC Payback: ${paybackMonths.toFixed(1)} months` : '',
      ].filter(Boolean),
      recommendations: [
        'Focus on increasing ARPU through upsells',
        'Extend customer lifetime through retention',
        'Optimize CAC through channel efficiency',
        paybackMonths && paybackMonths > 12 ? 'Long payback period - prioritize retention' : '',
      ].filter(Boolean),
    };
  }

  private analyzeVirality(k: number, cycleTime?: number): MetricAnalysis {
    return {
      metric: 'Viral Coefficient',
      currentValue: k.toFixed(2),
      benchmark: { good: 'K >0.5', average: 'K 0.2-0.5', poor: 'K <0.2' },
      status: k > 0.5 ? 'good' : k > 0.2 ? 'average' : 'needs-improvement',
      insights: [
        `K-factor: ${k.toFixed(2)}`,
        `Each user brings ${k.toFixed(2)} new users`,
        k >= 1 ? 'Viral growth achieved! Each user brings >1 new user' : `Need K > 1 for pure viral growth`,
        cycleTime ? `Viral cycle time: ${cycleTime} days` : '',
      ].filter(Boolean),
      recommendations: k < 0.5 ? [
        'Implement or improve referral program',
        'Add viral loops to product',
        'Make sharing frictionless',
        'Identify and optimize share triggers',
        'Reduce viral cycle time',
      ] : [
        'Strong viral foundation - optimize cycle time',
        'Scale viral mechanics',
      ],
    };
  }

  private analyzeEngagement(sessions?: number, duration?: number, nps?: number): MetricAnalysis {
    const insights: string[] = [];
    if (sessions) insights.push(`${sessions.toFixed(1)} sessions/user/month`);
    if (duration) insights.push(`${duration.toFixed(1)} min avg session`);
    if (nps !== undefined) insights.push(`NPS: ${nps}`);

    return {
      metric: 'User Engagement',
      currentValue: insights.join(', ') || 'Not tracked',
      benchmark: { good: 'NPS >50, High frequency', average: 'NPS 20-50', poor: 'NPS <20' },
      status: nps && nps > 50 ? 'excellent' : nps && nps > 20 ? 'good' : 'needs-improvement',
      insights,
      recommendations: [
        'Track engagement by user segment',
        'Identify power user behaviors',
        'Build features that increase engagement',
        'Survey low-engagement users',
      ],
    };
  }

  private calculateGrowthModels(metrics: GrowthMetrics): GrowthModel[] {
    const models: GrowthModel[] = [];

    // Quick Ratio
    if (metrics.newUsersThisMonth && metrics.monthlyChurnRate && metrics.monthlyActiveUsers) {
      const newMRR = metrics.newUsersThisMonth;
      const churnedUsers = metrics.monthlyActiveUsers * metrics.monthlyChurnRate;
      const quickRatio = newMRR / churnedUsers;

      models.push({
        name: 'Quick Ratio',
        formula: 'New Users / Churned Users',
        currentValue: quickRatio,
        interpretation: quickRatio > 4 ? 'Excellent growth efficiency' :
          quickRatio > 2 ? 'Good growth' :
            quickRatio > 1 ? 'Growing but with high churn' : 'Shrinking user base',
        improvement: 'Increase new users or reduce churn',
      });
    }

    // Viral Factor Impact
    if (metrics.viralCoefficient && metrics.viralCycleTime) {
      const monthlyViralMultiplier = Math.pow(1 + metrics.viralCoefficient, 30 / metrics.viralCycleTime);

      models.push({
        name: 'Monthly Viral Multiplier',
        formula: '(1 + K)^(30/cycle_time)',
        currentValue: monthlyViralMultiplier,
        interpretation: `Each cohort grows ${((monthlyViralMultiplier - 1) * 100).toFixed(0)}% monthly through virality`,
        improvement: 'Increase K-factor or reduce cycle time',
      });
    }

    // Customer Lifetime Value
    if (metrics.averageRevenuePerUser && metrics.monthlyChurnRate) {
      const calculatedLTV = metrics.averageRevenuePerUser / metrics.monthlyChurnRate;

      models.push({
        name: 'LTV (Simple)',
        formula: 'ARPU / Monthly Churn Rate',
        currentValue: calculatedLTV,
        interpretation: `Expected lifetime value: $${calculatedLTV.toFixed(0)}`,
        improvement: 'Increase ARPU or reduce churn',
      });
    }

    // Growth Rate
    if (metrics.monthlyActiveUsers && metrics.newUsersThisMonth) {
      const growthRate = metrics.newUsersThisMonth / metrics.monthlyActiveUsers;
      const yearsTo10x = Math.log(10) / Math.log(1 + growthRate) / 12;

      models.push({
        name: 'Time to 10x',
        formula: 'ln(10) / ln(1 + growth_rate) / 12',
        currentValue: yearsTo10x,
        interpretation: `At current rate, ${yearsTo10x.toFixed(1)} years to 10x`,
        improvement: 'Increase monthly growth rate',
      });
    }

    return models;
  }

  private calculateHealthScore(metrics: GrowthMetrics): {
    score: number;
    components: { name: string; score: number; weight: number }[];
    summary: string;
  } {
    const components: { name: string; score: number; weight: number }[] = [];

    // Acquisition health (20%)
    if (metrics.signupConversionRate) {
      const acqScore = Math.min(100, (metrics.signupConversionRate / 0.05) * 100);
      components.push({ name: 'Acquisition', score: acqScore, weight: 0.2 });
    }

    // Activation health (25%)
    if (metrics.activationRate) {
      const actScore = Math.min(100, (metrics.activationRate / 0.5) * 100);
      components.push({ name: 'Activation', score: actScore, weight: 0.25 });
    }

    // Retention health (25%)
    if (metrics.day30Retention) {
      const retScore = Math.min(100, (metrics.day30Retention / 0.25) * 100);
      components.push({ name: 'Retention', score: retScore, weight: 0.25 });
    }

    // Revenue health (20%)
    if (metrics.netRevenueRetention) {
      const revScore = Math.min(100, (metrics.netRevenueRetention / 1.1) * 100);
      components.push({ name: 'Revenue', score: revScore, weight: 0.2 });
    }

    // Virality health (10%)
    if (metrics.viralCoefficient) {
      const virScore = Math.min(100, (metrics.viralCoefficient / 0.5) * 100);
      components.push({ name: 'Virality', score: virScore, weight: 0.1 });
    }

    // Calculate weighted score
    const totalWeight = components.reduce((sum, c) => sum + c.weight, 0);
    const score = totalWeight > 0
      ? Math.round(components.reduce((sum, c) => sum + (c.score * c.weight), 0) / totalWeight)
      : 50;

    // Generate summary
    const weakest = components.sort((a, b) => a.score - b.score)[0];
    const summary = weakest
      ? `Overall health: ${score}/100. Priority area: ${weakest.name} (${Math.round(weakest.score)}/100)`
      : 'Insufficient data for health score';

    return { score, components, summary };
  }

  private prioritizeImprovements(analyses: MetricAnalysis[]): {
    priority: number;
    metric: string;
    recommendation: string;
    expectedImpact: string;
  }[] {
    const improvements: { priority: number; metric: string; recommendation: string; expectedImpact: string }[] = [];

    for (const analysis of analyses) {
      if (analysis.status === 'critical' || analysis.status === 'needs-improvement') {
        improvements.push({
          priority: analysis.status === 'critical' ? 1 : 2,
          metric: analysis.metric,
          recommendation: analysis.recommendations[0] || 'Improve this metric',
          expectedImpact: `Move ${analysis.metric} from ${analysis.status} to good`,
        });
      }
    }

    return improvements.sort((a, b) => a.priority - b.priority);
  }

  private createDashboardRecommendation(metrics: GrowthMetrics): {
    northStar: string;
    keyMetrics: string[];
    trackingGaps: string[];
  } {
    const trackingGaps: string[] = [];

    if (!metrics.activationRate) trackingGaps.push('Activation rate');
    if (!metrics.day7Retention) trackingGaps.push('Retention rates');
    if (!metrics.viralCoefficient) trackingGaps.push('Viral coefficient');
    if (!metrics.costPerAcquisition) trackingGaps.push('CAC');
    if (!metrics.lifetimeValue) trackingGaps.push('LTV');

    return {
      northStar: 'Weekly Active Users who have completed activation',
      keyMetrics: [
        'Signup Conversion Rate',
        'Activation Rate',
        'Day 7 Retention',
        'Monthly Churn',
        'MRR / ARR',
        'NPS Score',
      ],
      trackingGaps,
    };
  }

  private generateForecasts(metrics: GrowthMetrics): {
    metric: string;
    current: number;
    forecast3mo: number;
    forecast12mo: number;
    assumptions: string;
  }[] {
    const forecasts: { metric: string; current: number; forecast3mo: number; forecast12mo: number; assumptions: string }[] = [];

    if (metrics.monthlyActiveUsers && metrics.newUsersThisMonth) {
      const growthRate = metrics.newUsersThisMonth / metrics.monthlyActiveUsers;
      forecasts.push({
        metric: 'Monthly Active Users',
        current: metrics.monthlyActiveUsers,
        forecast3mo: Math.round(metrics.monthlyActiveUsers * Math.pow(1 + growthRate, 3)),
        forecast12mo: Math.round(metrics.monthlyActiveUsers * Math.pow(1 + growthRate, 12)),
        assumptions: `Assuming ${(growthRate * 100).toFixed(1)}% monthly growth continues`,
      });
    }

    if (metrics.monthlyRecurringRevenue) {
      const growthRate = 0.1; // Assume 10% growth if not provided
      forecasts.push({
        metric: 'MRR',
        current: metrics.monthlyRecurringRevenue,
        forecast3mo: Math.round(metrics.monthlyRecurringRevenue * Math.pow(1.1, 3)),
        forecast12mo: Math.round(metrics.monthlyRecurringRevenue * Math.pow(1.1, 12)),
        assumptions: 'Assuming 10% monthly MRR growth',
      });
    }

    return forecasts;
  }
}
