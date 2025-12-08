/**
 * SVG illustrations for empty states
 */

import React from 'react';

export const WelcomeIllustration: React.FC = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="animate-fade-in">
    <circle cx="60" cy="60" r="50" fill="url(#gradient1)" opacity="0.1" />
    <path d="M40 60L55 75L80 45" stroke="url(#gradient1)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="gradient1" x1="0" y1="0" x2="120" y2="120">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
    </defs>
  </svg>
);

export const SearchIllustration: React.FC = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="animate-fade-in">
    <circle cx="40" cy="40" r="25" stroke="#475569" strokeWidth="3" fill="none" />
    <line x1="58" y1="58" x2="75" y2="75" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
    <circle cx="40" cy="40" r="15" fill="#1E293B" opacity="0.5" />
  </svg>
);

export const ErrorIllustration: React.FC = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="animate-fade-in">
    <circle cx="50" cy="50" r="40" stroke="#EF4444" strokeWidth="3" fill="none" opacity="0.2" />
    <line x1="35" y1="35" x2="65" y2="65" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
    <line x1="65" y1="35" x2="35" y2="65" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const LoadingIllustration: React.FC = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="animate-spin">
    <circle cx="50" cy="50" r="35" stroke="#334155" strokeWidth="3" fill="none" />
    <path d="M50 15 A35 35 0 0 1 85 50" stroke="url(#gradient2)" strokeWidth="3" strokeLinecap="round" fill="none" />
    <defs>
      <linearGradient id="gradient2" x1="50" y1="15" x2="85" y2="50">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
    </defs>
  </svg>
);

export const LockIllustration: React.FC = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="animate-fade-in">
    <rect x="30" y="50" width="40" height="35" rx="4" fill="#1E293B" stroke="#475569" strokeWidth="2" />
    <path d="M35 50V40C35 31.7157 41.7157 25 50 25C58.2843 25 65 31.7157 65 40V50" stroke="#475569" strokeWidth="2" />
    <circle cx="50" cy="67" r="5" fill="#6366F1" />
  </svg>
);

export const FolderIllustration: React.FC = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="animate-fade-in">
    <path d="M20 35L25 30H45L50 35H80V75H20V35Z" fill="#1E293B" stroke="#475569" strokeWidth="2" />
    <rect x="25" y="40" width="50" height="30" fill="#0F172A" opacity="0.5" />
  </svg>
);

export const ChartIllustration: React.FC = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="animate-fade-in">
    <rect x="20" y="60" width="15" height="20" fill="#334155" rx="2" />
    <rect x="42.5" y="45" width="15" height="35" fill="#475569" rx="2" />
    <rect x="65" y="30" width="15" height="50" fill="#6366F1" rx="2" />
    <line x1="15" y1="85" x2="85" y2="85" stroke="#334155" strokeWidth="2" />
  </svg>
);

export const InboxIllustration: React.FC = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="animate-fade-in">
    <path d="M20 35L50 55L80 35V75H20V35Z" fill="#1E293B" stroke="#475569" strokeWidth="2" />
    <path d="M20 35L50 20L80 35" stroke="#475569" strokeWidth="2" fill="none" />
    <circle cx="70" cy="30" r="8" fill="#10B981" />
  </svg>
);
