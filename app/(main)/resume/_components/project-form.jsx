'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema } from '@/app/lib/schema';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import useFetch from '@/components/hooks/use-fetch';
import { improveWithAI } from "@/actions/resume";
import { Sparkles, Loader2, X, ExternalLink } from 'lucide-react';
import { toast } from "sonner";
import { parse, format } from 'date-fns';

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  const date = parse(dateString, "yyyy-MM", new Date());
  return format(date, "MMM yyyy");
};

const ProjectForm = ({ entries, onChange }) => {
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      technologies: '',
      startDate: '',
      endDate: '',
      description: '',
      link: '',
      current: false,
    },
  });

  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(improveWithAI);

  const handleImproveDescription = async () => {
    const description = watch("description");
    if (!description) {
      toast.error("Please enter a description first");
      return;
    }

    await improveWithAIFn({
      current: description,
      type: "project",
      organization: watch("title")
    });
  };

  const handleAdd = handleValidation((data) => {
    const formattedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? "Present" : formatDisplayDate(data.endDate)
    };

    onChange([...entries, formattedEntry]);
    reset();
    setIsAdding(false);
  });

  const handleDelete = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    onChange(newEntries);
  };

  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue("description", improvedContent);
      toast.success("Description improved successfully!");
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve description");
    }
  }, [improvedContent, improveError, isImproving, setValue]);

  const current = watch('current');

  return (
    <div className="space-y-8 bg-gray-900 p-6 rounded-xl border border-gray-800">
      {entries.map((item, index) => (
        <Card key={index} className="bg-gray-800 border border-gray-700">
          <CardHeader className="flex flex-row justify-between items-start space-y-0">
            <div className="flex-1">
              <CardTitle className="text-white">{item.title}</CardTitle>
              <CardDescription className="text-gray-400">
                {item.technologies} • {item.current ? `${item.startDate} - Present` : `${item.startDate} - ${item.endDate}`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {item.link && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(item.link, '_blank')}
                  className="text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(index)}
                className="text-gray-400 hover:text-red-500 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 whitespace-pre-wrap">{item.description}</p>
          </CardContent>
        </Card>
      ))}

      {isAdding && (
        <Card className="bg-gray-800 border border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Add Project</CardTitle>
            <CardDescription className="text-gray-400">
              Provide the details of your project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Project Title
                </label>
                <Input
                  placeholder="e.g. E-commerce Platform"
                  {...register('title')}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Technologies Used
                </label>
                <Input
                  placeholder="e.g. React, Node.js, MongoDB"
                  {...register('technologies')}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                {errors.technologies && <p className="text-red-400 text-sm mt-1">{errors.technologies.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Start Date
                </label>
                <Input
                  type="month"
                  {...register('startDate')}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                {errors.startDate && <p className="text-red-400 text-sm mt-1">{errors.startDate.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  End Date
                </label>
                <Input
                  type="month"
                  {...register('endDate')}
                  disabled={current}
                  className="bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                />
                {errors.endDate && <p className="text-red-400 text-sm mt-1">{errors.endDate.message}</p>}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="current"
                type="checkbox"
                {...register('current')}
                onChange={(e) => {
                  setValue('current', e.target.checked);
                  if (e.target.checked) setValue('endDate', '');
                }}
                className="h-4 w-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
              />
              <label htmlFor="current" className="text-sm text-gray-300">
                This is an ongoing project
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Project Link (Optional)
              </label>
              <Input
                placeholder="e.g. https://github.com/username/project"
                {...register('link')}
                className="bg-gray-700 border-gray-600 text-white"
              />
              {errors.link && <p className="text-red-400 text-sm mt-1">{errors.link.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Project Description
              </label>
              <Textarea
                placeholder="Describe your project, including features, challenges, and outcomes..."
                {...register("description")}
                className="bg-gray-700 border-gray-600 text-white min-h-[120px]"
              />
              {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleImproveDescription}
              disabled={isImproving || !watch("description")}
              className="text-blue-400 hover:text-blue-300 cursor-pointer"
            >
              {isImproving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Improving...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Improve with AI
                </>
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                reset();
                setIsAdding(false);
              }}
              className="text-gray-300 border-gray-600 hover:bg-gray-700 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              Add
            </Button>
          </CardFooter>
        </Card>
      )}

      {!isAdding && (
        <Button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
        >
          Add New Project
        </Button>
      )}
    </div>
  );
};

export default ProjectForm;
