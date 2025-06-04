"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Edit2, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteCoverLetter } from "@/actions/cover-letter";

export default function CoverLetterList({ coverLetters }) {
  const router = useRouter();

  const handleDelete = async (id) => {
    try {
      await deleteCoverLetter(id);
      toast.success("Cover letter deleted successfully!");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to delete cover letter");
    }
  };

  if (!coverLetters?.length) {
    return (
      <Card className="border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800 dark:text-white">
            No Cover Letters Yet
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Create your first cover letter to get started.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {coverLetters.map((letter) => (
        <Card
          key={letter.id}
          className="rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md bg-white dark:bg-gray-900 transition hover:shadow-lg"
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                  {letter.jobTitle} at {letter.companyName}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Created {format(new Date(letter.createdAt), "PPP")}
                </CardDescription>
              </div>
              <div className="flex space-x-2 pt-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.push(`/cover-letter/${letter.id}`)}
                  className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Eye className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900"
                    >
                      <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-gray-800 dark:text-white">
                        Delete Cover Letter?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                        This action cannot be undone. This will permanently
                        delete your cover letter for{" "}
                        <strong>{letter.jobTitle}</strong> at{" "}
                        <strong>{letter.companyName}</strong>.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(letter.id)}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
              {letter.jobDescription}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}