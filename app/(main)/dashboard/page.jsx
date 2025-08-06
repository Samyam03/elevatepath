import { redirect } from 'next/navigation';
import React from 'react';
import { getUserOnboardingStatus } from '@/actions/user';
import DashboardView from './_components/dashboard-view';
import { getIndustryInsights } from '@/actions/dashboard';


const IndustryInsights = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();

  if (!isOnboarded) {
    redirect('/onboarding');
  }

  try {
    const insights = await getIndustryInsights();
    return (
      <div>
        <DashboardView insights={insights} />
      </div>
    );
  } catch (error) {
    // If user hasn't set industry, redirect to onboarding
    if (error.message.includes("User has not completed onboarding")) {
      redirect('/onboarding');
    }
    // For other errors, throw them
    throw error;
  }
};

export default IndustryInsights;
