/**
 * ViralLoopEngine - Design and Optimize Viral Growth Mechanics
 *
 * Creates viral loops, referral systems, and network effects
 * to drive exponential organic growth.
 */

import {
  ViralLoop,
  ViralLoopType,
  ViralTrigger,
  Incentive,
  BusinessContext,
  CapabilityResult,
} from '../../core/types';

export class ViralLoopEngine {
  async execute(input: Record<string, unknown>): Promise<CapabilityResult> {
    const productType = input.productType as string;
    const currentViralCoefficient = input.currentViralCoefficient as number | undefined;
    const preferredLoopType = input.preferredLoopType as ViralLoopType | undefined;
    const constraints = input.constraints as string[] | undefined;

    const viralLoops = this.designViralLoops(productType, preferredLoopType, constraints);
    const optimization = this.generateOptimizationPlan(currentViralCoefficient, viralLoops);

    return {
      success: true,
      data: {
        recommendedLoops: viralLoops,
        optimizationPlan: optimization,
        expectedKFactor: this.calculateExpectedKFactor(viralLoops[0]),
        implementationGuide: this.generateImplementationGuide(viralLoops[0]),
      },
      explanation: `Designed ${viralLoops.length} viral loop strategies with expected K-factor of ${this.calculateExpectedKFactor(viralLoops[0]).toFixed(2)}`,
    };
  }

  identifyOpportunities(context: BusinessContext): ViralLoop[] {
    const opportunities: ViralLoop[] = [];
    const { product, company } = context;

    // Analyze product for viral potential
    if (product.type === 'b2c' || product.type === 'b2b2c') {
      opportunities.push(this.createWordOfMouthLoop(product));
      opportunities.push(this.createSocialSharingLoop(product));
    }

    if (product.type === 'b2b') {
      opportunities.push(this.createCollaborationLoop(product));
      opportunities.push(this.createIncentivizedReferralLoop(product));
    }

    // Check for inherent virality potential
    if (this.hasInherentViralityPotential(product)) {
      opportunities.push(this.createInherentViralityLoop(product));
    }

    // Check for network effects potential
    if (this.hasNetworkEffectsPotential(product)) {
      opportunities.push(this.createNetworkEffectsLoop(product));
    }

    // Sort by expected K-factor
    return opportunities.sort((a, b) => b.expectedKFactor - a.expectedKFactor);
  }

  private designViralLoops(
    productType: string,
    preferredType?: ViralLoopType,
    constraints?: string[]
  ): ViralLoop[] {
    const loops: ViralLoop[] = [];

    // Add preferred loop type if specified
    if (preferredType) {
      loops.push(this.createLoopByType(preferredType, productType));
    }

    // Add complementary loops based on product type
    if (productType === 'b2c') {
      if (!preferredType || preferredType !== 'word-of-mouth') {
        loops.push(this.createLoopByType('word-of-mouth', productType));
      }
      if (!preferredType || preferredType !== 'content-sharing') {
        loops.push(this.createLoopByType('content-sharing', productType));
      }
      if (!preferredType || preferredType !== 'incentivized-referral') {
        loops.push(this.createLoopByType('incentivized-referral', productType));
      }
    } else if (productType === 'b2b') {
      if (!preferredType || preferredType !== 'collaboration') {
        loops.push(this.createLoopByType('collaboration', productType));
      }
      if (!preferredType || preferredType !== 'incentivized-referral') {
        loops.push(this.createLoopByType('incentivized-referral', productType));
      }
      if (!preferredType || preferredType !== 'network-effects') {
        loops.push(this.createLoopByType('network-effects', productType));
      }
    }

    // Filter based on constraints
    if (constraints?.includes('no-monetary-incentives')) {
      return loops.filter(l => l.type !== 'incentivized-referral');
    }

    return loops.slice(0, 4);
  }

