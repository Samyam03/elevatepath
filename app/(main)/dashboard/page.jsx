import { redirect } from 'next/navigation';
import React from 'react';
import { getUserOnboardingStatus } from '@/actions/user';
import DashboardView from './_components/dashboard-view';
import { getIndustryInsights } from '@/actions/dashboard';


const IndustryInsights = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();
  const insights = await getIndustryInsights();


  if (!isOnboarded) {
    redirect('/onboarding');
  }

  return (
    <div>
      <DashboardView insights={insights} />
    </div>
  );
};

export default IndustryInsights;
