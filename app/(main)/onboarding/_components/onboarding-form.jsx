"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { onboardingSchema } from "@/app/lib/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import useFetch from "@/components/hooks/use-fetch";
import { updateUser, getUser } from "@/actions/user";
import { toast } from "sonner";

const OnboardingForm = ({ industries, isEditing = false }) => {
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [isLoading, setIsLoading] = useState(isEditing);
  const router = useRouter();

  const  {
     loading : updateLoading,
     fn:updateUserFn,
     data:updateResult,
  } = useFetch(updateUser)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      industry: "",
      subIndustry: "",
      experience: "",
      skills: "",
      bio: "",
    },
  });

  // Load existing user data if editing
  useEffect(() => {
    const loadUserData = async () => {
      if (isEditing) {
        try {
          const userData = await getUser();
          
          // Parse industry and subIndustry from the stored format
          const industryParts = userData.industry?.split(' - ') || [];
          const industryId = industryParts[0]?.replace(/-/g, ' ');
          const subIndustry = industryParts[1]?.replace(/-/g, ' ') || '';
          
          // Find the industry object
          const industry = industries.find(i => 
            i.name.toLowerCase() === industryId?.toLowerCase()
          );
          
          if (industry) {
            setSelectedIndustry(industry);
            setValue("industry", industry.id);
            setValue("subIndustry", subIndustry);
          }
          
          setValue("experience", userData.experience?.toString() || "");
          setValue("skills", userData.skills || "");
          setValue("bio", userData.bio || "");
        } catch (error) {
          console.error("Error loading user data:", error);
          toast.error("Failed to load profile data");
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadUserData();
  }, [isEditing, industries, setValue]);

  const onSubmit = async (values) => {
    try{
        const formattedIndustry =`${values.industry} - ${values.subIndustry}`
        .toLowerCase()
        .replace(/ /g, "-")

        await updateUserFn({
          ...values,
          industry: formattedIndustry,
        })  
    }
    catch(error){
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    if (updateResult?.success && !updateLoading) {
      toast.success(isEditing ? "Profile updated successfully!" : "Profile completed successfully!");
      router.push("/dashboard");
      router.refresh();
    }
  }, [updateResult, updateLoading, isEditing, router]);

  const watchIndustry = watch("industry");

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Card className="shadow-xl rounded-2xl border">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin h-8 w-8" />
            <span className="ml-2">Loading profile data...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Card className="shadow-xl rounded-2xl border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {isEditing ? "Edit Your Profile" : "Complete Your Profile"}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {isEditing 
              ? "Update your profile information to keep it current."
              : "Help us tailor your experience by telling us a bit about your background."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Industry Selection */}
            <div className="space-y-1.5">
              <Label htmlFor="industry">Industry</Label>
              <Select
                onValueChange={(value) => {
                  const industry = industries.find((i) => i.id === value);
                  setValue("industry", value);
                  setSelectedIndustry(industry || null);
                  setValue("subIndustry", "");
                }}
              >
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry.id} value={industry.id}>
                      {industry.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-sm text-red-500">
                  {errors.industry.message}
                </p>
              )}
            </div>

            {/* Sub-Industry Selection */}
            {watchIndustry && (
              <div className="space-y-1.5">
                <Label htmlFor="subIndustry">Specialization</Label>
                <Select
                  onValueChange={(value) => setValue("subIndustry", value)}
                  disabled={!selectedIndustry}
                >
                  <SelectTrigger id="subIndustry">
                    <SelectValue placeholder="Select your specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Specializations</SelectLabel>
                      {selectedIndustry?.subIndustries?.map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.subIndustry && (
                  <p className="text-sm text-red-500">
                    {errors.subIndustry.message}
                  </p>
                )}
              </div>
            )}

            {/* Experience */}
            <div className="space-y-1.5">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                max="50"
                placeholder="Enter years of experience"
                {...register("experience")}
              />
              {errors.experience && (
                <p className="text-sm text-red-500">
                  {errors.experience.message}
                </p>
              )}
            </div>

            {/* Skills */}
            <div className="space-y-1.5">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                placeholder="e.g., Python, JavaScript, Project Management"
                {...register("skills")}
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple skills with commas
              </p>
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills.message}</p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your professional background..."
                className="min-h-[100px]"
                {...register("bio")}
              />
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button type="submit" disabled={updateLoading} className="w-full cursor-pointer">
                {updateLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Saving...
                  </>
                ) : (
                  isEditing ? "Update Profile" : "Complete Profile"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;
