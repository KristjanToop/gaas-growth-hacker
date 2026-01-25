/**
 * PersonaBuilder - User Persona Development
 *
 * Creates detailed, actionable user personas based on
 * product and market information.
 */

import {
  UserPersona,
  Demographics,
  Psychographics,
  UserBehaviors,
  AcquisitionChannel,
  CapabilityResult,
} from '../../core/types';

export class PersonaBuilder {
  async execute(input: Record<string, unknown>): Promise<CapabilityResult> {
    const productDescription = input.productDescription as string;
    const targetMarket = input.targetMarket as string;
    const existingUserData = input.existingUserData as Record<string, unknown> | undefined;
    const numberOfPersonas = (input.numberOfPersonas as number) || 3;

    const personas = this.buildPersonas(
      productDescription,
      targetMarket,
      existingUserData,
      numberOfPersonas
    );

    const personaStrategy = this.developPersonaStrategy(personas);
    const messagingGuide = this.createMessagingGuide(personas);

    return {
      success: true,
      data: {
        personas,
        personaStrategy,
        messagingGuide,
        prioritization: this.prioritizePersonas(personas),
        interviewGuide: this.createInterviewGuide(personas),
      },
      explanation: `Created ${personas.length} detailed personas with messaging guides and prioritization`,
    };
  }

  private buildPersonas(
    productDescription: string,
    targetMarket: string,
    existingData: Record<string, unknown> | undefined,
    count: number
  ): UserPersona[] {
    const personas: UserPersona[] = [];

    // Primary Persona - The Main Buyer
    personas.push(this.createPrimaryPersona(productDescription, targetMarket));

    // Secondary Persona - The Champion/User
    if (count >= 2) {
      personas.push(this.createChampionPersona(productDescription, targetMarket));
    }

    // Tertiary Persona - The Decision Maker
    if (count >= 3) {
      personas.push(this.createDecisionMakerPersona(productDescription, targetMarket));
    }

    // Additional personas if requested
    if (count >= 4) {
      personas.push(this.createInfluencerPersona(productDescription, targetMarket));
    }

    if (count >= 5) {
      personas.push(this.createEndUserPersona(productDescription, targetMarket));
    }

    return personas;
  }

  private createPrimaryPersona(product: string, market: string): UserPersona {
    return {
      id: 'persona-primary',
      name: 'The Strategic Buyer',
      title: 'Head of Department / Director',
      demographics: {
        ageRange: [32, 48],
        gender: 'all',
        location: ['United States', 'Europe', 'Canada'],
        education: "Bachelor's degree or higher",
        companySize: '50-500 employees',
        industry: 'Technology, Finance, Healthcare',
        role: 'Department Head / Director',
      },
      psychographics: {
        values: [
          'Efficiency and productivity',
          'Data-driven decisions',
          'Team success and development',
          'Innovation balanced with reliability',
        ],
        motivations: [
          'Proving ROI on investments',
          'Making their team more effective',
          'Staying ahead of industry trends',
          'Building reputation as forward-thinking leader',
        ],
        fears: [
          'Making a bad vendor decision',
          'Disrupting current workflows',
          'Wasting budget on ineffective tools',
          'Falling behind competitors',
        ],
        aspirations: [
          'Become known as an innovator',
          'Build high-performing team',
          'Get promoted to VP/C-level',
          'Achieve measurable business impact',
        ],
        personalityTraits: [
          'Analytical',
          'Risk-aware',
          'Team-oriented',
          'Results-focused',
        ],
      },
      behaviors: {
        researchHabits: [
          'Reads industry publications and blogs',
          'Attends 2-3 conferences per year',
          'Active in LinkedIn industry groups',
          'Asks peers for recommendations',
          'Reviews G2/Capterra before purchasing',
        ],
        decisionMakingProcess: 'Thorough evaluation with stakeholder input, typically 2-4 week decision cycle',
        contentPreferences: [
          'Case studies with metrics',
          'ROI calculators',
          'Comparison guides',
          'Expert webinars',
          'Peer testimonials',
        ],
        toolsUsed: [
          'Slack/Teams',
          'CRM (Salesforce/HubSpot)',
          'Project management tools',
          'Analytics platforms',
        ],
        communities: [
          'LinkedIn groups',
          'Industry Slack communities',
          'Professional associations',
        ],
        influencersFollowed: [
          'Industry thought leaders',
          'VC partners in their space',
          'Successful peers',
        ],
      },
      painPoints: [
        'Current solutions are too complex or outdated',
        'Difficulty measuring ROI of existing tools',
        'Team adoption challenges with new software',
        'Integration issues with existing stack',
        'Limited time to evaluate and implement new solutions',
      ],
      goals: [
        'Improve team productivity by 20%+',
        'Reduce operational costs',
        'Better visibility into team performance',
        'Streamline workflows across departments',
      ],
      objections: [
        'How do I know this will work for our specific needs?',
        'What is the implementation time and effort?',
        'How does this integrate with our existing tools?',
        'What happens if it does not work out?',
        'Can I justify this cost to leadership?',
      ],
      preferredChannels: ['content-marketing', 'organic-search', 'referral', 'events'],
      buyingCriteria: [
        'Proven ROI and case studies',
        'Easy implementation',
        'Strong customer support',
        'Integration capabilities',
        'Security and compliance',
      ],
      influencers: [
        'Industry analysts',
        'Peer recommendations',
        'Team feedback',
        'Online reviews',
      ],
      valueProposition: 'Empower your team to achieve measurable results with a solution that integrates seamlessly into your workflow',
    };
  }

