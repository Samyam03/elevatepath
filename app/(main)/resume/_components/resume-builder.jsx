'use client';

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteResume } from "@/actions/resume";
import {
  AlertTriangle,
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { saveResume } from "@/actions/resume";
import EntryForm from "./entry-form";
import useFetch from "@/components/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { entriesToMarkdown } from "@/app/lib/helper";
import { resumeSchema } from "@/app/lib/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ResumeBuilder({ initialContent }) {
  const [activeTab, setActiveTab] = useState("edit");
  const [previewContent, setPreviewContent] = useState(initialContent);
  const { user } = useUser();
  const [resumeMode, setResumeMode] = useState("preview");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  const {
    loading: isDeleting,
    fn: deleteResumeFn,
    data: deleteResult,
    error: deleteError,
  } = useFetch(deleteResume);

  const formValues = watch();

  useEffect(() => {
    if (initialContent) setActiveTab("preview");
  }, [initialContent]);

  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getCombinedContent();
      setPreviewContent(newContent ? newContent : initialContent);
    }
  }, [formValues, activeTab]);

  useEffect(() => {
    if (saveResult && !isSaving) {
      toast.success("Resume saved successfully!");
    }
    if (saveError) {
      toast.error(saveError.message || "Failed to save resume");
    }
  }, [saveResult, saveError, isSaving]);

  useEffect(() => {
    if (deleteResult && !isDeleting) {
      toast.success("Resume deleted successfully!");
      setPreviewContent("");
    }
    if (deleteError) {
      toast.error(deleteError.message || "Failed to delete resume");
    }
  }, [deleteResult, deleteError, isDeleting]);

  const getContactMarkdown = () => {
    const { contactInfo } = formValues;
    const parts = [];
    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo.linkedin)
      parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);

    return parts.length > 0
      ? `## <div align="center">${user.fullName}</div>
        \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
      : "";
  };

  const getCombinedContent = () => {
    const { summary, skills, experience, education, projects } = formValues;
    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience, "Work Experience"),
      entriesToMarkdown(education, "Education"),
      entriesToMarkdown(projects, "Projects"),
    ]
      .filter(Boolean)
      .join("\n\n");
  };

  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    if (!previewContent || !previewContent.trim()) {
      toast.error("Resume is empty. Please add content before downloading.");
      return;
    }

    setIsGenerating(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const element = document.getElementById("resume-pdf");
      const opt = {
        margin: [15, 15],
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (!previewContent || !previewContent.trim()) {
        toast.error("Resume is empty. Please add content before saving.");
        return;
      }

      const formattedContent = previewContent
        .replace(/\n/g, "\n")
        .replace(/\n\s*\n/g, "\n\n")
        .trim();

      await saveResumeFn(formattedContent);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 md:space-y-10">
        <header className="text-center px-2 sm:px-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-1 sm:mb-2">
            Resume Builder
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base">
            Craft and customize your professional resume
          </p>
        </header>

        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center sm:justify-start">
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm shadow disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Save
                  </>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-white border-gray-800">
              <DialogHeader>
                <DialogTitle>Save Resume?</DialogTitle>
                <DialogDescription className="text-gray-400">
                  This will overwrite your previous resume data.
                </DialogDescription>
              </DialogHeader>
              <Button
                onClick={async () => {
                  setSaveDialogOpen(false);
                  await handleSubmit(onSubmit)();
                }}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700 text-whtie cursor-pointer"
              >
                Confirm Save
              </Button>
            </DialogContent>
          </Dialog>

          <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm shadow disabled:opacity-50 cursor-pointer"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Download PDF
                  </>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-white border-gray-800">
              <DialogHeader>
                <DialogTitle>Download Resume PDF?</DialogTitle>
                <DialogDescription className="text-gray-400">
                  This will generate a PDF of your current resume.
                </DialogDescription>
              </DialogHeader>
              <Button
                onClick={async () => {
                  setDownloadDialogOpen(false);
                  await generatePDF();
                }}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                Confirm Download
              </Button>
            </DialogContent>
          </Dialog>

          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm shadow disabled:opacity-50 cursor-pointer"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Clear Resume
                  </>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-white border-gray-800">
              <DialogHeader>
                <DialogTitle>Clear Resume?</DialogTitle>
                <DialogDescription className="text-gray-400">
                  This action will delete all data and cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <Button
                onClick={async () => {
                  setDeleteDialogOpen(false);
                  await deleteResumeFn();
                }}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              >
                Confirm Clear
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-3 sm:space-y-4"
        >
          <TabsList className="flex gap-1 sm:gap-2 bg-gray-900 border border-gray-800 p-1">
            <TabsTrigger 
              value="edit" 
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5 cursor-pointer"
            >
              Form
            </TabsTrigger>
            <TabsTrigger 
              value="preview"
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5 cursor-pointer"
            >
              Markdown
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-4 sm:space-y-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-4 sm:p-6 bg-gray-900 border border-gray-800 rounded-xl sm:rounded-2xl shadow space-y-4 sm:space-y-6"
            >
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold text-white">Contact Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block mb-1 text-sm sm:text-base text-gray-300">Email</label>
                    <Input
                      {...register("contactInfo.email")}
                      type="email"
                      placeholder="your@email.com"
                      className="bg-gray-800 border-gray-700 text-white text-sm sm:text-base h-9 sm:h-10"
                    />
                    {errors.contactInfo?.email && (
                      <p className="text-red-400 text-xs sm:text-sm">
                        {errors.contactInfo.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-1 text-sm sm:text-base text-gray-300">Mobile Number</label>
                    <Input
                      {...register("contactInfo.mobile")}
                      type="tel"
                      placeholder="+1 234 567 8900"
                      className="bg-gray-800 border-gray-700 text-white text-sm sm:text-base h-9 sm:h-10"
                    />
                    {errors.contactInfo?.mobile && (
                      <p className="text-red-400 text-xs sm:text-sm">
                        {errors.contactInfo.mobile.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-1 text-sm sm:text-base text-gray-300">LinkedIn URL</label>
                    <Input
                      {...register("contactInfo.linkedin")}
                      type="url"
                      placeholder="https://linkedin.com/in/your-profile"
                      className="bg-gray-800 border-gray-700 text-white text-sm sm:text-base h-9 sm:h-10"
                    />
                    {errors.contactInfo?.linkedin && (
                      <p className="text-red-400 text-xs sm:text-sm">
                        {errors.contactInfo.linkedin.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-1 text-sm sm:text-base text-gray-300">Twitter/X Profile</label>
                    <Input
                      {...register("contactInfo.twitter")}
                      type="url"
                      placeholder="https://twitter.com/your-handle"
                      className="bg-gray-800 border-gray-700 text-white text-sm sm:text-base h-9 sm:h-10"
                    />
                    {errors.contactInfo?.twitter && (
                      <p className="text-red-400 text-xs sm:text-sm">
                        {errors.contactInfo.twitter.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-lg sm:text-xl font-semibold text-white">Professional Summary</h3>
                <Controller
                  name="summary"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder="Write a compelling professional summary..."
                      className="bg-gray-800 border-gray-700 text-white text-sm sm:text-base min-h-[100px] sm:min-h-[120px]"
                    />
                  )}
                />
                {errors.summary && (
                  <p className="text-red-400 text-xs sm:text-sm">{errors.summary.message}</p>
                )}
              </div>

              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-lg sm:text-xl font-semibold text-white">Skills</h3>
                <Controller
                  name="skills"
                  control={control}
                  render={({ field }) => (
                    <Textarea 
                      {...field} 
                      placeholder="List your key skills..." 
                      className="bg-gray-800 border-gray-700 text-white text-sm sm:text-base min-h-[100px] sm:min-h-[120px]"
                    />
                  )}
                />
                {errors.skills && (
                  <p className="text-red-400 text-xs sm:text-sm">{errors.skills.message}</p>
                )}
              </div>

              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-lg sm:text-xl font-semibold text-white">Work Experience</h3>
                <Controller
                  name="experience"
                  control={control}
                  render={({ field }) => (
                    <EntryForm
                      type="Experience"
                      entries={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.experience && (
                  <p className="text-red-400 text-xs sm:text-sm">
                    {errors.experience.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-lg sm:text-xl font-semibold text-white">Education</h3>
                <Controller
                  name="education"
                  control={control}
                  render={({ field }) => (
                    <EntryForm
                      type="Education"
                      entries={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.education && (
                  <p className="text-red-400 text-xs sm:text-sm">
                    {errors.education.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-lg sm:text-xl font-semibold text-white">Projects</h3>
                <Controller
                  name="projects"
                  control={control}
                  render={({ field }) => (
                    <EntryForm
                      type="Project"
                      entries={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.projects && (
                  <p className="text-red-400 text-xs sm:text-sm">
                    {errors.projects.message}
                  </p>
                )}
              </div>
            </form>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4 sm:space-y-6">
            {activeTab === "preview" && resumeMode !== "preview" && (
              <div className="flex items-center gap-2 bg-yellow-900 text-yellow-200 p-2 rounded-md text-xs sm:text-sm">
                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>
                  You will lose edited markdown if you update the form data.
                </span>
              </div>
            )}

            {activeTab === "preview" && (
              <Button
                variant="outline"
                type="button"
                onClick={() =>
                  setResumeMode(resumeMode === "preview" ? "edit" : "preview")
                }
                className="text-xs sm:text-sm bg-gray-800 text-white hover:bg-gray-700 border-gray-700 px-2 py-1 sm:px-3 sm:py-1.5 cursor-pointer"
              >
                {resumeMode === "preview" ? (
                  <>
                    <Edit className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Edit Resume
                  </>
                ) : (
                  <>
                    <Monitor className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Show Preview
                  </>
                )}
              </Button>
            )}

            <div className="border border-gray-800 rounded-md overflow-hidden">
              <MDEditor
                value={previewContent}
                onChange={setPreviewContent}
                height={600}
                preview={resumeMode}
                data-color-mode="dark"
                className="text-sm sm:text-base"
              />
            </div>

            <div className="hidden" id="resume-pdf">
              <MDEditor.Markdown source={previewContent} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}