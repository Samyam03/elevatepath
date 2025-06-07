import { getCoverLetters } from "@/actions/cover-letter";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterList from "./_components/cover-letter-list";

export default async function CoverLetterPage() {
  const coverLetters = await getCoverLetters();

  return (
    <div className="min-h-screen bg-gray-950 text-white py-10 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              My Cover Letters
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              View and manage all your cover letters
            </p>
          </div>
          <Link href="/cover-letter/new">
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4" />
              <span className="text-sm font-medium">Create New</span>
            </Button>
          </Link>
        </div>

        <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl shadow space-y-8">
          <CoverLetterList coverLetters={coverLetters} />
        </div>
      </div>
    </div>
  );
}