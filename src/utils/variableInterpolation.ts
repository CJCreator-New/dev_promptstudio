export const extractVariables = (template: string): string[] => {
  const matches = template.match(/\{\{([^}]+)\}\}/g);
  return matches ? matches.map(m => m.replace(/\{\{|\}\}/g, '').trim()) : [];
};

export const interpolateVariables = (template: string, values: Record<string, string>): string => {
  return template.replace(/\{\{([^}]+)\}\}/g, (_, key) => values[key.trim()] || `{{${key.trim()}}}`);
};