  private createChampionPersona(product: string, market: string): UserPersona {
    return {
      id: 'persona-champion',
      name: 'The Internal Champion',
      title: 'Senior Individual Contributor / Team Lead',
      demographics: {
        ageRange: [26, 38],
        gender: 'all',
        location: ['United States', 'Europe', 'Remote'],
        education: "Bachelor's degree",
        companySize: '50-500 employees',
        role: 'Senior IC / Team Lead',
      },
      psychographics: {
        values: [
          'Personal productivity',
          'Work-life balance',
          'Career growth',
          'Cutting-edge tools',
        ],
        motivations: [
          'Being seen as innovative',
          'Making daily work easier',
          'Building influence in organization',
          'Staying current with industry',
        ],
        fears: [
          'Being stuck with bad tools',
          'Wasting time on inefficient processes',
          'Missing career opportunities',
          'Being seen as outdated',
        ],
        aspirations: [
          'Get promoted to management',
          'Become known as the go-to expert',
          'Build skills for future opportunities',
          'Make meaningful impact',
        ],
        personalityTraits: [
          'Early adopter',
          'Self-motivated',
          'Collaborative',
          'Detail-oriented',
        ],
      },
      behaviors: {
        researchHabits: [
          'Active on Twitter/X',
          'Reads Product Hunt daily',
          'Subscribes to industry newsletters',
          'Tries new tools frequently',
          'Participates in beta programs',
        ],
        decisionMakingProcess: 'Quick to try, recommends to manager if valuable, 1-2 week evaluation',
        contentPreferences: [
          'Quick tutorials and guides',
          'Video walkthroughs',
          'Community discussions',
          'Templates and examples',
          'Feature comparisons',
        ],
        toolsUsed: [
          'Many productivity apps',
          'Developer tools',
          'Communication tools',
          'Learning platforms',
        ],
        communities: [
          'Reddit communities',
          'Discord servers',
          'Twitter/X tech community',
          'Stack Overflow',
        ],
        influencersFollowed: [
          'Tech influencers on Twitter',
          'YouTube reviewers',
          'Newsletter authors',
        ],
      },
      painPoints: [
        'Daily friction in current workflows',
        'Lack of modern tools',
        'Difficulty getting buy-in for new solutions',
        'Time wasted on manual tasks',
        'Poor integration between tools',
      ],
      goals: [
        'Optimize personal productivity',
        'Reduce time on tedious tasks',
        'Learn and grow skills',
        'Make impact on team efficiency',
      ],
      objections: [
        'Can I get started without manager approval?',
        'How steep is the learning curve?',
        'Will my team actually adopt this?',
        'Is there a free tier to try?',
      ],
      preferredChannels: ['social-organic', 'community', 'product-led', 'content-marketing'],
      buyingCriteria: [
        'Ease of use',
        'Free trial or tier',
        'Modern UI/UX',
        'Quick time to value',
        'Community and resources',
      ],
      influencers: [
        'Tech Twitter',
        'Product Hunt community',
        'Peer recommendations',
        'YouTube reviews',
      ],
      valueProposition: 'Upgrade your workflow with a modern tool that just works - start for free and see results immediately',
    };
  }

