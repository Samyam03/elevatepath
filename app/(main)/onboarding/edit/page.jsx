import React from 'react'
import { industries } from '@/components/data/industries'
import { getUserOnboardingStatus } from '@/actions/user'
import OnboardingForm from '../_components/onboarding-form'
import { redirect } from 'next/navigation'

const EditProfilePage = async() => {
    const { isOnboarded } = await getUserOnboardingStatus();

    // If user hasn't completed onboarding, redirect to onboarding
    if (!isOnboarded) {
        redirect('/onboarding')
    }
    
    return (
        <main>
            <OnboardingForm industries={industries} isEditing={true} />
        </main>
    )
}

export default EditProfilePage
