import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterGenerator from "../_components/cover-letter-generator";

export default function NewCoverLetterPage() {
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-6xl space-y-10">
      <div className="flex flex-col gap-6">
        <Link href="/cover-letter" className="group w-max">
          <Button 
            variant="ghost" 
            className="pl-0 text-muted-foreground hover:text-primary transition-all duration-200 group-hover:pl-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2 transition-all duration-200 group-hover:mr-3" />
            <span className="text-sm font-medium">
              Back to Cover Letters
            </span>
          </Button>
        </Link>

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-primary to-foreground text-transparent bg-clip-text leading-tight">
            Create Cover Letter
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Generate a tailored cover letter that highlights your qualifications and aligns with the job description.
          </p>
        </div>
      </div>

      <div className="pt-6 border-t border-border/50">
        <CoverLetterGenerator />
      </div>
    </div>
  );
}