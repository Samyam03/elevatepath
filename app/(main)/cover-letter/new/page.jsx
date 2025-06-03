import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterGenerator from "../_components/cover-letter-generator";

export default function NewCoverLetterPage() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-6xl">
      <div className="flex flex-col space-y-4">
        <Link href="/cover-letter" className="group">
          <Button 
            variant="ghost" 
            className="pl-0 transition-all duration-200 group-hover:pl-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2 transition-all duration-200 group-hover:mr-3" />
            <span className="text-sm font-medium text-muted-foreground group-hover:text-primary">
              Back to Cover Letters
            </span>
          </Button>
        </Link>

        <div className="pb-8 space-y-3">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-foreground text-transparent bg-clip-text leading-tight">
            Create Cover Letter
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Generate a tailored cover letter that highlights your qualifications and matches the job requirements
          </p>
        </div>
      </div>

      <div className="mt-6 border-t pt-8 border-border/50">
        <CoverLetterGenerator />
      </div>
    </div>
  );
}