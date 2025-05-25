import React from 'react'
import { industries } from '@/components/data/industries'
import OnboardingForm from './_components/onboarding-form'

const OnBoardingPage = () => {
  return (
    <main>
        <OnboardingForm industries={industries} />
    </main>
  )
}

export default OnBoardingPage
