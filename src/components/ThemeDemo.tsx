/**
 * Theme system demo showcasing all color variables and components
 */

import React from 'react';
import { ThemeProvider, useTheme } from '../hooks/useTheme';
import { ThemeToggle, ThemeToggleCompact, ThemeIndicator } from './ThemeToggle';
import { Button } from './ui/Button';
import { AnimatedInput } from './ui/AnimatedInput';
import { InteractiveCard } from './ui/InteractiveCard';

const ThemeDemoContent: React.FC = () => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              Theme System Demo
            </h1>
            <ThemeIndicator />
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggleCompact />
            <ThemeToggle />
          </div>
        </div>

        {/* Color Palette */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            Color Palette
          </h2>
          
          {/* Background Colors */}
          <div className="grid md:grid-cols-4 gap-4">
            <ColorSwatch name="bg-primary" />
            <ColorSwatch name="bg-secondary" />
            <ColorSwatch name="bg-tertiary" />
            <ColorSwatch name="bg-elevated" />
          </div>

          {/* Surface Colors */}
          <div className="grid md:grid-cols-4 gap-4">
            <ColorSwatch name="surface-primary" />
            <ColorSwatch name="surface-secondary" />
            <ColorSwatch name="surface-tertiary" />
            <ColorSwatch name="surface-hover" />
          </div>

          {/* Text Colors */}
          <div className="grid md:grid-cols-4 gap-4">
            <ColorSwatch name="text-primary" isText />
            <ColorSwatch name="text-secondary" isText />
            <ColorSwatch name="text-tertiary" isText />
            <ColorSwatch name="text-disabled" isText />
          </div>

          {/* Brand Colors */}
          <div className="grid md:grid-cols-4 gap-4">
            <ColorSwatch name="brand-primary" />
            <ColorSwatch name="brand-primary-hover" />
            <ColorSwatch name="brand-primary-active" />
            <ColorSwatch name="brand-secondary" />
          </div>

          {/* Semantic Colors */}
          <div className="grid md:grid-cols-4 gap-4">
            <ColorSwatch name="success" />
            <ColorSwatch name="warning" />
            <ColorSwatch name="error" />
            <ColorSwatch name="info" />
          </div>
        </section>

        {/* Components */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            Components
          </h2>

          {/* Buttons */}
          <div className="p-6 bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Buttons
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="primary" loading>Loading</Button>
              <Button variant="primary" success>Success</Button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-6 bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Form Fields
            </h3>
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
              <AnimatedInput
                label="Normal Input"
                value=""
                onChange={() => {}}
                placeholder="Enter text..."
              />
              <AnimatedInput
                label="With Error"
                value=""
                onChange={() => {}}
                error="This field is required"
              />
              <AnimatedInput
                label="Success State"
                value="Valid input"
                onChange={() => {}}
                success
              />
              <AnimatedInput
                label="Disabled"
                value=""
                onChange={() => {}}
                disabled
              />
            </div>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <InteractiveCard hoverable>
              <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                Interactive Card
              </h4>
              <p className="text-[var(--text-secondary)] text-sm">
                Hover to see the lift effect
              </p>
            </InteractiveCard>
            <InteractiveCard hoverable pressable>
              <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                Pressable Card
              </h4>
              <p className="text-[var(--text-secondary)] text-sm">
                Click to see press animation
              </p>
            </InteractiveCard>
            <InteractiveCard selected>
              <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                Selected Card
              </h4>
              <p className="text-[var(--text-secondary)] text-sm">
                Shows selection state
              </p>
            </InteractiveCard>
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            Typography
          </h2>
          <div className="p-6 bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl space-y-4">
            <h1 className="text-4xl font-bold text-[var(--text-primary)]">
              Heading 1
            </h1>
            <h2 className="text-3xl font-bold text-[var(--text-primary)]">
              Heading 2
            </h2>
            <h3 className="text-2xl font-semibold text-[var(--text-primary)]">
              Heading 3
            </h3>
            <p className="text-base text-[var(--text-primary)]">
              Body text - Primary color for main content
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              Secondary text - For labels and captions
            </p>
            <p className="text-xs text-[var(--text-tertiary)]">
              Tertiary text - For hints and placeholders
            </p>
          </div>
        </section>

        {/* Shadows */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            Shadows
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-6 bg-[var(--surface-primary)] rounded-xl shadow-[var(--shadow-sm)]">
              <p className="text-[var(--text-secondary)] text-sm">Small</p>
            </div>
            <div className="p-6 bg-[var(--surface-primary)] rounded-xl shadow-[var(--shadow-md)]">
              <p className="text-[var(--text-secondary)] text-sm">Medium</p>
            </div>
            <div className="p-6 bg-[var(--surface-primary)] rounded-xl shadow-[var(--shadow-lg)]">
              <p className="text-[var(--text-secondary)] text-sm">Large</p>
            </div>
            <div className="p-6 bg-[var(--surface-primary)] rounded-xl shadow-[var(--shadow-xl)]">
              <p className="text-[var(--text-secondary)] text-sm">Extra Large</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

const ColorSwatch: React.FC<{ name: string; isText?: boolean }> = ({ name, isText }) => {
  return (
    <div className="p-4 bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-lg">
      <div 
        className={`w-full h-16 rounded mb-2 ${
          isText ? 'flex items-center justify-center' : ''
        }`}
        style={{ 
          backgroundColor: isText ? 'var(--bg-primary)' : `var(--${name})`,
          color: isText ? `var(--${name})` : undefined
        }}
      >
        {isText && <span className="font-semibold">Aa</span>}
      </div>
      <p className="text-xs text-[var(--text-tertiary)] font-mono">
        --{name}
      </p>
    </div>
  );
};

export const ThemeDemo: React.FC = () => {
  return (
    <ThemeProvider>
      <ThemeDemoContent />
    </ThemeProvider>
  );
};
