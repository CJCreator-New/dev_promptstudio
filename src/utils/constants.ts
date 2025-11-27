import { DomainType } from '../types';

export const EXAMPLE_PROMPTS = [
  {
    label: "React Data Table",
    text: "Build a reusable React data table component using TanStack Table. It needs sorting, server-side pagination, column filtering, and a clean Tailwind CSS design.",
    domain: DomainType.FRONTEND
  },
  {
    label: "Node.js API Auth",
    text: "Design a secure authentication system for a Node.js/Express API. Implement JWTs with refresh tokens, Redis for token blacklisting, and middleware for RBAC.",
    domain: DomainType.BACKEND
  },
  {
    label: "Dashboard Layout",
    text: "Create a responsive dashboard layout structure using CSS Grid and Tailwind. It should have a collapsible sidebar, sticky header, and a widget grid that auto-adjusts for mobile.",
    domain: DomainType.UI_UX
  },
  {
    label: "Mobile Chat UI",
    text: "Design a modern chat interface for a mobile app. Include message bubbles, typing indicators, image previews, and ensure it handles the virtual keyboard gracefully.",
    domain: DomainType.MOBILE
  },
  {
    label: "SQL Query Optimization",
    text: "I have a slow SQL query joining 5 tables with millions of rows. Help me analyze the execution plan and rewrite it for performance using indexes and CTEs.",
    domain: DomainType.BACKEND
  }
];