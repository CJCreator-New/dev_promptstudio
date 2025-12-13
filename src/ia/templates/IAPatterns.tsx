import React, { ReactNode } from 'react';

export const HubAndSpoke: React.FC<{ 
  hub: ReactNode; 
  spokes: ReactNode[];
}> = ({ hub, spokes }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="region" aria-label="Hub and spoke navigation">
    <div className="md:col-span-3" role="main">{hub}</div>
    <nav aria-label="Related sections">
      {spokes.map((spoke, idx) => (
        <div key={idx}>{spoke}</div>
      ))}
    </nav>
  </div>
);

export const Hierarchy: React.FC<{
  levels: Array<{ title: string; items: ReactNode[] }>;
}> = ({ levels }) => (
  <nav className="space-y-8" aria-label="Hierarchical navigation">
    {levels.map((level, idx) => (
      <section key={idx} style={{ paddingLeft: `${idx * 2}rem` }} aria-labelledby={`level-${idx}`}>
        <h3 id={`level-${idx}`} className="font-semibold mb-4">{level.title}</h3>
        <ul className="space-y-2" role="list">{level.items}</ul>
      </section>
    ))}
  </nav>
);

export const Faceted: React.FC<{
  filters: ReactNode;
  results: ReactNode;
}> = ({ filters, results }) => (
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
    <aside className="lg:col-span-1" aria-label="Filters">{filters}</aside>
    <main className="lg:col-span-3" aria-label="Search results">{results}</main>
  </div>
);

export const Sequential: React.FC<{
  steps: Array<{ title: string; content: ReactNode }>;
  currentStep: number;
}> = ({ steps, currentStep }) => (
  <div role="region" aria-label="Step-by-step process">
    <nav aria-label="Progress steps">
      <ol className="flex items-center justify-between mb-8">
        {steps.map((step, idx) => (
          <li key={idx} className="flex items-center">
            <div 
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${idx === currentStep ? 'bg-accent-primary text-white' : 'bg-elevated'}
              `}
              aria-current={idx === currentStep ? 'step' : undefined}
              aria-label={`Step ${idx + 1}: ${step.title}${idx === currentStep ? ' (current)' : idx < currentStep ? ' (completed)' : ''}`}
            >
              {idx + 1}
            </div>
            {idx < steps.length - 1 && <div className="w-12 h-0.5 bg-border" aria-hidden="true" />}
          </li>
        ))}
      </ol>
    </nav>
    <div role="main" aria-live="polite">{steps[currentStep]?.content}</div>
  </div>
);

export const Matrix: React.FC<{
  rows: string[];
  cols: string[];
  cells: Record<string, ReactNode>;
  caption?: string;
}> = ({ rows, cols, cells, caption = 'Data matrix' }) => (
  <div className="overflow-x-auto" role="region" aria-label="Data table" tabIndex={0}>
    <table className="w-full border-collapse">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr>
          <th scope="col" className="border border-border p-2"></th>
          {cols.map(col => (
            <th key={col} scope="col" className="border border-border p-2">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row}>
            <th scope="row" className="border border-border p-2">{row}</th>
            {cols.map(col => (
              <td key={`${row}-${col}`} className="border border-border p-2">
                {cells[`${row}-${col}`]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
