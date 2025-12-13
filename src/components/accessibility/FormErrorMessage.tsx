import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormErrorMessageProps {
  id: string;
  error?: string;
}

export const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ id, error }) => {
  if (!error) return null;

  return (
    <div id={id} role="alert" aria-live="assertive" className="flex items-center gap-2 mt-1 text-sm text-red-400">
      <AlertCircle className="w-4 h-4" aria-hidden="true" />
      <span>{error}</span>
    </div>
  );
};
