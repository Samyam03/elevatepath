import React from 'react'
import { CheckCircle2, XCircle, Trophy } from 'lucide-react'
import { CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'

const QuizResult = ({ result, hideStartNew = false, onStartNew }) => {
  if (!result) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-10 bg-background rounded-2xl shadow-md">
      {/* Header */}
      <div className="flex items-center gap-3 text-2xl font-bold text-primary">
        <Trophy className="text-yellow-500 w-7 h-7" />
        <span>Quiz Results</span>
      </div>

      <CardContent className="space-y-10 p-0">
        {/* SCORE CARD */}
        <section className="p-5 rounded-xl bg-muted/20 shadow-sm border space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Score</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-600">
              {result.quizScore.toFixed(1)}%
            </span>
          </div>
          <Progress value={result.quizScore} />
        </section>

        {/* IMPROVEMENT TIP */}
        {result.improvementTip && (
          <section className="p-5 rounded-xl bg-muted/20 shadow-sm border space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Improvement Tip</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {result.improvementTip}
            </p>
          </section>
        )}

        {/* QUESTION REVIEW */}
        <section className="space-y-6">
          <h3 className="text-lg font-semibold text-foreground">Question Review</h3>
          <div className="space-y-5">
            {result.questions.map((q, index) => (
              <div
                key={index}
                className="p-5 rounded-xl bg-muted/10 border border-muted shadow-sm space-y-3"
              >
                <div className="flex items-start gap-3">
                  <p className="text-base font-medium flex-1 text-foreground">{q.question}</p>
                  {q.isCorrect ? (
                    <CheckCircle2 className="text-green-500 w-5 h-5 mt-1" />
                  ) : (
                    <XCircle className="text-red-500 w-5 h-5 mt-1" />
                  )}
                </div>

                <div className="ml-1 text-sm space-y-1">
                  <p className="text-muted-foreground">
                    <span className="font-semibold">Your Answer:</span> {q.userAnswer}
                  </p>
                  {!q.isCorrect && (
                    <p className="text-red-600">
                      <span className="font-semibold">Correct Answer:</span> {q.answer}
                    </p>
                  )}
                </div>

                <div className="text-sm text-muted-foreground">
                  <p className="font-semibold">Explanation:</p>
                  <p>{q.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </CardContent>

      {/* BUTTON */}
      {!hideStartNew && (
        <div className="flex justify-end pt-2">
          <Button onClick={onStartNew} className="px-6 py-2 text-sm rounded-xl cursor-pointer">
            Start New Quiz
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuizResult;
