import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { businessApi, type BusinessPayload } from '../services/api';

export interface BusinessData {
  businessName: string;
  phoneNumber: string;
  email: string;
  businessType: string;
  location: string;
}

const defaultData: BusinessData = {
  businessName: '',
  phoneNumber: '',
  email: '',
  businessType: '',
  location: '',
};

interface OnboardingContextValue {
  data: BusinessData;
  updateData: (partial: Partial<BusinessData>) => void;
  submit: () => Promise<void>;
  isSubmitting: boolean;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<BusinessData>(defaultData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateData = useCallback((partial: Partial<BusinessData>) => {
    setData(prev => ({ ...prev, ...partial }));
  }, []);

  const submit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const payload: BusinessPayload = { ...data };
      await businessApi.create(payload);
    } finally {
      setIsSubmitting(false);
    }
  }, [data]);

  return (
    <OnboardingContext.Provider value={{ data, updateData, submit, isSubmitting }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}
