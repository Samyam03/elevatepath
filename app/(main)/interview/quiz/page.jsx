import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Quiz from "../_components/quiz";

 function MockInterviewPage() {
  return (
    <div className="min-h-screen px-6 py-10 bg-background text-foreground dark:bg-gray-950 dark:text-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center space-x-2">
          <Link href="/interview">
            <Button variant="link" className="flex items-center gap-2 text-sm">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Interview Preparation</span>
            </Button>
          </Link>
        </div>

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Interview Questions</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Test your knowledge with industry-specific questions
          </p>
        </div>

        <div className="bg-card p-6 rounded-2xl shadow-lg dark:shadow-md border border-border">
          <Quiz />
        </div>
      </div>
    </div>
  );
}

export default MockInterviewPage;