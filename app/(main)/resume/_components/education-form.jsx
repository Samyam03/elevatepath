'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { educationSchema } from '@/app/lib/schema';
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
import { Sparkles, Loader2, X } from 'lucide-react';
import { toast } from "sonner";
import { parse, format } from 'date-fns';

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  const date = parse(dateString, "yyyy-MM", new Date());
  return format(date, "MMM yyyy");
};

const EducationForm = ({ entries, onChange }) => {
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      degree: '',
      institution: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: '',
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
      type: "education",
      organization: watch("institution")
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
            <div>
              <CardTitle className="text-white">{item.degree} in {item.field}</CardTitle>
              <CardDescription className="text-gray-400">
                {item.institution} • {item.current ? `${item.startDate} - Present` : `${item.startDate} - ${item.endDate}`}
                {item.gpa && ` • GPA: ${item.gpa}`}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(index)}
              className="text-gray-400 hover:text-red-500 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          {item.description && (
            <CardContent>
              <p className="text-gray-300 whitespace-pre-wrap">{item.description}</p>
            </CardContent>
          )}
        </Card>
      ))}

      {isAdding && (
        <Card className="bg-gray-800 border border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Add Education</CardTitle>
            <CardDescription className="text-gray-400">
              Provide the details of your educational background
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Degree
                </label>
                <Input
                  placeholder="e.g. Bachelor of Science"
                  {...register('degree')}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                {errors.degree && <p className="text-red-400 text-sm mt-1">{errors.degree.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Institution
                </label>
                <Input
                  placeholder="e.g. Stanford University"
                  {...register('institution')}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                {errors.institution && <p className="text-red-400 text-sm mt-1">{errors.institution.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Field of Study
                </label>
                <Input
                  placeholder="e.g. Computer Science"
                  {...register('field')}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                {errors.field && <p className="text-red-400 text-sm mt-1">{errors.field.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  GPA (Optional)
                </label>
                <Input
                  placeholder="e.g. 3.8/4.0"
                  {...register('gpa')}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                {errors.gpa && <p className="text-red-400 text-sm mt-1">{errors.gpa.message}</p>}
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
                I am currently studying here
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description (Optional)
              </label>
              <Textarea
                placeholder="Add any relevant coursework, achievements, or activities..."
                {...register("description")}
                className="bg-gray-700 border-gray-600 text-white min-h-[120px]"
              />
              {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
            </div>

            {watch("description") && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleImproveDescription}
                disabled={isImproving}
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
            )}
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
          Add New Education
        </Button>
      )}
    </div>
  );
};

export default EducationForm;
