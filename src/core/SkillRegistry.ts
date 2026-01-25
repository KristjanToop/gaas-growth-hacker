/**
 * Skill Registry - Central management for all GaaSAI skills
 */

import { Skill, ExecutionContext, SkillResult } from './types';

export class SkillRegistry {
  private static instance: SkillRegistry;
  private skills: Map<string, Skill> = new Map();

  private constructor() {}

  static getInstance(): SkillRegistry {
    if (!SkillRegistry.instance) {
      SkillRegistry.instance = new SkillRegistry();
    }
    return SkillRegistry.instance;
  }

  register(skill: Skill): void {
    if (this.skills.has(skill.id)) {
      console.warn(`Skill ${skill.id} already registered. Overwriting.`);
    }
    this.skills.set(skill.id, skill);
    console.log(`✓ Registered skill: ${skill.name} (${skill.id})`);
  }

  unregister(skillId: string): boolean {
    return this.skills.delete(skillId);
  }

  get(skillId: string): Skill | undefined {
    return this.skills.get(skillId);
  }

  getAll(): Skill[] {
    return Array.from(this.skills.values());
  }

  has(skillId: string): boolean {
    return this.skills.has(skillId);
  }

  async execute(skillId: string, context: ExecutionContext): Promise<SkillResult> {
    const skill = this.skills.get(skillId);
    if (!skill) {
      return {
        success: false,
        data: null,
        insights: [],
        nextActions: [],
        confidence: 0,
      };
    }
    return skill.execute(context);
  }

  listCapabilities(): { skillId: string; skillName: string; capabilities: string[] }[] {
    return Array.from(this.skills.values()).map(skill => ({
      skillId: skill.id,
      skillName: skill.name,
      capabilities: skill.capabilities.map(c => c.name),
    }));
  }

  describeSkill(skillId: string): string | null {
    const skill = this.skills.get(skillId);
    if (!skill) return null;

    let description = `# ${skill.name}\n`;
    description += `${skill.description}\n\n`;
    description += `Version: ${skill.version}\n\n`;
    description += `## Capabilities:\n`;

    for (const cap of skill.capabilities) {
      description += `\n### ${cap.name}\n`;
      description += `${cap.description}\n`;
      description += `\nParameters:\n`;
      for (const [key, param] of Object.entries(cap.inputSchema)) {
        description += `- ${key} (${param.type}${param.required ? ', required' : ''}): ${param.description}\n`;
      }
    }

    return description;
  }
}

export const skillRegistry = SkillRegistry.getInstance();
