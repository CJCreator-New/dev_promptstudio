import { useState, useEffect } from 'react';
import { promptInputSchema } from '../utils/validation';

/**
 * Hook for input validation
 */
export const useValidation = (input: string, isBooting: boolean = false, readOnly: boolean = false) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (isBooting || readOnly || !input) {
      setValidationError(null);
      return;
    }

    const result = promptInputSchema.safeParse({ input });
    if (!result.success) {
      setValidationError(result.error.errors[0].message);
    } else {
      setValidationError(null);
    }
  }, [input, isBooting, readOnly]);

  return validationError;
};