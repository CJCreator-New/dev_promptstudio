import { db, analytics } from '../config/firebase';
import { doc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { logEvent } from 'firebase/analytics';

export const trackUserSignup = async (userId: string, email: string, source?: string) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      email,
      createdAt: serverTimestamp(),
      signupSource: source || 'organic',
      totalEnhancements: 0,
      hasAddedApiKey: false,
      lastActive: serverTimestamp()
    });
    
    const analyticsInstance = await analytics;
    if (analyticsInstance) {
      logEvent(analyticsInstance, 'sign_up', { method: 'email' });
    }
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
};

export const trackEnhancement = async (userId: string, metadata: any) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      totalEnhancements: increment(1),
      lastActive: serverTimestamp(),
      lastUsedProvider: metadata.provider,
      lastUsedDomain: metadata.domain
    });
    
    const analyticsInstance = await analytics;
    if (analyticsInstance) {
      logEvent(analyticsInstance, 'prompt_enhanced', metadata);
    }
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
};

export const trackApiKeyAdded = async (userId: string, provider: string) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      hasAddedApiKey: true,
      preferredProvider: provider,
      apiKeyAddedAt: serverTimestamp()
    });
    
    const analyticsInstance = await analytics;
    if (analyticsInstance) {
      logEvent(analyticsInstance, 'api_key_added', { provider });
    }
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
};

export const trackFeatureUsage = async (userId: string, feature: string) => {
  try {
    const analyticsInstance = await analytics;
    if (analyticsInstance) {
      logEvent(analyticsInstance, 'feature_used', { feature });
    }
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
};