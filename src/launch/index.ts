/**
 * Launch Automation Module
 *
 * Everything needed to launch a vibe-coded app:
 * - Launch checklist generation
 * - Email setup & templates
 * - Ads infrastructure
 * - Analytics configuration
 * - Distribution planning
 * - MCP integrations
 */

export * from './types';
export { LaunchAssistant, launchAssistant } from './LaunchAssistant';
export { MCP_SERVERS, MCPCommandGenerator, mcpCommandGenerator } from './mcp/MCPLaunchIntegrations';
export type { MCPServerConfig, MCPTool, MCPParameter } from './mcp/MCPLaunchIntegrations';