  private createDecisionMakerPersona(product: string, market: string): UserPersona {
    return {
      id: 'persona-decision-maker',
      name: 'The Executive Decision Maker',
      title: 'VP / C-Level Executive',
      demographics: {
        ageRange: [40, 58],
        gender: 'all',
        location: ['United States', 'Europe'],
        education: 'MBA or advanced degree',
        companySize: '200+ employees',
        role: 'VP / CXO',
      },
      psychographics: {
        values: [
          'Strategic impact',
          'Risk management',
          'Shareholder value',
          'Organizational efficiency',
        ],
        motivations: [
          'Driving business results',
          'Managing costs effectively',
          'Enabling team success',
          'Maintaining competitive advantage',
        ],
        fears: [
          'Security breaches',
          'Budget overruns',
          'Failed implementations',
          'Competitive disruption',
        ],
        aspirations: [
          'Lead successful digital transformation',
          'Build efficient organization',
          'Achieve board-level recognition',
          'Create lasting business impact',
        ],
        personalityTraits: [
          'Strategic thinker',
          'Risk-conscious',
          'Results-driven',
          'Delegation-focused',
        ],
      },
      behaviors: {
        researchHabits: [
          'Reads executive briefings',
          'Relies on analyst reports',
          'Trusts peer recommendations',
          'Attends executive events',
        ],
        decisionMakingProcess: 'Delegates evaluation to team, approves based on business case, 4-8 week cycle',
        contentPreferences: [
          'Executive summaries',
          'ROI analyses',
          'Analyst reports',
          'Board-ready materials',
        ],
        toolsUsed: [
          'Executive dashboards',
          'Email',
          'Meeting tools',
        ],
        communities: [
          'Executive networks',
          'Board memberships',
          'Industry associations',
        ],
        influencersFollowed: [
          'Industry CEOs',
          'Board members',
          'Analysts',
        ],
      },
      painPoints: [
        'Lack of visibility into operations',
        'Difficulty measuring tool ROI',
        'Security and compliance concerns',
        'Change management challenges',
      ],
      goals: [
        'Improve operational efficiency',
        'Reduce costs',
        'Enable growth',
        'Manage risk',
      ],
      objections: [
        'What is the total cost of ownership?',
        'How does this align with our strategy?',
        'What are the security implications?',
        'What is the implementation risk?',
      ],
      preferredChannels: ['referral', 'events', 'partnerships', 'pr'],
      buyingCriteria: [
        'Business impact',
        'Security/compliance',
        'Total cost of ownership',
        'Vendor stability',
        'Implementation support',
      ],
      influencers: [
        'Board members',
        'Peer executives',
        'Industry analysts',
        'Trusted advisors',
      ],
      valueProposition: 'Drive measurable business results with an enterprise-grade solution backed by proven ROI',
    };
  }

