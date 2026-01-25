/**
 * GrowthHackerSkill - The Most Intelligent Growth Hacking System for Claude Code
 *
 * This skill provides comprehensive growth hacking capabilities including:
 * - Growth Playbook Generation
 * - Viral Loop Design & Optimization
 * - Acquisition Channel Analysis
 * - Funnel Optimization
 * - Retention Strategy Development
 * - Competitor Intelligence
 * - User Persona Development
 * - Content & SEO Strategy
 * - Growth Metrics Analysis
 */

import {
  Skill,
  Capability,
  ExecutionContext,
  SkillResult,
  CapabilityResult,
  BusinessContext,
  GrowthPlaybook,
  ViralLoop,
  ChannelAnalysis,
  CompetitiveAnalysis,
  GrowthStrategy,
  UserPersona,
  GrowthFunnel,
  ContentStrategy,
  GrowthMetrics,
  RecommendedAction,
  AcquisitionChannel,
  ViralLoopType,
  BusinessModel,
} from '../core/types';

import { PlaybookGenerator } from './capabilities/PlaybookGenerator';
import { ViralLoopEngine } from './capabilities/ViralLoopEngine';
import { ChannelAnalyzer } from './capabilities/ChannelAnalyzer';
import { FunnelOptimizer } from './capabilities/FunnelOptimizer';
import { RetentionEngine } from './capabilities/RetentionEngine';
import { CompetitorIntelligence } from './capabilities/CompetitorIntelligence';
import { PersonaBuilder } from './capabilities/PersonaBuilder';
import { GrowthMetricsAnalyzer } from './capabilities/GrowthMetricsAnalyzer';
import { ContentStrategyEngine } from './capabilities/ContentStrategyEngine';
import { GrowthIdeaGenerator } from './capabilities/GrowthIdeaGenerator';

export class GrowthHackerSkill implements Skill {
  id = 'growth-hacker';
  name = 'Growth Hacker';
  description = 'The most intelligent growth hacking system - provides AI-powered growth strategies, viral loop design, acquisition optimization, and comprehensive growth playbooks for startups and SMEs.';
  version = '1.0.0';

  private playbookGenerator: PlaybookGenerator;
  private viralLoopEngine: ViralLoopEngine;
  private channelAnalyzer: ChannelAnalyzer;
  private funnelOptimizer: FunnelOptimizer;
  private retentionEngine: RetentionEngine;
  private competitorIntelligence: CompetitorIntelligence;
  private personaBuilder: PersonaBuilder;
  private metricsAnalyzer: GrowthMetricsAnalyzer;
  private contentEngine: ContentStrategyEngine;
  private ideaGenerator: GrowthIdeaGenerator;

  capabilities: Capability[];

  constructor() {
    this.playbookGenerator = new PlaybookGenerator();
    this.viralLoopEngine = new ViralLoopEngine();
    this.channelAnalyzer = new ChannelAnalyzer();
    this.funnelOptimizer = new FunnelOptimizer();
    this.retentionEngine = new RetentionEngine();
    this.competitorIntelligence = new CompetitorIntelligence();
    this.personaBuilder = new PersonaBuilder();
    this.metricsAnalyzer = new GrowthMetricsAnalyzer();
    this.contentEngine = new ContentStrategyEngine();
    this.ideaGenerator = new GrowthIdeaGenerator();

    this.capabilities = [
      this.createGeneratePlaybookCapability(),
      this.createDesignViralLoopCapability(),
      this.createAnalyzeChannelsCapability(),
      this.createOptimizeFunnelCapability(),
      this.createRetentionStrategyCapability(),
      this.createCompetitorAnalysisCapability(),
      this.createPersonaBuildingCapability(),
      this.createMetricsAnalysisCapability(),
      this.createContentStrategyCapability(),
      this.createGrowthIdeasCapability(),
      this.createFullGrowthAuditCapability(),
    ];
  }

  async execute(context: ExecutionContext): Promise<SkillResult> {
    const insights: string[] = [];
    const nextActions: RecommendedAction[] = [];

    if (!context.businessContext) {
      return {
        success: false,
        data: null,
        insights: ['Business context is required to provide growth recommendations'],
        nextActions: [{
          priority: 'critical',
          action: 'Provide business context including company profile, product details, and current metrics',
          rationale: 'Growth strategies must be tailored to your specific situation',
          expectedImpact: 'Enables personalized growth recommendations',
          effort: 'low',
        }],
        confidence: 0,
      };
    }

    // Perform comprehensive growth analysis
    const audit = await this.performGrowthAudit(context.businessContext);

    return {
      success: true,
      data: audit,
      insights: audit.insights,
      nextActions: audit.recommendations,
      confidence: audit.confidence,
    };
  }

