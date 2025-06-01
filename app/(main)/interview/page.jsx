import { getAssessments } from '@/actions/interview'
import React from 'react'
import QuizList from './_components/quiz-list'
import StatsCards from './_components/stats-cards'
import PerformanceChart from './_components/performance-charts'

const InterviewPage = async () => {
  const assessments = await getAssessments()

  return (
    <div className="min-h-screen bg-gray-950 text-white py-10 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Interview Preparation
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Track your progress and revisit past quizzes to stay sharp.
          </p>
        </header>

        <div className="grid gap-8">
          <StatsCards assessments={assessments} />
          <PerformanceChart assessments={assessments} />
          <QuizList assessments={assessments} />
        </div>
      </div>
    </div>
  )
}

export default InterviewPage
