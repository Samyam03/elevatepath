"use client";
import React, { useState, useEffect } from "react";
import { generateQuiz, saveQuizResult } from "@/actions/interview";
import useFetch from "@/components/hooks/use-fetch";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarLoader } from "react-spinners";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch(generateQuiz);

  const {
    loading: savingResult,
    fn: saveQuizResultFn,
    data: resultData,
    setData: setResultData,
  } = useFetch(saveQuizResult);

  useEffect(() => {
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(null));
    }
  }, [quizData]);

  const handleAnswer = (answer) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = answer;
    setAnswers(updatedAnswers);
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      const correctAnswer = quizData[index].correctAnswer;
      const correctValue =
        typeof correctAnswer === "number"
          ? quizData[index].options[correctAnswer]
          : correctAnswer;
      if (answer === correctValue) correct++;
    });
    return (correct / quizData.length) * 100;
  };

  const finishQuiz = async () => {
    const score = calculateScore();
    try {
      await saveQuizResultFn(quizData, answers, score);
      toast.success("Quiz completed!");
    } catch (error) {
      toast.error(error.message || "Failed to save quiz results");
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const startNewQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    generateQuizFn();
    setResultData(null);
  };

  if (generatingQuiz) {
    return (
      <div className="py-16 px-6 md:px-12 lg:px-24 flex items-center justify-center">
        <BarLoader width={"100%"} color="#3B82F6" />
      </div>
    );
  }

//   if (resultData) {
//     return (
//       <div className="mx-2">
//         <QuizResult result={resultData} onStartNew={startNewQuiz} />
//       </div>
//     );
//   }

  if (!quizData) {
    return (
      <Card className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-md transition-all">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Ready to Test Yourself?
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
            This quiz will assess your knowledge in your chosen field.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-800 dark:text-gray-300">
            Click below to begin.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={generateQuizFn}
            className="bg-blue-600 hover:bg-blue-700 text-white transition-all"
          >
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = quizData[currentQuestion];

  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl transition-all">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
          Question {currentQuestion + 1} of {quizData.length}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <p className="text-base text-gray-800 dark:text-gray-100">
          {question.question}
        </p>

        <RadioGroup
          onValueChange={handleAnswer}
          value={answers[currentQuestion]}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 hover:bg-blue-50 dark:hover:bg-gray-800"
            >
              <RadioGroupItem
                value={option}
                id={`option-${index}`}
                className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
              />
              <Label
                htmlFor={`option-${index}`}
                className="text-gray-700 dark:text-gray-300 text-sm font-medium"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {showExplanation && (
          <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-300 border border-blue-200 dark:border-gray-700">
            <p className="font-medium mb-1 text-blue-600 dark:text-blue-400">
              Explanation:
            </p>
            <p>{question.explanation}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {!showExplanation && (
          <Button
            onClick={() => setShowExplanation(true)}
            variant="outline"
            disabled={!answers[currentQuestion]}
            className="w-full sm:w-auto border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800"
          >
            Show Explanation
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion] || savingResult}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white transition-all"
        >
          {savingResult ? (
            currentQuestion === quizData.length - 1 ? (
              <Loader2 className="animate-spin w-5 h-5 text-white dark:text-blue-200" />
            ) : (
              "Next Question"
            )
          ) : currentQuestion < quizData.length - 1 ? (
            "Next Question"
          ) : (
            "Finish Quiz"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Quiz;
