"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QuizResult from "./quiz-result";

const QuizList = ({ assessments }) => {
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  return (
    <>
      <Card className="bg-gray-900 text-white shadow-md rounded-xl transition-all duration-300">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold">
              Recent Quizzes
            </CardTitle>
            <CardDescription className="text-sm text-gray-400">
              Review your past quiz performance
            </CardDescription>
          </div>
          <Button
            onClick={() => router.push("/interview/mock")}
            className="transition duration-200 hover:scale-105"
          >
            Start New Quiz
          </Button>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {assessments.map((assessment, index) => (
              <div key={assessment.id || index}>
                <Card
                  onClick={() => setSelectedQuiz(assessment)}
                  className="bg-gray-800 text-white border border-gray-700 cursor-pointer rounded-lg transition duration-200 transform hover:scale-105 hover:shadow-lg hover:border-blue-500"
                >
                  <CardHeader>
                    <CardTitle className="text-base font-medium">
                      Quiz {index + 1}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>Score: {assessment.quizScore.toFixed(1)}%</div>
                        <div>{assessment.createdAtFormatted}</div>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300">
                      {assessment.improvementTip || "No tips available."}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedQuiz}
        onOpenChange={(open) => !open && setSelectedQuiz(null)}
      >
        <DialogContent className="w-[70vw] max-h-[90vh] overflow-y-auto bg-gray-900 text-white border border-gray-700 rounded-xl shadow-xl transition-all duration-300 ease-in-out transform">
          <DialogHeader className="mb-4 border-b border-gray-700 pb-2">
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-xl font-semibold">
                  Quiz Details
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-400">
                  Review your answers and performance
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedQuiz ? (
            <div className="px-1 pb-4">
              <QuizResult
                result={selectedQuiz}
                hideStartNew
                onStartNew={() => {
                  setSelectedQuiz(null);
                  router.push("/interview/mock");
                }}
              />
            </div>
          ) : (
            <p className="text-gray-400">Loading...</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuizList;
