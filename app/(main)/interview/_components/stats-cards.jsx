import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Trophy, Brain, Target } from "lucide-react";

const StatsCards = ({ assessments }) => {
  // Fallback to empty array if no assessments passed
  const allAssessments = assessments || [];

  // Calculate average quiz score
  //map,filter,reduce
  const totalScore = allAssessments.reduce((sum, item) => sum + item.quizScore, 0);
  const averageScore = allAssessments.length > 0
    ? (totalScore / allAssessments.length).toFixed(1)
    : "0.0";

  // Get total questions practiced
  const totalQuestions = allAssessments.reduce(
    (sum, item) => sum + item.questions.length,
    0
  );

  // Get the latest quiz score (assuming first item is most recent)
  const latestScore =
    allAssessments.length > 0
      ? allAssessments[0].quizScore.toFixed(1)
      : "0.0";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Average Score */}
      <Card className="bg-gray-900 text-white border border-gray-700 shadow-lg rounded-2xl">
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Average Score</CardTitle>
          <Trophy className="w-6 h-6 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{averageScore}%</div>
          <p className="text-sm text-gray-400">Across all assessments</p>
        </CardContent>
      </Card>

      {/* Questions Practiced */}
      <Card className="bg-gray-900 text-white border border-gray-700 shadow-lg rounded-2xl">
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Questions Practiced</CardTitle>
          <Brain className="w-6 h-6 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalQuestions}</div>
          <p className="text-sm text-gray-400">Total questions</p>
        </CardContent>
      </Card>

      {/* Latest Score */}
      <Card className="bg-gray-900 text-white border border-gray-700 shadow-lg rounded-2xl">
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Latest Score</CardTitle>
          <Target className="w-6 h-6 text-teal-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{latestScore}%</div>
          <p className="text-sm text-gray-400">Most recent quiz</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