  private createInfluencerPersona(product: string, market: string): UserPersona {
    return {
      id: 'persona-influencer',
      name: 'The Technical Evaluator',
      title: 'Technical Lead / Architect',
      demographics: {
        ageRange: [28, 42],
        gender: 'all',
        companySize: '50-1000 employees',
        role: 'Technical Lead / Architect / IT',
      },
      psychographics: {
        values: ['Technical excellence', 'Security', 'Scalability', 'Best practices'],
        motivations: ['Building robust systems', 'Avoiding technical debt', 'Career growth'],
        fears: ['Security vulnerabilities', 'Integration nightmares', 'Vendor lock-in'],
        aspirations: ['Architect role', 'Technical leadership', 'Build scalable systems'],
        personalityTraits: ['Detail-oriented', 'Skeptical', 'Thorough', 'Quality-focused'],
      },
      behaviors: {
        researchHabits: ['Reviews documentation', 'Tests APIs', 'Checks security practices'],
        decisionMakingProcess: 'Technical evaluation and recommendation',
        contentPreferences: ['Documentation', 'API references', 'Architecture guides'],
        toolsUsed: ['Development tools', 'Security tools', 'Monitoring systems'],
        communities: ['GitHub', 'Stack Overflow', 'Tech forums'],
        influencersFollowed: ['Tech leads at major companies', 'Open source maintainers'],
      },
      painPoints: [
        'Poor API documentation',
        'Security concerns',
        'Integration complexity',
        'Scalability limitations',
      ],
      goals: [
        'Find technically sound solutions',
        'Minimize integration effort',
        'Ensure security compliance',
      ],
      objections: [
        'How is data security handled?',
        'What is the API like?',
        'How does it scale?',
        'What about vendor lock-in?',
      ],
      preferredChannels: ['content-marketing', 'community', 'organic-search'],
      buyingCriteria: ['Technical quality', 'API/integration', 'Security', 'Documentation'],
      influencers: ['Tech community', 'Open source projects', 'Security researchers'],
      valueProposition: 'Built with security and scalability in mind - robust APIs, comprehensive docs, enterprise-grade infrastructure',
    };
  }

  private createEndUserPersona(product: string, market: string): UserPersona {
    return {
      id: 'persona-end-user',
      name: 'The Daily User',
      title: 'Individual Contributor',
      demographics: {
        ageRange: [22, 35],
        gender: 'all',
        companySize: 'Any',
        role: 'Individual Contributor',
      },
      psychographics: {
        values: ['Ease of use', 'Getting work done', 'Work-life balance'],
        motivations: ['Do job efficiently', 'Reduce frustration', 'Learn new skills'],
        fears: ['Complicated tools', 'Time wasted on training', 'Looking incompetent'],
        aspirations: ['Be productive', 'Get recognized for work', 'Advance career'],
        personalityTraits: ['Practical', 'Impatient with complexity', 'Task-focused'],
      },
      behaviors: {
        researchHabits: ['Asks colleagues', 'Quick Google searches', 'YouTube tutorials'],
        decisionMakingProcess: 'Uses what is provided or recommended',
        contentPreferences: ['Quick tutorials', 'FAQs', 'Video guides'],
        toolsUsed: ['Whatever team uses'],
        communities: ['Team Slack channels'],
        influencersFollowed: ['Colleagues'],
      },
      painPoints: [
        'Confusing interfaces',
        'Too many tools to learn',
        'Interruptions to workflow',
      ],
      goals: [
        'Get work done quickly',
        'Minimize learning curve',
        'Avoid frustration',
      ],
      objections: [
        'Is this easy to use?',
        'How long until I am productive?',
        'Do I have to change how I work?',
      ],
      preferredChannels: ['product-led', 'referral'],
      buyingCriteria: ['Ease of use', 'Quick onboarding', 'Intuitive interface'],
      influencers: ['Colleagues', 'Manager recommendations'],
      valueProposition: 'Intuitive design that lets you get to work immediately - no training required',
    };
  }

  private developPersonaStrategy(personas: UserPersona[]): {
    personaId: string;
    role: string;
    strategy: string;
    keyTouchpoints: string[];
  }[] {
    return personas.map(persona => ({
      personaId: persona.id,
      role: persona.name,
      strategy: this.getPersonaStrategy(persona),
      keyTouchpoints: this.getKeyTouchpoints(persona),
    }));
  }

