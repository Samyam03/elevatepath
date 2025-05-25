import React from 'react'
import { industries } from '@/components/data/industries'
import {getUserOnboardingStatus} from '@/actions/user'
import OnboardingForm from './_components/onboarding-form'

const OnBoardingPage = async() => {

    const {isOnboarded}= await getUserOnboardingStatus();

    if(isOnboarded){
        redirect('/dashboard')
    }
    
  return (
    <main>
        <OnboardingForm industries={industries} />
    </main>
  )
}

export default OnBoardingPage