  private createLoopByType(type: ViralLoopType, productType: string): ViralLoop {
    const loopCreators: Record<ViralLoopType, () => ViralLoop> = {
      'word-of-mouth': () => ({
        id: `viral-wom-${Date.now()}`,
        name: 'Word of Mouth Loop',
        type: 'word-of-mouth',
        mechanism: 'Users naturally tell others about the product due to exceptional experience',
        triggers: [
          { event: 'First value moment', timing: 'Immediate', message: 'Share your achievement', channel: 'In-app' },
          { event: 'Major milestone', timing: 'On achievement', message: 'Celebrate with friends', channel: 'Social media' },
          { event: 'Problem solved', timing: 'After resolution', message: 'Tell others about this', channel: 'Email' },
        ],
        incentives: [
          { type: 'altruistic', forReferrer: 'Help friends discover great product', forReferred: 'Trusted recommendation', conditions: ['None required'] },
        ],
        frictionPoints: ['Requires truly exceptional product', 'Hard to measure and optimize', 'Depends on user motivation'],
        optimizations: [
          'Make sharing dead simple with one-click share buttons',
          'Create shareable moments within the product',
          'Give users talking points and stories to share',
          'Celebrate and highlight user success stories',
        ],
        expectedKFactor: 0.3,
        expectedCycleTime: 14,
      }),

      'inherent-virality': () => ({
        id: `viral-inherent-${Date.now()}`,
        name: 'Inherent Virality Loop',
        type: 'inherent-virality',
        mechanism: 'Product usage naturally exposes non-users to the product',
        triggers: [
          { event: 'Content creation', timing: 'On publish', message: 'Made with [Product]', channel: 'Product output' },
          { event: 'Share action', timing: 'On share', message: 'View in [Product]', channel: 'Shared link' },
          { event: 'Collaboration invite', timing: 'On invite', message: 'Join me on [Product]', channel: 'Email/Notification' },
        ],
        incentives: [
          { type: 'feature', forReferrer: 'Better experience with more users', forReferred: 'Access to shared content', conditions: ['Must view shared content'] },
        ],
        frictionPoints: ['Requires product output to be shareable', 'May feel spammy if overdone', 'Dependent on use case'],
        optimizations: [
          'Make branded watermarks subtle but visible',
          'Ensure shared content looks great without account',
          'Create smooth conversion path from viewer to user',
          'Add value for viewers even without signup',
        ],
        expectedKFactor: 0.5,
        expectedCycleTime: 7,
      }),

      'collaboration': () => ({
        id: `viral-collab-${Date.now()}`,
        name: 'Collaboration Virality Loop',
        type: 'collaboration',
        mechanism: 'Product features require or benefit from inviting team members or collaborators',
        triggers: [
          { event: 'Project creation', timing: 'On create', message: 'Invite your team', channel: 'In-app modal' },
          { event: 'First task', timing: 'After setup', message: 'Assign to team member', channel: 'In-app prompt' },
          { event: 'Sharing need', timing: 'On share attempt', message: 'Invite to collaborate', channel: 'Share flow' },
        ],
        incentives: [
          { type: 'feature', forReferrer: 'Better collaboration, team features unlocked', forReferred: 'Access to shared workspace', conditions: ['Must accept invite'] },
        ],
        frictionPoints: ['Requires collaborative use case', 'May not work for individual users', 'Invite fatigue'],
        optimizations: [
          'Make inviting integral to core workflows',
          'Show value of collaboration clearly',
          'Pre-populate invite lists from integrations',
          'Reduce friction in accepting invites',
          'Create compelling onboarding for invited users',
        ],
        expectedKFactor: 0.7,
        expectedCycleTime: 3,
      }),

      'incentivized-referral': () => ({
        id: `viral-referral-${Date.now()}`,
        name: 'Incentivized Referral Program',
        type: 'incentivized-referral',
        mechanism: 'Users receive rewards for successfully referring new users',
        triggers: [
          { event: 'Post-activation', timing: '24h after activation', message: 'Share and earn rewards', channel: 'Email' },
          { event: 'Success moment', timing: 'On achievement', message: 'Give friends same experience', channel: 'In-app' },
          { event: 'Subscription renewal', timing: 'On renewal', message: 'Earn free months', channel: 'Email' },
        ],
        incentives: [
          { type: 'monetary', forReferrer: '$25 credit or cash', forReferred: '$25 off first purchase', conditions: ['Referred must complete purchase', 'Max 10 referrals per month'] },
          { type: 'feature', forReferrer: 'Free month of premium', forReferred: 'Extended trial', conditions: ['Referred must activate'] },
        ],
        frictionPoints: ['Can attract low-quality users', 'Expensive if not managed', 'Fraud risk', 'May feel transactional'],
        optimizations: [
          'Only reward after referred user activates',
          'Use tiered rewards for power referrers',
          'Make referral tracking transparent',
          'Celebrate successful referrals',
          'Test different incentive structures',
        ],
        expectedKFactor: 0.4,
        expectedCycleTime: 10,
      }),

      'social-proof': () => ({
        id: `viral-social-${Date.now()}`,
        name: 'Social Proof Loop',
        type: 'social-proof',
        mechanism: 'Public usage and achievements create social proof that attracts new users',
        triggers: [
          { event: 'Achievement', timing: 'On achievement', message: 'Share your milestone', channel: 'Social media' },
          { event: 'Review request', timing: 'After value delivery', message: 'Share your experience', channel: 'Review sites' },
          { event: 'Case study', timing: 'After major success', message: 'Tell your story', channel: 'Content' },
        ],
        incentives: [
          { type: 'status', forReferrer: 'Recognition and visibility', forReferred: 'Trusted by peers', conditions: ['Public sharing'] },
        ],
        frictionPoints: ['Requires notable achievements', 'Users may be private', 'Time to accumulate proof'],
        optimizations: [
          'Create shareable achievement graphics',
          'Build public profiles/portfolios',
          'Highlight user success stories',
          'Make testimonials easy to give',
          'Display social proof prominently',
        ],
        expectedKFactor: 0.25,
        expectedCycleTime: 21,
      }),

      'content-sharing': () => ({
        id: `viral-content-${Date.now()}`,
        name: 'Content Sharing Loop',
        type: 'content-sharing',
        mechanism: 'Users create and share content that exposes new audiences to the product',
        triggers: [
          { event: 'Content creation', timing: 'On completion', message: 'Share your creation', channel: 'Social media' },
          { event: 'Export', timing: 'On export', message: 'Include watermark/attribution', channel: 'Exported content' },
          { event: 'Embed', timing: 'On embed', message: 'Powered by [Product]', channel: 'Third-party sites' },
        ],
        incentives: [
          { type: 'feature', forReferrer: 'Distribution for their content', forReferred: 'Tool to create similar content', conditions: ['Content must be shared'] },
        ],
        frictionPoints: ['Requires content creation use case', 'Quality of shared content varies', 'Attribution may be removed'],
        optimizations: [
          'Make sharing native to workflow',
          'Create templates that look great shared',
          'Add subtle branded elements',
          'Track content virality',
          'Feature best user content',
        ],
        expectedKFactor: 0.35,
        expectedCycleTime: 5,
      }),

      'network-effects': () => ({
        id: `viral-network-${Date.now()}`,
        name: 'Network Effects Loop',
        type: 'network-effects',
        mechanism: 'Product becomes more valuable as more users join, creating natural pull for growth',
        triggers: [
          { event: 'User onboarding', timing: 'During setup', message: 'Connect with others', channel: 'In-app' },
          { event: 'Connection suggestion', timing: 'Periodic', message: 'People you may know', channel: 'In-app/Email' },
          { event: 'Network milestone', timing: 'On growth', message: 'Your network is growing', channel: 'Notification' },
        ],
        incentives: [
          { type: 'feature', forReferrer: 'More valuable product with more connections', forReferred: 'Access to valuable network', conditions: ['Join and connect'] },
        ],
        frictionPoints: ['Chicken-and-egg problem early on', 'Requires critical mass', 'May be gamed'],
        optimizations: [
          'Seed initial network strategically',
          'Create value before network effects kick in',
          'Make connecting frictionless',
          'Show network value clearly',
          'Focus on density over breadth',
        ],
        expectedKFactor: 0.6,
        expectedCycleTime: 7,
      }),

      'ugc-viral': () => ({
        id: `viral-ugc-${Date.now()}`,
        name: 'User-Generated Content Loop',
        type: 'ugc-viral',
        mechanism: 'Users create content that attracts other users to the platform',
        triggers: [
          { event: 'Content published', timing: 'On publish', message: 'Promote your content', channel: 'Social media' },
          { event: 'Content engagement', timing: 'On engagement', message: 'Your content is trending', channel: 'Notification' },
          { event: 'Creator milestone', timing: 'On milestone', message: 'Celebrate your growth', channel: 'In-app/Email' },
        ],
        incentives: [
          { type: 'status', forReferrer: 'Audience and recognition', forReferred: 'Access to great content', conditions: ['Create and share content'] },
          { type: 'monetary', forReferrer: 'Revenue share', forReferred: 'Free content access', conditions: ['Content performance'] },
        ],
        frictionPoints: ['Requires content platform', 'Quality control challenges', 'Creator burnout'],
        optimizations: [
          'Make content creation easy',
          'Help creators succeed',
          'Curate and promote best content',
          'Build creator tools and analytics',
          'Create creator community',
        ],
        expectedKFactor: 0.5,
        expectedCycleTime: 14,
      }),

      'embedded-viral': () => ({
        id: `viral-embedded-${Date.now()}`,
        name: 'Embedded Virality Loop',
        type: 'embedded-viral',
        mechanism: 'Product can be embedded in other platforms, exposing new audiences',
        triggers: [
          { event: 'Embed creation', timing: 'On embed', message: 'Add to your site', channel: 'Embed code' },
          { event: 'Embed view', timing: 'On view', message: 'Powered by [Product]', channel: 'Embedded widget' },
          { event: 'Embed interaction', timing: 'On interaction', message: 'Create your own', channel: 'CTA in embed' },
        ],
        incentives: [
          { type: 'feature', forReferrer: 'Free functionality for their site', forReferred: 'Tool to create similar embeds', conditions: ['Embed must be used'] },
        ],
        frictionPoints: ['Requires embeddable use case', 'Low conversion from viewers', 'Technical implementation needed'],
        optimizations: [
          'Make embeds extremely easy to create',
          'Ensure embeds look professional',
          'Add subtle but effective CTAs',
          'Track embed performance',
          'Offer premium embed features',
        ],
        expectedKFactor: 0.4,
        expectedCycleTime: 21,
      }),
    };

    return loopCreators[type]();
  }

