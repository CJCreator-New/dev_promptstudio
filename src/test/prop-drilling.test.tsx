import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { render } from './test-utils';
import { useUIStore, useAppStore, useDataStore } from '../store';

// Property 23: Prop Drilling Depth Limit
describe('Property 23: Prop Drilling Depth Limit', () => {
  test('Zustand stores eliminate prop drilling by providing direct access to state', () => {
    fc.assert(fc.property(
      fc.record({
        storeType: fc.constantFrom('ui', 'app', 'data'),
        operation: fc.constantFrom('read', 'write')
      }),
      ({ storeType, operation }) => {
        // Test that any component can access store state directly without props
        const TestComponent = () => {
          let stateAccess = false;
          
          try {
            switch (storeType) {
              case 'ui':
                const uiState = useUIStore();
                stateAccess = typeof uiState.isMobileHistoryOpen === 'boolean';
                if (operation === 'write') {
                  uiState.setMobileHistoryOpen(true);
                }
                break;
              case 'app':
                const appState = useAppStore();
                stateAccess = typeof appState.input === 'string';
                if (operation === 'write') {
                  appState.setInput('test');
                }
                break;
              case 'data':
                const dataState = useDataStore();
                stateAccess = Array.isArray(dataState.history);
                break;
            }
          } catch {
            stateAccess = false;
          }
          
          return <div data-testid="component">{stateAccess ? 'success' : 'fail'}</div>;
        };

        const { getByTestId } = render(<TestComponent />);
        const component = getByTestId('component');
        
        // Verify component can access state without prop drilling
        expect(component.textContent).toBe('success');
        
        // Property: No props needed for state access (prop drilling depth = 0)
        return true;
      }
    ));
  });

  test('State updates propagate without intermediate components', () => {
    fc.assert(fc.property(
      fc.string({ minLength: 1, maxLength: 50 }),
      (inputValue) => {
        const ParentComponent = () => {
          return <ChildComponent />;
        };

        const ChildComponent = () => {
          return <GrandchildComponent />;
        };

        const GrandchildComponent = () => {
          const { input, setInput } = useAppStore();
          
          // Simulate state update from deeply nested component
          setInput(inputValue);
          
          return <div data-testid="grandchild">{input}</div>;
        };

        const { getByTestId } = render(<ParentComponent />);
        const grandchild = getByTestId('grandchild');
        
        // Verify state update reached deeply nested component without prop drilling
        expect(grandchild.textContent).toBe(inputValue);
        
        return true;
      }
    ));
  });
});