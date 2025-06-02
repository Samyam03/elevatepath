'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { entrySchema } from '@/app/lib/schema';
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

const EntryForm = ({ type, entries, onChange }) => {
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: '',
      organization: '',
      startDate: '',
      endDate: '',
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
      type: type.toLowerCase(),
      organization: organization
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
  const organization = watch("organization");

  return (
    <div className="space-y-8 bg-zinc-950 p-8 rounded-2xl border border-zinc-800 shadow-2xl">
  
        {entries.map((item, index) => (
          <Card key={index} className="bg-zinc-900 border border-zinc-700 shadow-md rounded-xl transition-all duration-300">
            <CardHeader className="flex justify-between items-start">
              <div>
                <CardTitle>{item.title} @ {item.organization}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {item.current ? `${item.startDate} - Present` : `${item.startDate} - ${item.endDate}`}
                </p>
              </div>
              <Button
                type="button"
                onClick={() => handleDelete(index)}
                className="text-red-400 hover:text-red-600"
              >
                <X />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="mt-2 text-sm whitespace-pre-wrap text-zinc-300">{item.description}</p>
            </CardContent>
          </Card>
        ))}
    
      <div className="space-y-6"> 

      {isAdding && (
        <Card className="bg-zinc-900 border border-zinc-700 text-white rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-zinc-100">Add {type}</CardTitle>
            <CardDescription className="text-sm text-zinc-400">
              Provide the details of your {type.toLowerCase()} entry
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-zinc-300 mb-1">
                  Title / Position
                </label>
                <Input
                  id="title"
                  placeholder="e.g. Software Engineer"
                  {...register('title')}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-zinc-600 rounded-md px-3 py-2"
                />
                {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label htmlFor="organization" className="block text-sm font-semibold text-zinc-300 mb-1">
                  Organization
                </label>
                <Input
                  id="organization"
                  placeholder="e.g. OpenAI"
                  {...register('organization')}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-zinc-600 rounded-md px-3 py-2"
                />
                {errors.organization && <p className="text-sm text-red-500 mt-1">{errors.organization.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-semibold text-zinc-300 mb-1">
                  Start Date
                </label>
                <Input
                  id="startDate"
                  type="month"
                  {...register('startDate')}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white focus:ring-2 focus:ring-zinc-600 rounded-md px-3 py-2"
                />
                {errors.startDate && <p className="text-sm text-red-500 mt-1">{errors.startDate.message}</p>}
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-semibold text-zinc-300 mb-1">
                  End Date
                </label>
                <Input
                  id="endDate"
                  type="month"
                  {...register('endDate')}
                  disabled={current}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white disabled:opacity-50 focus:ring-2 focus:ring-zinc-600 rounded-md px-3 py-2"
                />
                {errors.endDate && <p className="text-sm text-red-500 mt-1">{errors.endDate.message}</p>}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                id="current"
                type="checkbox"
                {...register('current')}
                onChange={(e) => {
                  setValue('current', e.target.checked);
                  if (e.target.checked) setValue('endDate', '');
                }}
                className="accent-zinc-600 w-4 h-4"
              />
              <label htmlFor="current" className="text-sm text-zinc-300">
                I currently work here
              </label>
            </div>

            <div>
              <Textarea
                placeholder={`Add your ${type}`}
                {...register("description")}
                className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-zinc-600 min-h-[140px] rounded-md px-3 py-2"
              />
              {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleImproveDescription}
              disabled={isImproving || !watch("description")}
              className="mt-2 flex items-center text-sm font-medium text-blue-400 hover:text-white transition gap-2"
            >
              {isImproving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Improving...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Improve with AI
                </>
              )}
            </Button>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => {
                reset();
                setIsAdding(false);
              }}
              className="px-5 py-2 border border-zinc-700 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleAdd}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Add
            </Button>
          </CardFooter>
        </Card>
      )}

      {!isAdding && (
        <Button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-5 py-2 transition"
        >
          Add New {type}
        </Button>
      )}
      </div>
    </div>
  );
};

export default EntryForm;
