import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterGenerator from "../_components/cover-letter-generator";

export default function NewCoverLetterPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white py-10 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col gap-6">
          <Link href="/cover-letter" className="group w-max">
            <Button 
              variant="ghost" 
              className="pl-0 text-gray-400 hover:text-white transition-all duration-200 group-hover:pl-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2 transition-all duration-200 group-hover:mr-3" />
              <span className="text-sm font-medium">
                Back to Cover Letters
              </span>
            </Button>
          </Link>

          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Create Cover Letter
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl">
              Generate a tailored cover letter that highlights your qualifications and aligns with the job description.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-800">
          <CoverLetterGenerator />
        </div>
      </div>
    </div>
  );
}