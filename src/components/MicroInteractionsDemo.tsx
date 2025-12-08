/**
 * Comprehensive demo of all micro-interactions
 * Use this as a reference for implementing animations throughout the app
 */

import React, { useState } from 'react';
import { Button } from './ui/Button';
import { AnimatedInput, AnimatedTextarea } from './ui/AnimatedInput';
import { ProgressBar, Spinner, DotsLoader } from './ui/ProgressIndicator';
import { Skeleton, SkeletonCard, SkeletonList } from './ui/SkeletonLoader';
import { InteractiveCard, InteractiveListItem } from './ui/InteractiveCard';
import { PageTransition, StaggeredList, ScrollReveal } from './ui/PageTransition';
import { useToast, ToastProvider } from '../hooks/useToast';
import { Play, Save, Trash2 } from 'lucide-react';

const DemoContent: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const { showToast } = useToast();

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      showToast('success', 'Form submitted successfully!');
      setTimeout(() => setSuccess(false), 2000);
    }, 2000);
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          showToast('success', 'Process completed!');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const toggleSkeleton = () => {
    setShowSkeleton(true);
    setTimeout(() => setShowSkeleton(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <PageTransition type="fade">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">
              Micro-Interactions Demo
            </h1>
            <p className="text-slate-400">
              All animations under 400ms for optimal performance
            </p>
          </div>

          {/* Button States */}
          <ScrollReveal>
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Button States</h2>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="primary" loading>Loading</Button>
                <Button variant="primary" success>Success</Button>
                <Button variant="primary" disabled>Disabled</Button>
                <Button variant="primary" icon={<Save className="w-4 h-4" />}>
                  With Icon
                </Button>
              </div>
            </section>
          </ScrollReveal>

          {/* Form Interactions */}
          <ScrollReveal>
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Form Interactions</h2>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
                <AnimatedInput
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@example.com"
                  helperText="We'll never share your email"
                  success={success}
                />
                <AnimatedInput
                  label="With Error"
                  value=""
                  onChange={() => {}}
                  error="This field is required"
                />
                <div className="md:col-span-2">
                  <AnimatedTextarea
                    label="Message"
                    value=""
                    onChange={() => {}}
                    placeholder="Enter your message..."
                    showCount
                    maxLength={200}
                    rows={4}
                  />
                </div>
                <Button
                  variant="primary"
                  loading={loading}
                  success={success}
                  onClick={handleSubmit}
                >
                  Submit Form
                </Button>
              </div>
            </section>
          </ScrollReveal>

          {/* Progress Indicators */}
          <ScrollReveal>
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Progress Indicators</h2>
              <div className="space-y-6 max-w-2xl">
                <div>
                  <p className="text-sm text-slate-400 mb-2">Determinate Progress</p>
                  <ProgressBar value={progress} showLabel />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={simulateProgress}
                    className="mt-2"
                    icon={<Play className="w-3 h-3" />}
                  >
                    Start Progress
                  </Button>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-2">Indeterminate Progress</p>
                  <ProgressBar indeterminate />
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-sm text-slate-400 mb-2">Spinner</p>
                    <Spinner size="md" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-2">Dots Loader</p>
                    <DotsLoader size="md" />
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* Skeleton Screens */}
          <ScrollReveal>
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Skeleton Loading</h2>
              <Button
                variant="secondary"
                size="sm"
                onClick={toggleSkeleton}
              >
                Toggle Skeleton (3s)
              </Button>
              <div className="grid md:grid-cols-2 gap-6">
                {showSkeleton ? (
                  <>
                    <SkeletonCard />
                    <SkeletonList count={3} />
                  </>
                ) : (
                  <>
                    <InteractiveCard>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Loaded Content
                      </h3>
                      <p className="text-slate-400 text-sm">
                        This content appears after loading completes
                      </p>
                    </InteractiveCard>
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <InteractiveListItem key={i}>
                          <span className="text-slate-300">List Item {i}</span>
                        </InteractiveListItem>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </section>
          </ScrollReveal>

          {/* Interactive Cards */}
          <ScrollReveal>
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Interactive Cards</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <InteractiveCard
                    key={i}
                    hoverable
                    pressable
                    selected={selectedCard === i}
                    onClick={() => setSelectedCard(i)}
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Card {i}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Click to select. Hover for lift effect.
                    </p>
                  </InteractiveCard>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* Interactive List */}
          <ScrollReveal>
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Interactive List</h2>
              <div className="max-w-2xl">
                <StaggeredList staggerDelay={50}>
                  {['Design System', 'Component Library', 'Animation Guide', 'Best Practices'].map((item, i) => (
                    <InteractiveListItem
                      key={i}
                      active={i === 0}
                      onClick={() => showToast('info', `Clicked: ${item}`)}
                      onDelete={() => showToast('error', `Deleted: ${item}`)}
                    >
                      <span className="text-slate-300">{item}</span>
                    </InteractiveListItem>
                  ))}
                </StaggeredList>
              </div>
            </section>
          </ScrollReveal>

          {/* Toast Notifications */}
          <ScrollReveal>
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Toast Notifications</h2>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => showToast('success', 'Operation completed successfully!')}
                >
                  Success Toast
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => showToast('error', 'An error occurred. Please try again.')}
                >
                  Error Toast
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => showToast('warning', 'Warning: Storage almost full')}
                >
                  Warning Toast
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => showToast('info', 'New update available')}
                >
                  Info Toast
                </Button>
              </div>
            </section>
          </ScrollReveal>

        </div>
      </PageTransition>
    </div>
  );
};

export const MicroInteractionsDemo: React.FC = () => {
  return (
    <ToastProvider>
      <DemoContent />
    </ToastProvider>
  );
};
