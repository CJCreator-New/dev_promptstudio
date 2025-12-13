import React, { createContext, useContext, ReactNode } from 'react';

interface FeatureFlags {
  cloudSync: boolean;
  abTesting: boolean;
  evaluation: boolean;
  templateGallery: boolean;
  versionHistory: boolean;
}

interface FeatureFlagsContextValue {
  flags: FeatureFlags;
  isEnabled: (feature: keyof FeatureFlags) => boolean;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextValue | undefined>(undefined);

interface FeatureFlagsProviderProps {
  children: ReactNode;
  flags?: Partial<FeatureFlags>;
}

const defaultFlags: FeatureFlags = {
  cloudSync: true,
  abTesting: true,
  evaluation: true,
  templateGallery: true,
  versionHistory: true,
};

export const FeatureFlagsProvider: React.FC<FeatureFlagsProviderProps> = ({ 
  children, 
  flags: customFlags = {} 
}) => {
  const flags = { ...defaultFlags, ...customFlags };

  const isEnabled = (feature: keyof FeatureFlags) => flags[feature];

  return (
    <FeatureFlagsContext.Provider value={{ flags, isEnabled }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within FeatureFlagsProvider');
  }
  return context;
};
