import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { render } from './test-utils';
import { 
  isDomainType, 
  isComplexityLevel, 
  isPlatformType, 
  isGenerationMode,
  isString,
  isNumber,
  isBoolean,
  isObject
} from '../utils/typeGuards';
import { DomainType, ComplexityLevel, PlatformType, GenerationMode } from '../types';

// Property 10: Component Props Type Safety
describe('Property 10: Component Props Type Safety', () => {
  test('type guards correctly validate domain types', () => {
    fc.assert(fc.property(
      fc.oneof(
        fc.constantFrom(...Object.values(DomainType)),
        fc.string(),
        fc.integer(),
        fc.boolean(),
        fc.constant(null),
        fc.constant(undefined)
      ),
      (value) => {
        const result = isDomainType(value);
        const expected = typeof value === 'string' && Object.values(DomainType).includes(value as DomainType);
        
        expect(result).toBe(expected);
        return true;
      }
    ));
  });

  test('type guards correctly validate complexity levels', () => {
    fc.assert(fc.property(
      fc.oneof(
        fc.constantFrom(...Object.values(ComplexityLevel)),
        fc.string(),
        fc.integer(),
        fc.boolean()
      ),
      (value) => {
        const result = isComplexityLevel(value);
        const expected = typeof value === 'string' && Object.values(ComplexityLevel).includes(value as ComplexityLevel);
        
        expect(result).toBe(expected);
        return true;
      }
    ));
  });

  test('type guards correctly validate platform types', () => {
    fc.assert(fc.property(
      fc.oneof(
        fc.constantFrom(...Object.values(PlatformType)),
        fc.string(),
        fc.integer()
      ),
      (value) => {
        const result = isPlatformType(value);
        const expected = typeof value === 'string' && Object.values(PlatformType).includes(value as PlatformType);
        
        expect(result).toBe(expected);
        return true;
      }
    ));
  });

  test('type guards correctly validate generation modes', () => {
    fc.assert(fc.property(
      fc.oneof(
        fc.constantFrom(...Object.values(GenerationMode)),
        fc.string(),
        fc.integer()
      ),
      (value) => {
        const result = isGenerationMode(value);
        const expected = typeof value === 'string' && Object.values(GenerationMode).includes(value as GenerationMode);
        
(result).toBe(expected);
        return true;
      }
    ));
  });

  test('primitive type guards work correctly', () => {
    fc.assert(fc.property(
      fc.oneof(
        fc.string(),
        fc.integer(),
        fc.boolean(),
        fc.object({}),
        fc.array(fc.anything()),
        fc.constant(null),
        fc.constant(undefined)
      ),
      (value) => {
        const stringResult = isString(value);
        const numberResult = isNumber(value);
        const booleanResult = isBoolean(value);
        const objectResult = isObject(value);
        
        expect(stringResult).toBe(typeof value === 'string');
        expect(numberResult).toBe(typeof value === 'number' && !isNaN(value));
        expect(booleanResult).toBe(typeof value === 'boolean');
        expect(objectResult).toBe(typeof value === 'object' && value !== null && !Array.isArray(value));
        
        return true;
      }
    ));
  });

  test('components handle invalid prop types gracefully', () => {
    interface TestComponentProps {
      domain?: DomainType;
      complexity?: ComplexityLevel;
      platform?: PlatformType;
    }

    const TestComponent: React.FC<TestComponentProps> = ({ domain, complexity, platform }) => {
      const safeDomain = isDomainType(domain) ? domain : DomainType.FRONTEND;
      const safeComplexity = isComplexityLevel(complexity) ? complexity : ComplexityLevel.DETAILED;
      const safePlatform = isPlatformType(platform) ? platform : PlatformType.WEB;
      
      return (
        <div data-testid="component">
          <span data-testid="domain">{safeDomain}</span>
          <span data-testid="complexity">{safeComplexity}</span>
          <span data-testid="platform">{safePlatform}</span>
        </div>
      );
    };

    fc.assert(fc.property(
      fc.record({
        domain: fc.oneof(fc.constantFrom(...Object.values(DomainType)), fc.string(), fc.constant(undefined)),
        complexity: fc.oneof(fc.constantFrom(...Object.values(ComplexityLevel)), fc.string(), fc.constant(undefined)),
        platform: fc.oneof(fc.constantFrom(...Object.values(PlatformType)), fc.string(), fc.constant(undefined))
      }),
      (props) => {
        const { getByTestId } = render(<TestComponent {...props} />);
        
        // Component should always render with valid values
        const domainEl = getByTestId('domain');
        const complexityEl = getByTestId('complexity');
        const platformEl = getByTestId('platform');
        
        expect(Object.values(DomainType)).toContain(domainEl.textContent);
        expect(Object.values(ComplexityLevel)).toContain(complexityEl.textContent);
        expect(Object.values(PlatformType)).toContain(platformEl.textContent);
        
        return true;
      }
    ));
  });
});