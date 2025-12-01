/**
 * Filename: testParser.ts
 * Purpose: Parse CSV/JSON files into structured test suite format
 * 
 * Key Functions:
 * - parseTestFile: Main parser that detects format and delegates
 * - parseCSV: Parse CSV format
 * - parseJSON: Parse JSON format
 * - validateTestData: Validate parsed data against schema
 * 
 * Dependencies: None (vanilla JS)
 */

export interface ParsedTestCase {
  prompt: string;
  expectedOutput: string;
  metadata?: Record<string, unknown>;
}

export interface ParseResult {
  success: boolean;
  data?: ParsedTestCase[];
  error?: string;
}

const CSV_HEADERS = ['prompt', 'expected_output', 'expectedOutput'];

export const parseTestFile = async (file: File): Promise<ParseResult> => {
  try {
    const text = await file.text();
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'json') {
      return parseJSON(text);
    } else if (extension === 'csv') {
      return parseCSV(text);
    } else {
      return { success: false, error: 'Unsupported file format. Use CSV or JSON.' };
    }
  } catch (error) {
    return { success: false, error: `Failed to read file: ${(error as Error).message}` };
  }
};

const parseJSON = (text: string): ParseResult => {
  try {
    const data = JSON.parse(text);
    
    if (!Array.isArray(data)) {
      return { success: false, error: 'JSON must be an array of test cases' };
    }

    const testCases: ParsedTestCase[] = data.map((item, idx) => {
      if (!item.prompt && !item.input) {
        throw new Error(`Missing 'prompt' or 'input' field at index ${idx}`);
      }
      if (!item.expectedOutput && !item.expected_output && !item.expected) {
        throw new Error(`Missing 'expectedOutput' field at index ${idx}`);
      }

      return {
        prompt: item.prompt || item.input,
        expectedOutput: item.expectedOutput || item.expected_output || item.expected,
        metadata: item.metadata
      };
    });

    return validateTestData(testCases);
  } catch (error) {
    return { success: false, error: `JSON parse error: ${(error as Error).message}` };
  }
};

const parseCSV = (text: string): ParseResult => {
  try {
    const lines = text.trim().split('\n');
    if (lines.length < 2) {
      return { success: false, error: 'CSV must have at least a header row and one data row' };
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const promptIdx = headers.findIndex(h => h === 'prompt' || h === 'input');
    const expectedIdx = headers.findIndex(h => 
      h === 'expected_output' || h === 'expectedoutput' || h === 'expected'
    );

    if (promptIdx === -1) {
      return { success: false, error: 'CSV must have a "prompt" or "input" column' };
    }
    if (expectedIdx === -1) {
      return { success: false, error: 'CSV must have an "expected_output" or "expected" column' };
    }

    const testCases: ParsedTestCase[] = lines.slice(1).map((line, idx) => {
      const values = parseCSVLine(line);
      
      if (!values[promptIdx] || !values[expectedIdx]) {
        throw new Error(`Missing required fields at row ${idx + 2}`);
      }

      return {
        prompt: values[promptIdx].trim(),
        expectedOutput: values[expectedIdx].trim()
      };
    });

    return validateTestData(testCases);
  } catch (error) {
    return { success: false, error: `CSV parse error: ${(error as Error).message}` };
  }
};

const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
};

const validateTestData = (testCases: ParsedTestCase[]): ParseResult => {
  if (testCases.length === 0) {
    return { success: false, error: 'No valid test cases found' };
  }

  if (testCases.length > 1000) {
    return { success: false, error: 'Maximum 1000 test cases allowed per suite' };
  }

  for (const tc of testCases) {
    if (tc.prompt.length > 10000) {
      return { success: false, error: 'Prompt exceeds maximum length of 10,000 characters' };
    }
    if (tc.expectedOutput.length > 10000) {
      return { success: false, error: 'Expected output exceeds maximum length of 10,000 characters' };
    }
  }

  return { success: true, data: testCases };
};
