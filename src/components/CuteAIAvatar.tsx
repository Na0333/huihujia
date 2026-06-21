import React from 'react';

export function CuteAIAvatar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="aiBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d3e4ff" />
          <stop offset="100%" stopColor="#a1c9ff" />
        </linearGradient>
        <filter id="aiShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.1" />
        </filter>
      </defs>
      
      {/* Background Sphere */}
      <circle cx="50" cy="50" r="50" fill="url(#aiBgGrad)" />
      
      {/* Friendly Antenna */}
      <path d="M50 20 L50 35" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="16" r="5" fill="#ffffff" />
      
      {/* Soft Rounded Head */}
      <rect x="18" y="32" width="64" height="48" rx="24" fill="white" filter="url(#aiShadow)" />
      
      {/* Sparkly Eyes */}
      <circle cx="36" cy="52" r="4.5" fill="#003d6d" />
      <circle cx="64" cy="52" r="4.5" fill="#003d6d" />
      <circle cx="37.5" cy="50.5" r="1.5" fill="#ffffff" />
      <circle cx="65.5" cy="50.5" r="1.5" fill="#ffffff" />
      
      {/* Sweet Smile */}
      <path d="M46 60 Q 50 64 54 60" stroke="#003d6d" strokeWidth="3" strokeLinecap="round" fill="none" />
      
      {/* Warm Blush */}
      <ellipse cx="28" cy="55" rx="4" ry="2.5" fill="#ffb68a" opacity="0.9" />
      <ellipse cx="72" cy="55" rx="4" ry="2.5" fill="#ffb68a" opacity="0.9" />
    </svg>
  );
}
