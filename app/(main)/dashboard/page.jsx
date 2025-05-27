import { redirect } from 'next/navigation';
import React from 'react';
import { getUserOnboardingStatus } from '@/actions/user';

const IndustryInsights = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();

  if (!isOnboarded) {
    redirect('/onboarding');
  }

  return (
    <div>
      Industry Insights Page
    </div>
  );
};

export default IndustryInsights;
