import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { PROMPT_RECIPES, PromptRecipe } from '../utils/promptRecipes';
import { trackEvent } from '../utils/analytics';

interface RecipeDropdownProps {
  onSelect: (recipe: PromptRecipe) => void;
}

export const RecipeDropdown: React.FC<RecipeDropdownProps> = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (recipe: PromptRecipe) => {
    trackEvent('recipe_loaded', { recipe_id: recipe.id, recipe_label: recipe.label });
    onSelect(recipe);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
      >
        <Sparkles className="w-4 h-4" />
        <span>Start from Recipe</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 max-h-96 overflow-y-auto">
            {PROMPT_RECIPES.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => handleSelect(recipe)}
                className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors border-b border-slate-700 last:border-b-0"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{recipe.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-slate-100 text-sm">{recipe.label}</div>
                    <div className="text-xs text-slate-400 mt-1">{recipe.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