  private createWordOfMouthLoop(product: any): ViralLoop {
    return this.createLoopByType('word-of-mouth', product.type);
  }

  private createSocialSharingLoop(product: any): ViralLoop {
    return this.createLoopByType('content-sharing', product.type);
  }

  private createCollaborationLoop(product: any): ViralLoop {
    return this.createLoopByType('collaboration', product.type);
  }

  private createIncentivizedReferralLoop(product: any): ViralLoop {
    return this.createLoopByType('incentivized-referral', product.type);
  }

  private createInherentViralityLoop(product: any): ViralLoop {
    return this.createLoopByType('inherent-virality', product.type);
  }

  private createNetworkEffectsLoop(product: any): ViralLoop {
    return this.createLoopByType('network-effects', product.type);
  }

  private hasInherentViralityPotential(product: any): boolean {
    const viralCategories = ['collaboration', 'communication', 'social', 'content-creation', 'sharing'];
    return viralCategories.some(cat => product.category?.toLowerCase().includes(cat));
  }

  private hasNetworkEffectsPotential(product: any): boolean {
    const networkCategories = ['marketplace', 'social', 'communication', 'platform'];
    return networkCategories.some(cat => product.category?.toLowerCase().includes(cat)) ||
           product.businessModel === 'marketplace';
  }