  private getPersonaStrategy(persona: UserPersona): string {
    if (persona.id === 'persona-primary') {
      return 'Target with ROI-focused content and case studies. Nurture through content marketing and events.';
    }
    if (persona.id === 'persona-champion') {
      return 'Enable self-service discovery and trial. Empower with resources to sell internally.';
    }
    if (persona.id === 'persona-decision-maker') {
      return 'Reach through trusted channels. Provide executive-level materials and references.';
    }
    return 'Support with relevant content and easy adoption path.';
  }

  private getKeyTouchpoints(persona: UserPersona): string[] {
    return [
      ...persona.preferredChannels.slice(0, 3).map(c => `Acquire via ${c}`),
      `Content: ${persona.behaviors.contentPreferences[0]}`,
      `Community: ${persona.behaviors.communities[0] || 'Industry forums'}`,
    ];
  }

  private createMessagingGuide(personas: UserPersona[]): {
    personaId: string;
    headline: string;
    subheadline: string;
    keyMessages: string[];
    proofPoints: string[];
    callToAction: string;
  }[] {
    return personas.map(persona => ({
      personaId: persona.id,
      headline: this.generateHeadline(persona),
      subheadline: persona.valueProposition,
      keyMessages: this.generateKeyMessages(persona),
      proofPoints: this.generateProofPoints(persona),
      callToAction: this.generateCTA(persona),
    }));
  }

  private generateHeadline(persona: UserPersona): string {
    if (persona.id === 'persona-primary') {
      return 'Drive Measurable Results for Your Team';
    }
    if (persona.id === 'persona-champion') {
      return 'Work Smarter, Not Harder';
    }
    if (persona.id === 'persona-decision-maker') {
      return 'Enterprise-Grade Solution, Proven ROI';
    }
    return 'Simple, Powerful, Effective';
  }

  private generateKeyMessages(persona: UserPersona): string[] {
    const baseMessages = [
      `Solves: ${persona.painPoints[0]}`,
      `Enables: ${persona.goals[0]}`,
      `Proof: ${persona.buyingCriteria[0]}`,
    ];
    return baseMessages;
  }

  private generateProofPoints(persona: UserPersona): string[] {
    return [
      'Customer testimonial from similar role',
      'Metric improvement case study',
      'Industry analyst validation',
    ];
  }

  private generateCTA(persona: UserPersona): string {
    if (persona.preferredChannels.includes('product-led')) {
      return 'Start Free Trial';
    }
    if (persona.id === 'persona-decision-maker') {
      return 'Request Executive Briefing';
    }
    return 'See How It Works';
  }

  private prioritizePersonas(personas: UserPersona[]): {
    tier: string;
    personas: string[];
    rationale: string;
  }[] {
    return [
      {
        tier: 'Primary Focus',
        personas: [personas[0]?.name || 'Strategic Buyer'],
        rationale: 'Key decision-maker with budget authority and business need',
      },
      {
        tier: 'Enable & Empower',
        personas: [personas[1]?.name || 'Internal Champion'],
        rationale: 'Creates internal momentum and drives adoption',
      },
      {
        tier: 'Influence & Support',
        personas: personas.slice(2).map(p => p.name),
        rationale: 'Important for approval and adoption but not primary targets',
      },
    ];
  }

  private createInterviewGuide(personas: UserPersona[]): {
    persona: string;
    questions: string[];
  }[] {
    return personas.map(persona => ({
      persona: persona.name,
      questions: [
        `Tell me about your role and daily responsibilities.`,
        `What are the biggest challenges you face in [relevant area]?`,
        `How do you currently solve [key problem]?`,
        `What would an ideal solution look like?`,
        `How do you typically discover and evaluate new tools?`,
        `Who else is involved in decisions like this?`,
        `What would make you confident in trying something new?`,
      ],
    }));
  }
}
