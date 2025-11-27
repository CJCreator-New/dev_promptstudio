import { useMemo } from 'react';
import { DomainType } from '../types';

const DOMAIN_KEYWORDS: Record<string, string[]> = {
  [DomainType.FRONTEND]: ["React Hooks", "Tailwind CSS", "Responsive", "Accessibility", "TypeScript", "Performance"],
  [DomainType.BACKEND]: ["REST API", "GraphQL", "PostgreSQL", "Auth", "Microservices", "Docker"],
  [DomainType.UI_UX]: ["Color Palette", "Typography", "User Flow", "Wireframe", "Figma", "Dark Mode"],
  [DomainType.DEVOPS]: ["Kubernetes", "Terraform", "AWS", "CI/CD", "Monitoring", "Security"],
  [DomainType.MOBILE]: ["React Native", "Expo", "Offline Mode", "Notifications", "Gestures"],
  [DomainType.FULLSTACK]: ["MERN Stack", "Serverless", "Schema", "Integration", "Testing"]
};

const KEYWORD_ASSOCIATIONS: Record<string, { any: string[], [key: string]: string[] }> = {
  "react": { any: ["Hooks", "Components"], [DomainType.FRONTEND]: ["Context API", "Redux Toolkit", "Zustand", "React Router", "Next.js"] },
  "css": { any: ["Styles", "Responsive"], [DomainType.FRONTEND]: ["Tailwind", "Flexbox", "Grid", "CSS Modules"] },
  "api": { any: ["REST", "GraphQL"], [DomainType.FRONTEND]: ["Axios", "TanStack Query"], [DomainType.BACKEND]: ["Express", "NestJS", "Swagger"] },
  "auth": { any: ["Login", "Security"], [DomainType.FRONTEND]: ["Clerk", "Auth0", "JWT Decode"], [DomainType.BACKEND]: ["Passport.js", "OAuth2", "BCrypt", "Session"] },
  "db": { any: ["SQL", "NoSQL"], [DomainType.BACKEND]: ["PostgreSQL", "MongoDB", "Redis", "Prisma"], [DomainType.FULLSTACK]: ["Supabase", "Firebase"] },
  "test": { any: ["Unit Tests", "TDD"], [DomainType.FRONTEND]: ["Jest", "React Testing Library", "Cypress"], [DomainType.BACKEND]: ["Supertest", "Mocha"] },
};

const UNIVERSAL_KEYWORDS = ["Clean Code", "Documentation", "Best Practices", "Scalable", "Modular"];

/**
 * Hook for generating contextual prompt suggestions
 */
export const usePromptSuggestions = (input: string, domain: DomainType, isBooting: boolean = false) => {
  return useMemo(() => {
    if (isBooting) return [];

    const lowerInput = input.toLowerCase();
    const domainKeywords = DOMAIN_KEYWORDS[domain] || [];
    
    const contextualMatches: string[] = [];
    Object.keys(KEYWORD_ASSOCIATIONS).forEach(trigger => {
      if (lowerInput.includes(trigger)) {
        const association = KEYWORD_ASSOCIATIONS[trigger];
        if (association[domain]) {
          contextualMatches.push(...association[domain]);
        }
        contextualMatches.push(...association.any);
      }
    });

    const allCandidates = [...contextualMatches, ...domainKeywords, ...UNIVERSAL_KEYWORDS];
    const uniqueSet = new Set<string>();
    const finalSuggestions: string[] = [];
    
    for (const item of allCandidates) {
      if (finalSuggestions.length >= 10) break;
      if (lowerInput.includes(item.toLowerCase())) continue;
      if (uniqueSet.has(item)) continue;
      uniqueSet.add(item);
      finalSuggestions.push(item);
    }

    return finalSuggestions;
  }, [input, domain, isBooting]);
};