  private generateOptimizationPlan(currentK: number | undefined, loops: ViralLoop[]): {
    currentState: string;
    targetState: string;
    priorities: { action: string; impact: string; effort: string }[];
  } {
    const priorities: { action: string; impact: string; effort: string }[] = [];

    if (!currentK || currentK < 0.2) {
      priorities.push({
        action: 'Implement basic referral tracking',
        impact: 'Foundation for all viral growth',
        effort: 'Medium',
      });
      priorities.push({
        action: 'Create frictionless sharing mechanics',
        impact: 'Enable organic sharing',
        effort: 'Low',
      });
    }

    if (!currentK || currentK < 0.5) {
      priorities.push({
        action: 'Identify and optimize share triggers',
        impact: 'Increase share rate',
        effort: 'Medium',
      });
      priorities.push({
        action: 'Improve referred user onboarding',
        impact: 'Better conversion of referred users',
        effort: 'Medium',
      });
    }

    if (!currentK || currentK < 1.0) {
      priorities.push({
        action: 'Implement incentivized referral program',
        impact: 'Direct boost to K-factor',
        effort: 'High',
      });
      priorities.push({
        action: 'Reduce viral cycle time',
        impact: 'Faster compounding growth',
        effort: 'Medium',
      });
    }

    // Add loop-specific optimizations
    for (const loop of loops.slice(0, 2)) {
      for (const opt of loop.optimizations.slice(0, 2)) {
        priorities.push({
          action: opt,
          impact: `Optimize ${loop.type} loop`,
          effort: 'Medium',
        });
      }
    }

    return {
      currentState: currentK ? `K-factor: ${currentK}` : 'K-factor: Unknown',
      targetState: 'K-factor: >0.5 (sustainable viral contribution)',
      priorities: priorities.slice(0, 8),
    };
  }

