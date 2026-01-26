/**
 * GaaSAI - Growth Hacker Skill
 *
 * The most intelligent growth hacking system for Claude Code.
 * Provides AI-powered growth strategies, viral loop design,
 * acquisition optimization, and comprehensive growth playbooks.
 */

// Core exports
export * from './core/types';
export { skillRegistry, SkillRegistry } from './core/SkillRegistry';

// Growth Hacker Skill
export { GrowthHackerSkill, growthHackerSkill } from './skills/GrowthHackerSkill';

// Individual Capabilities
export { PlaybookGenerator } from './skills/capabilities/PlaybookGenerator';
export { ViralLoopEngine } from './skills/capabilities/ViralLoopEngine';
export { ChannelAnalyzer } from './skills/capabilities/ChannelAnalyzer';
export { FunnelOptimizer } from './skills/capabilities/FunnelOptimizer';
export { RetentionEngine } from './skills/capabilities/RetentionEngine';
export { CompetitorIntelligence } from './skills/capabilities/CompetitorIntelligence';
export { PersonaBuilder } from './skills/capabilities/PersonaBuilder';
export { GrowthMetricsAnalyzer } from './skills/capabilities/GrowthMetricsAnalyzer';
export { ContentStrategyEngine } from './skills/capabilities/ContentStrategyEngine';
export { GrowthIdeaGenerator } from './skills/capabilities/GrowthIdeaGenerator';

// Launch Automation Module
export * from './launch';
export { LaunchAssistant, launchAssistant } from './launch/LaunchAssistant';
export { MCP_SERVERS, MCPCommandGenerator, mcpCommandGenerator } from './launch/mcp/MCPLaunchIntegrations';

// Register the Growth Hacker Skill
import { skillRegistry } from './core/SkillRegistry';
import { growthHackerSkill } from './skills/GrowthHackerSkill';

skillRegistry.register(growthHackerSkill);

// Default export
export default growthHackerSkill;

/**
 * Quick Start Example:
 *
 * ```typescript
 * import growthHackerSkill, { BusinessContext } from 'gaasai-growth-hacker-skill';
 *
 * const context: BusinessContext = {
 *   company: {
 *     name: 'My Startup',
 *     stage: 'seed',
 *     industry: 'SaaS',
 *     businessModel: 'saas',
 *     teamSize: 5,
 *   },
 *   product: {
 *     name: 'My Product',
 *     type: 'b2b',
 *     category: 'productivity',
 *     pricing: { type: 'freemium', lowestTier: 0, currency: 'USD' },
 *     uniqueValueProposition: 'We help teams work faster',
 *     coreProblemSolved: 'Team collaboration is broken',
 *     keyFeatures: ['Feature 1', 'Feature 2'],
 *   },
 *   market: {
 *     maturity: 'growing',
 *     keyTrends: ['Remote work', 'AI'],
 *     barriers: [],
 *   },
 *   currentMetrics: {
 *     monthlyActiveUsers: 1000,
 *     activationRate: 0.3,
 *     day7Retention: 0.2,
 *     monthlyChurnRate: 0.05,
 *   },
 *   personas: [],
 *   competitors: [],
 *   objectives: [],
 * };
 *
 * // Execute full growth audit
 * const result = await growthHackerSkill.execute({ sessionId: '123', businessContext: context });
 *
 * console.log(result.insights);
 * console.log(result.nextActions);
 * ```
 */