  private async performGrowthAudit(context: BusinessContext): Promise<{
    insights: string[];
    recommendations: RecommendedAction[];
    confidence: number;
    playbooks: GrowthPlaybook[];
    viralOpportunities: ViralLoop[];
    channelAnalysis: ChannelAnalysis[];
    funnelAnalysis: GrowthFunnel;
  }> {
    const playbooks = this.playbookGenerator.generateForContext(context);
    const viralOpportunities = this.viralLoopEngine.identifyOpportunities(context);
    const channelAnalysis = this.channelAnalyzer.analyzeAll(context);
    const funnelAnalysis = this.funnelOptimizer.analyze(context);

    const insights = this.synthesizeInsights(context, playbooks, viralOpportunities, channelAnalysis);
    const recommendations = this.prioritizeRecommendations(context, playbooks, channelAnalysis, funnelAnalysis);

    return {
      insights,
      recommendations,
      confidence: this.calculateConfidence(context),
      playbooks,
      viralOpportunities,
      channelAnalysis,
      funnelAnalysis,
    };
  }

  private synthesizeInsights(
    context: BusinessContext,
    playbooks: GrowthPlaybook[],
    viralOpportunities: ViralLoop[],
    channelAnalysis: ChannelAnalysis[]
  ): string[] {
    const insights: string[] = [];
    const { company, product, currentMetrics } = context;

    // Stage-specific insights
    if (company.stage === 'pre-seed' || company.stage === 'seed') {
      insights.push('Focus on finding product-market fit before scaling acquisition');
      insights.push('Prioritize qualitative feedback over vanity metrics');
    }

    // Viral potential
    if (viralOpportunities.length > 0) {
      const bestViral = viralOpportunities[0];
      insights.push(`High viral potential detected: ${bestViral.type} loop could achieve K-factor of ${bestViral.expectedKFactor}`);
    }

    // Channel opportunities
    const topChannels = channelAnalysis
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3);
    insights.push(`Top acquisition channels for your business: ${topChannels.map(c => c.channel).join(', ')}`);

    // Metrics-based insights
    if (currentMetrics.viralCoefficient && currentMetrics.viralCoefficient < 1) {
      insights.push(`Current viral coefficient (${currentMetrics.viralCoefficient}) is below 1 - focus on improving referral mechanics`);
    }

    if (currentMetrics.day7Retention && currentMetrics.day7Retention < 0.2) {
      insights.push('Week 1 retention is critically low - prioritize activation and onboarding improvements');
    }

    if (currentMetrics.monthlyChurnRate && currentMetrics.monthlyChurnRate > 0.05) {
      insights.push(`Monthly churn rate of ${(currentMetrics.monthlyChurnRate * 100).toFixed(1)}% is high - implement retention playbooks`);
    }