  private calculateExpectedKFactor(loop: ViralLoop): number {
    // Base K-factor from loop design
    let k = loop.expectedKFactor;

    // Adjust based on friction points
    k -= loop.frictionPoints.length * 0.02;

    // Adjust based on optimizations available
    k += Math.min(loop.optimizations.length * 0.01, 0.1);

    return Math.max(0.1, Math.min(1.5, k));
  }

  private generateImplementationGuide(loop: ViralLoop): {
    phase1: { title: string; tasks: string[] };
    phase2: { title: string; tasks: string[] };
    phase3: { title: string; tasks: string[] };
  } {
    return {
      phase1: {
        title: 'Foundation (Week 1-2)',
        tasks: [
          'Set up viral analytics and tracking',
          'Define K-factor measurement methodology',
          'Identify key viral triggers in user journey',
          `Implement basic ${loop.type} mechanics`,
          'Create baseline measurements',
        ],
      },
      phase2: {
        title: 'Optimization (Week 3-4)',
        tasks: [
          'Optimize sharing UI/UX for conversion',
          'Implement personalized referral messaging',
          'Set up A/B testing for viral elements',
          'Reduce friction in referral acceptance flow',
          'Create referred user onboarding path',
        ],
      },
      phase3: {
        title: 'Scale (Week 5+)',
        tasks: [
          'Analyze and double down on top viral channels',
          'Implement advanced incentive structures',
          'Build viral loops into core product experience',
          'Create viral content and assets',
          'Continuously optimize based on data',
        ],
      },
    };
  }
}
