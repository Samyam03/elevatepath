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
import { marked } from 'marked';

export default function ResumeBuilder({ initialContent }) {
  const [activeTab, setActiveTab] = useState("edit");
  const [previewContent, setPreviewContent] = useState(initialContent);
  const { user } = useUser();
  const [resumeMode, setResumeMode] = useState("preview");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isResumeSaved, setIsResumeSaved] = useState(!!initialContent);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
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

  // Function to parse markdown content back to form data
  const parseMarkdownToFormData = (markdown) => {
    if (!markdown) return null;

    const formData = {
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    };

    try {
      const lines = markdown.split('\n');
      let currentSection = '';
      let currentEntry = null;
      let currentList = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Parse name from the centered H2 line if present
        const nameMatch = line.match(/^##\s*<div\s+align="center">(.+)<\/div>$/i);
        if (nameMatch) {
          formData.contactInfo.name = nameMatch[1];
          continue;
        }

        // Parse contact info from the contact section
        if (line.includes('📧') || line.includes('📱') || line.includes('💼') || line.includes('🐦')) {
          // Extract email
          const emailMatch = line.match(/📧\s*([^\s|]+)/);
          if (emailMatch) formData.contactInfo.email = emailMatch[1];
          
          // Extract mobile
          const mobileMatch = line.match(/📱\s*([^\s|]+)/);
          if (mobileMatch) formData.contactInfo.mobile = mobileMatch[1];
          
          // Extract LinkedIn
          const linkedinMatch = line.match(/💼\s*\[LinkedIn\]\(([^)]+)\)/);
          if (linkedinMatch) formData.contactInfo.linkedin = linkedinMatch[1];
          
          // Extract Twitter
          const twitterMatch = line.match(/🐦\s*\[Twitter\]\(([^)]+)\)/);
          if (twitterMatch) formData.contactInfo.twitter = twitterMatch[1];
        }
        
        // Parse sections
        else if (line.startsWith('## Professional Summary')) {
          currentSection = 'summary';
          currentList = [];
        }
        else if (line.startsWith('## Skills')) {
          currentSection = 'skills';
          currentList = [];
        }
        else if (line.startsWith('## Work Experience')) {
          // Save previous section's data before switching
          if (currentSection === 'experience' && currentList.length > 0) {
            formData.experience = [...currentList];
          }
          currentSection = 'experience';
          currentList = [];
        }
        else if (line.startsWith('## Education')) {
          // Save previous section's data before switching
          if (currentSection === 'experience' && currentList.length > 0) {
            formData.experience = [...currentList];
          } else if (currentSection === 'education' && currentList.length > 0) {
            formData.education = [...currentList];
          }
          currentSection = 'education';
          currentList = [];
        }
        else if (line.startsWith('## Projects')) {
          // Save previous section's data before switching
          if (currentSection === 'experience' && currentList.length > 0) {
            formData.experience = [...currentList];
          } else if (currentSection === 'education' && currentList.length > 0) {
            formData.education = [...currentList];
          } else if (currentSection === 'projects' && currentList.length > 0) {
            formData.projects = [...currentList];
          }
          currentSection = 'projects';
          currentList = [];
        }
        else if (line.startsWith('### ')) {
          // This is a job/education/project title
          if (currentEntry) {
            currentList.push(currentEntry);
          }
          
          // Parse title and organization from format: "### Title @ Organization"
          const titleOrgMatch = line.match(/### (.+?) @ (.+)/);
          if (titleOrgMatch) {
            currentEntry = {
              title: titleOrgMatch[1],
              organization: titleOrgMatch[2],
              startDate: '',
              endDate: '',
              description: '',
              current: false
            };
          } else {
            // Fallback if format doesn't match
            currentEntry = {
              title: line.substring(4),
              organization: '',
              startDate: '',
              endDate: '',
              description: '',
              current: false
            };
          }
        }
        else if (line.match(/^\d{4}\s*-\s*(Present|\d{4})/) && currentEntry) {
          // Parse date range
          const dateMatch = line.match(/(\d{4})\s*-\s*(Present|\d{4})/);
          if (dateMatch) {
            currentEntry.startDate = dateMatch[1];
            currentEntry.endDate = dateMatch[2];
            currentEntry.current = dateMatch[2] === 'Present';
          }
        }
        else if (line && currentEntry && !line.startsWith('##') && !line.startsWith('###')) {
          // This is description content
          if (currentEntry.description) {
            currentEntry.description += '\n' + line;
          } else {
            currentEntry.description = line;
          }
        }
        else if (line && currentSection === 'summary' && !line.startsWith('##')) {
          formData.summary += (formData.summary ? '\n' : '') + line;
        }
        else if (line && currentSection === 'skills' && !line.startsWith('##')) {
          formData.skills += (formData.skills ? '\n' : '') + line;
        }
      }

      // Add the last entry
      if (currentEntry) {
        currentList.push(currentEntry);
      }

      // Save the final section's data
      if (currentSection === 'experience' && currentList.length > 0) {
        formData.experience = [...currentList];
      } else if (currentSection === 'education' && currentList.length > 0) {
        formData.education = [...currentList];
      } else if (currentSection === 'projects' && currentList.length > 0) {
        formData.projects = [...currentList];
      }

      return formData;
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return null;
    }
  };

  useEffect(() => {
    if (initialContent) {
      setActiveTab("preview");
      // Parse saved content and populate form
      const parsedData = parseMarkdownToFormData(initialContent);
      if (parsedData) {
        console.log('Parsed data:', parsedData); // Debug log
        // Reset form with parsed data
        Object.keys(parsedData).forEach(key => {
          if (parsedData[key] !== undefined) {
            setValue(key, parsedData[key]);
          }
        });
        // Set resume as saved since we have initial content
        setIsResumeSaved(true);
      }
    }
  }, [initialContent, setValue]);

  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getCombinedContent();
      setPreviewContent(newContent ? newContent : initialContent);
    }
  }, [formValues, activeTab]);

  useEffect(() => {
    if (saveResult && !isSaving) {
      toast.success("Resume saved successfully!");
      setIsResumeSaved(true);
    }
    if (saveError) {
      toast.error(saveError.message || "Failed to save resume");
    }
  }, [saveResult, saveError, isSaving]);

  useEffect(() => {
    if (deleteResult && !isDeleting) {
      toast.success("Resume deleted successfully!");
      setPreviewContent("");
      setIsResumeSaved(false);
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

    const nameLine = contactInfo.name || user.fullName;
    if (!nameLine && parts.length === 0) return "";

    const contactLines = parts.length > 0
      ? `\n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
      : "";

    return `## <div align="center">${nameLine || ""}</div>${contactLines}`;
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
      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas')).default;

      // Create a temporary container for A4 PDF rendering
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '794px'; // A4 width at 96dpi
      tempContainer.style.minHeight = '1123px'; // A4 height at 96dpi
      tempContainer.style.background = 'white';
      tempContainer.style.color = 'black';
      tempContainer.style.fontFamily = 'Arial, Helvetica, sans-serif';
      tempContainer.style.fontSize = '13px';
      tempContainer.style.lineHeight = '1.6';
      tempContainer.style.padding = '40px 48px'; // 20mm left/right, 15mm top/bottom
      tempContainer.style.boxSizing = 'border-box';
      tempContainer.style.overflow = 'hidden';

      // Use marked to convert markdown to HTML
      tempContainer.innerHTML = `
        <div class="resume-pdf-a4">
          ${marked.parse(previewContent)}
        </div>
      `;

      // Add print-friendly CSS for headings, lists, etc.
      const style = document.createElement('style');
      style.innerHTML = `
        .resume-pdf-a4 { width: 100%; }
        .resume-pdf-a4 h1 { font-size: 2.1em; font-weight: bold; margin: 0 0 0.5em 0; text-align: center; border-bottom: 2px solid #222; padding-bottom: 0.2em; }
        .resume-pdf-a4 h2 { font-size: 1.4em; font-weight: bold; margin: 1.2em 0 0.5em 0; border-bottom: 1px solid #aaa; padding-bottom: 0.1em; }
        .resume-pdf-a4 h3 { font-size: 1.1em; font-weight: bold; margin: 1em 0 0.3em 0; }
        .resume-pdf-a4 ul, .resume-pdf-a4 ol { margin: 0.5em 0 0.5em 2em; }
        .resume-pdf-a4 li { margin-bottom: 0.2em; }
        .resume-pdf-a4 strong { font-weight: bold; }
        .resume-pdf-a4 em { font-style: italic; }
        .resume-pdf-a4 a { color: #0066cc; text-decoration: underline; }
        .resume-pdf-a4 table { border-collapse: collapse; width: 100%; margin: 1em 0; }
        .resume-pdf-a4 th, .resume-pdf-a4 td { border: 1px solid #ccc; padding: 4px 8px; }
        .resume-pdf-a4 blockquote { border-left: 3px solid #ccc; margin: 1em 0; padding-left: 1em; color: #555; }
        .resume-pdf-a4 code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; font-size: 0.95em; }
        .resume-pdf-a4 p { margin: 0.35em 0; }
      `;
      tempContainer.appendChild(style);

      document.body.appendChild(tempContainer);

      // Wait for the browser to render the content
      await new Promise(resolve => setTimeout(resolve, 100));

      // Scale-to-fit: ensure the entire content fits within one A4 page
      const availableWidth = 794 - (48 * 2);  // account for horizontal padding
      const availableHeight = 1123 - (40 * 2); // account for vertical padding
      const contentEl = tempContainer.querySelector('.resume-pdf-a4');
      if (contentEl) {
        // Ensure base width before measuring
        contentEl.style.width = availableWidth + 'px';

        // Let layout settle
        await new Promise(resolve => setTimeout(resolve, 50));

        const contentHeight = contentEl.scrollHeight;
        const contentWidth = contentEl.scrollWidth;

        // Determine scale factor constrained by width and height
        let scale = Math.min(1, availableWidth / contentWidth, availableHeight / contentHeight);

        if (scale < 1) {
          contentEl.style.transformOrigin = 'top left';
          contentEl.style.transform = `scale(${scale})`;
          // Expand base width so the scaled width fills available space
          contentEl.style.width = (availableWidth / scale) + 'px';
        }
      }

      // Convert to canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
      });

      document.body.removeChild(tempContainer);

      // Create PDF
      const pdf = new jsPDF('p', 'pt', 'a4');
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 595, 842); // 595x842pt is A4
      pdf.save('resume.pdf');
      toast.success("PDF downloaded successfully!");
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

          {isResumeSaved && (
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
          )}

          {isResumeSaved && (
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
          )}
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
                  <div className="sm:col-span-2">
                    <label className="block mb-1 text-sm sm:text-base text-gray-300">Full Name</label>
                    <Input
                      {...register("contactInfo.name")}
                      type="text"
                      placeholder="Your full name"
                      className="bg-gray-800 border-gray-700 text-white text-sm sm:text-base h-9 sm:h-10"
                    />
                    {errors.contactInfo?.name && (
                      <p className="text-red-400 text-xs sm:text-sm">
                        {errors.contactInfo.name.message}
                      </p>
                    )}
                  </div>
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


          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}