    return insights;
  }

  private prioritizeRecommendations(
    context: BusinessContext,
    playbooks: GrowthPlaybook[],
    channelAnalysis: ChannelAnalysis[],
    funnelAnalysis: GrowthFunnel
  ): RecommendedAction[] {
    const recommendations: RecommendedAction[] = [];

    // Add playbook recommendations
    for (const playbook of playbooks.slice(0, 3)) {
      recommendations.push({
        priority: 'high',
        action: `Implement ${playbook.name} playbook`,
        rationale: `Targets ${playbook.targetStage} stage with ${playbook.expectedOutcomes[0]?.improvement || 'significant'} expected improvement`,
        expectedImpact: playbook.expectedOutcomes[0]?.improvement || 'High',
        effort: playbook.difficulty === 'beginner' ? 'low' : playbook.difficulty === 'intermediate' ? 'medium' : 'high',
      });
    }

    // Add channel recommendations
    const topChannel = channelAnalysis.sort((a, b) => b.priority - a.priority)[0];
    if (topChannel) {
      recommendations.push({
        priority: 'high',
        action: `Double down on ${topChannel.channel} acquisition`,
        rationale: topChannel.recommendations[0] || 'High potential channel identified',
        expectedImpact: `Potential ${topChannel.potential.fitScore}% fit score`,
        effort: topChannel.potential.timeToResults === 'immediate' ? 'low' : 'medium',
      });
    }

    // Add funnel optimization recommendations
    for (const bottleneck of funnelAnalysis.bottlenecks) {
      if (bottleneck.severity === 'critical' || bottleneck.severity === 'high') {
        recommendations.push({
          priority: bottleneck.severity === 'critical' ? 'critical' : 'high',
          action: `Fix ${bottleneck.stage} bottleneck: ${bottleneck.cause}`,
          rationale: bottleneck.impact,
          expectedImpact: bottleneck.solutions[0] || 'Significant conversion improvement',
          effort: 'medium',
        });
      }
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  private calculateConfidence(context: BusinessContext): number {
    let confidence = 0.5; // Base confidence

    // More data = higher confidence
    if (context.currentMetrics.monthlyActiveUsers) confidence += 0.1;
    if (context.currentMetrics.monthlyChurnRate) confidence += 0.1;
    if (context.personas.length > 0) confidence += 0.1;
    if (context.competitors.length > 0) confidence += 0.1;
    if (context.objectives.length > 0) confidence += 0.1;

    return Math.min(confidence, 0.95);
  }

  // ============================================================================
  // CAPABILITY DEFINITIONS
  // ============================================================================

  private createGeneratePlaybookCapability(): Capability {
    return {
      id: 'generate-playbook',
      name: 'Generate Growth Playbook',
      description: 'Creates a comprehensive, step-by-step growth playbook tailored to your business stage and objectives',
      inputSchema: {
        targetStage: {
          type: 'string',
          description: 'The growth stage to focus on: acquisition, activation, retention, revenue, or referral',
          required: true,
          enum: ['acquisition', 'activation', 'retention', 'revenue', 'referral'],
        },
        businessModel: {
          type: 'string',
          description: 'Your business model: saas, marketplace, ecommerce, subscription, freemium, etc.',
          required: true,
        },
        currentChallenge: {
          type: 'string',
          description: 'The primary growth challenge you are facing',
          required: false,
        },
        budget: {
          type: 'string',
          description: 'Available budget level: bootstrap, seed, funded',
          required: false,
          enum: ['bootstrap', 'seed', 'funded'],
        },
      },
      execute: async (input) => this.playbookGenerator.execute(input),
    };
  }

  private createDesignViralLoopCapability(): Capability {
    return {
      id: 'design-viral-loop',
      name: 'Design Viral Loop',
      description: 'Designs viral mechanics and referral systems to achieve organic exponential growth',
      inputSchema: {
        productType: {
          type: 'string',
          description: 'Type of product: b2b, b2c, b2b2c, d2c',
          required: true,
        },
        currentViralCoefficient: {
          type: 'number',
          description: 'Current K-factor if known',
          required: false,
        },
        preferredLoopType: {
          type: 'string',
          description: 'Preferred viral loop type: word-of-mouth, inherent-virality, collaboration, incentivized-referral, etc.',
          required: false,
        },
        constraints: {
          type: 'array',
          description: 'Any constraints or requirements for the viral mechanics',
          required: false,
        },
      },
      execute: async (input) => this.viralLoopEngine.execute(input),
    };
  }

  private createAnalyzeChannelsCapability(): Capability {
    return {
      id: 'analyze-channels',
      name: 'Analyze Acquisition Channels',
      description: 'Analyzes and prioritizes acquisition channels based on your business context and goals',
      inputSchema: {
        industry: {
          type: 'string',
          description: 'Your industry or vertical',
          required: true,
        },
        productType: {
          type: 'string',
          description: 'Type of product: b2b, b2c, b2b2c',
          required: true,
        },
        budget: {
          type: 'number',
          description: 'Monthly marketing budget in USD',
          required: false,
        },
        currentChannels: {
          type: 'array',
          description: 'Channels you are currently using',
          required: false,
        },
        targetCac: {
          type: 'number',
          description: 'Target customer acquisition cost',
          required: false,
        },
      },
      execute: async (input) => this.channelAnalyzer.execute(input),
    };
  }

  private createOptimizeFunnelCapability(): Capability {
    return {
      id: 'optimize-funnel',
      name: 'Optimize Growth Funnel',
      description: 'Identifies bottlenecks and provides optimization strategies for your conversion funnel',
      inputSchema: {
        funnelStages: {
          type: 'array',
          description: 'Your current funnel stages with conversion rates',
          required: true,
        },
        primaryGoal: {
          type: 'string',
          description: 'Primary optimization goal: signups, activation, conversion, retention',
          required: true,
        },
        currentMetrics: {
          type: 'object',
          description: 'Current funnel metrics',
          required: false,
        },
      },
      execute: async (input) => this.funnelOptimizer.execute(input),
    };
  }

  private createRetentionStrategyCapability(): Capability {
    return {
      id: 'retention-strategy',
      name: 'Develop Retention Strategy',
      description: 'Creates comprehensive retention and engagement strategies to reduce churn and increase LTV',
      inputSchema: {
        currentRetention: {
          type: 'object',
          description: 'Current retention metrics (day1, day7, day30, monthly churn)',
          required: false,
        },
        productType: {
          type: 'string',
          description: 'Type of product',
          required: true,
        },
        userSegments: {
          type: 'array',
          description: 'Key user segments to focus on',
          required: false,
        },
        churnReasons: {
          type: 'array',
          description: 'Known reasons for user churn',
          required: false,
        },
      },
      execute: async (input) => this.retentionEngine.execute(input),
    };
  }

  private createCompetitorAnalysisCapability(): Capability {
    return {
      id: 'competitor-analysis',
      name: 'Competitor Intelligence',
      description: 'Analyzes competitors to identify opportunities, threats, and differentiation strategies',
      inputSchema: {
        competitors: {
          type: 'array',
          description: 'List of competitor names or websites',
          required: true,
        },
        analysisDepth: {
          type: 'string',
          description: 'Depth of analysis: quick, standard, deep',
          required: false,
          default: 'standard',
        },
        focusAreas: {
          type: 'array',
          description: 'Areas to focus on: pricing, features, marketing, positioning',
          required: false,
        },
      },
      execute: async (input) => this.competitorIntelligence.execute(input),
    };
  }

  private createPersonaBuildingCapability(): Capability {
    return {
      id: 'build-personas',
      name: 'Build User Personas',
      description: 'Creates detailed, actionable user personas based on your product and market',
      inputSchema: {
        productDescription: {
          type: 'string',
          description: 'Description of your product and its value proposition',
          required: true,
        },
        targetMarket: {
          type: 'string',
          description: 'Your target market description',
          required: true,
        },
        existingUserData: {
          type: 'object',
          description: 'Any existing user research or data',
          required: false,
        },
        numberOfPersonas: {
          type: 'number',
          description: 'Number of personas to generate',
          required: false,
          default: 3,
        },
      },
      execute: async (input) => this.personaBuilder.execute(input),
    };
  }

  private createMetricsAnalysisCapability(): Capability {
    return {
      id: 'analyze-metrics',
      name: 'Analyze Growth Metrics',
      description: 'Analyzes your growth metrics to identify trends, issues, and opportunities',
      inputSchema: {
        metrics: {
          type: 'object',
          description: 'Your current growth metrics',
          required: true,
        },
        benchmarks: {
          type: 'object',
          description: 'Industry benchmarks to compare against',
          required: false,
        },
        timeframe: {
          type: 'string',
          description: 'Timeframe for analysis',
          required: false,
        },
      },
      execute: async (input) => this.metricsAnalyzer.execute(input),
    };
  }

  private createContentStrategyCapability(): Capability {
    return {
      id: 'content-strategy',
      name: 'Content & SEO Strategy',
      description: 'Develops comprehensive content marketing and SEO strategies for organic growth',
      inputSchema: {
        industry: {
          type: 'string',
          description: 'Your industry',
          required: true,
        },
        targetAudience: {
          type: 'string',
          description: 'Your target audience description',
          required: true,
        },
        goals: {
          type: 'array',
          description: 'Content marketing goals',
          required: false,
        },
        existingContent: {
          type: 'array',
          description: 'Existing content assets',
          required: false,
        },
        competitors: {
          type: 'array',
          description: 'Competitor content to analyze',
          required: false,
        },
      },
      execute: async (input) => this.contentEngine.execute(input),
    };
  }

  private createGrowthIdeasCapability(): Capability {
    return {
      id: 'growth-ideas',
      name: 'Generate Growth Ideas',
      description: 'Generates creative, unconventional growth ideas and experiments',
      inputSchema: {
        businessContext: {
          type: 'object',
          description: 'Your business context',
          required: true,
        },
        constraints: {
          type: 'array',
          description: 'Any constraints (budget, time, resources)',
          required: false,
        },
        previousExperiments: {
          type: 'array',
          description: 'Growth experiments you have already tried',
          required: false,
        },
        riskTolerance: {
          type: 'string',
          description: 'Risk tolerance: conservative, moderate, aggressive',
          required: false,
          default: 'moderate',
        },
      },
      execute: async (input) => this.ideaGenerator.execute(input),
    };
  }

  private createFullGrowthAuditCapability(): Capability {
    return {
      id: 'full-growth-audit',
      name: 'Full Growth Audit',
      description: 'Performs a comprehensive growth audit covering all aspects of your business',
      inputSchema: {
        businessContext: {
          type: 'object',
          description: 'Complete business context including company, product, market, and metrics',
          required: true,
        },
      },
      execute: async (input) => {
        const context = input.businessContext as BusinessContext;
        const audit = await this.performGrowthAudit(context);
        return {
          success: true,
          data: audit,
          explanation: `Completed comprehensive growth audit with ${audit.insights.length} insights and ${audit.recommendations.length} recommendations`,
        };
      },
    };
  }
}

export const growthHackerSkill = new GrowthHackerSkill();
