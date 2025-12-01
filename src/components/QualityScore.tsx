/**
 * Filename: QualityScore.tsx
 * Purpose: Real-time prompt quality analysis UI with scores and suggestions
 * 
 * Key Components:
 * - Quality score gauge with grade
 * - Individual metric breakdown
 * - Issue list with suggestions
 * - Token count and cost estimate
 * 
 * Dependencies: qualityAnalyzer, lucide-react
 */

import React, { useMemo } from 'react';
import { AlertCircle, CheckCircle, Info, Zap, DollarSign, Hash } from 'lucide-react';
import { analyzePrompt, QualityAnalysis, QualityIssue } from '../services/qualityAnalyzer';

interface QualityScoreProps {
  prompt: string;
  showDetails?: boolean;
}

export const QualityScore: React.FC<QualityScoreProps> = ({ prompt, showDetails = true }) => {
  const analysis = useMemo(() => {
    if (!prompt || prompt.trim().length < 10) return null;
    return analyzePrompt(prompt);
  }, [prompt]);

  if (!analysis) {
    return (
      <div className="bg-slate-800 rounded-lg p-4 text-center text-slate-400">
        Enter a prompt to see quality analysis
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overall Score */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-100">Quality Score</h3>
          <GradeBadge grade={analysis.grade} score={analysis.scores.overall} />
        </div>
        
        <ScoreGauge score={analysis.scores.overall} />
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <MetricCard label="Clarity" score={analysis.scores.clarity} />
          <MetricCard label="Specificity" score={analysis.scores.specificity} />
          <MetricCard label="Structure" score={analysis.scores.structure} />
          <MetricCard label="Complete" score={analysis.scores.completeness} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={<Hash className="w-4 h-4" />}
          label="Tokens"
          value={analysis.tokenCount.toLocaleString()}
          color="blue"
        />
        <StatCard
          icon={<DollarSign className="w-4 h-4" />}
          label="Est. Cost"
          value={`$${analysis.estimatedCost.toFixed(4)}`}
          color="green"
        />
      </div>

      {showDetails && (
        <>
          {/* Strengths */}
          {analysis.strengths.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-100 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Strengths
              </h4>
              <ul className="space-y-2">
                {analysis.strengths.map((strength, idx) => (
                  <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Issues & Suggestions */}
          {analysis.issues.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-100 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                Suggestions ({analysis.issues.length})
              </h4>
              <div className="space-y-3">
                {analysis.issues.map((issue, idx) => (
                  <IssueCard key={idx} issue={issue} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const GradeBadge: React.FC<{ grade: string; score: number }> = ({ grade, score }) => {
  const colors = {
    A: 'bg-green-900/20 text-green-400 border-green-500',
    B: 'bg-blue-900/20 text-blue-400 border-blue-500',
    C: 'bg-yellow-900/20 text-yellow-400 border-yellow-500',
    D: 'bg-orange-900/20 text-orange-400 border-orange-500',
    F: 'bg-red-900/20 text-red-400 border-red-500'
  };

  return (
    <div className={`px-3 py-1 rounded-lg border ${colors[grade as keyof typeof colors]}`}>
      <span className="text-2xl font-bold">{grade}</span>
      <span className="text-sm ml-2">{score.toFixed(0)}/100</span>
    </div>
  );
};

const ScoreGauge: React.FC<{ score: number }> = ({ score }) => {
  const getColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="relative w-full h-3 bg-slate-700 rounded-full overflow-hidden">
      <div
        className={`h-full ${getColor(score)} transition-all duration-500`}
        style={{ width: `${score}%` }}
      />
    </div>
  );
};

const MetricCard: React.FC<{ label: string; score: number }> = ({ label, score }) => {
  const getColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-slate-700 rounded-lg p-3">
      <div className="text-xs text-slate-400 mb-1">{label}</div>
      <div className={`text-xl font-semibold ${getColor(score)}`}>
        {score.toFixed(0)}
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string }> = 
  ({ icon, label, value, color }) => (
    <div className="bg-slate-800 rounded-lg p-4">
      <div className={`flex items-center gap-2 text-${color}-400 mb-2`}>
        {icon}
        <span className="text-sm text-slate-400">{label}</span>
      </div>
      <div className="text-lg font-semibold text-slate-100">{value}</div>
    </div>
  );

const IssueCard: React.FC<{ issue: QualityIssue }> = ({ issue }) => {
  const config = {
    error: { icon: AlertCircle, color: 'red', bg: 'bg-red-900/20', border: 'border-red-500' },
    warning: { icon: AlertCircle, color: 'yellow', bg: 'bg-yellow-900/20', border: 'border-yellow-500' },
    info: { icon: Info, color: 'blue', bg: 'bg-blue-900/20', border: 'border-blue-500' }
  }[issue.type];

  const Icon = config.icon;

  return (
    <div className={`${config.bg} border ${config.border} rounded-lg p-3`}>
      <div className="flex items-start gap-2">
        <Icon className={`w-4 h-4 text-${config.color}-400 mt-0.5 flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-medium text-${config.color}-400 mb-1`}>
            {issue.message}
          </div>
          <div className="text-xs text-slate-300">
            💡 {issue.suggestion}
          </div>
        </div>
      </div>
    </div>
  );
};
