"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema } from "@/app/lib/schema";
import useFetch from "@/components/hooks/use-fetch";
import { saveResume } from "@/actions/resume";
import { Input } from "@/components/ui/input";

const ResumeBuilder = ({ initialContent }) => {
  const [activeTab, setActiveTab] = useState("edit");

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

  const formValues = watch();

  useEffect(() => {
    if (initialContent) {
      setActiveTab("preview");
    }
  }, [initialContent]);

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 md:p-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">Resume Builder</h1>
        <div className="flex gap-2">
          <Button variant="default" className="gap-2">
            <Save size={18} />
            Save
          </Button>
          <Button variant="secondary" className="gap-2">
            <Download size={18} />
            Download
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-zinc-800 p-2 rounded-lg">
          <TabsTrigger value="edit" className="text-sm">Form</TabsTrigger>
          <TabsTrigger value="preview" className="text-sm">Markdown</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="mt-6">
          <form className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Contact Information</h3>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                  Email
                </label>
                <Input
                  id="email"
                  {...register("contactInfo.email")}
                  type="email"
                  placeholder="your@email.com"
                  className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500"
                />
                {errors.contactInfo?.email && (
                  <p className="text-red-500 text-sm">{errors.contactInfo.email.message}</p>
                )}
              </div>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          <div className="p-4 bg-zinc-800 rounded-lg text-zinc-300">
            Change your password here.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeBuilder;
