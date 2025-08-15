import { z } from "zod";

export const onboardingSchema = z.object({
  industry: z.string({
    required_error: "Please select an industry",
  }).min(1, "Please select an industry"),

  subIndustry: z.string({
    required_error: "Please select a specialization",
  }).min(1, "Please select a specialization"),

  bio: z
    .string()
    .max(500, "Bio must be 500 characters or less")
    .optional(),

  experience: z
    .string({
      required_error: "Please enter your years of experience",
    })
    .min(1, "Please enter your years of experience")
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .min(0, "Experience must be at least 0 years")
        .max(50, "Experience cannot exceed 50 years")
    ),

  skills: z
    .string({
      required_error: "Please enter at least one skill",
    })
    .min(1, "Please enter at least one skill")
    .transform((val) =>
      val
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    ),
});


export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
});

// Experience schema - for work experience
export const experienceSchema = z
  .object({
    title: z.string().min(1, "Job title is required"),
    organization: z.string().min(1, "Company name is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    description: z.string().min(1, "Job description is required"),
    current: z.boolean().default(false),
  }).refine(
    (data) => {
      if (!data.current && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required unless this is your current position",
      path: ["endDate"],
    }
  );

// Education schema - for educational background
export const educationSchema = z
  .object({
    degree: z.string().min(1, "Degree is required"),
    institution: z.string().min(1, "Institution name is required"),
    field: z.string().min(1, "Field of study is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    gpa: z.string().optional(),
    description: z.string().optional(),
    current: z.boolean().default(false),
  }).refine(
    (data) => {
      if (!data.current && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required unless this is your current education",
      path: ["endDate"],
    }
  );

// Project schema - for projects
export const projectSchema = z
  .object({
    title: z.string().min(1, "Project title is required"),
    technologies: z.string().min(1, "Technologies used is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    description: z.string().min(1, "Project description is required"),
    link: z.string().optional(),
    current: z.boolean().default(false),
  }).refine(
    (data) => {
      if (!data.current && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required unless this is your current project",
      path: ["endDate"],
    }
  );

// Keep the old entrySchema for backward compatibility
export const entrySchema = experienceSchema;

export const resumeSchema = z.object({
  contactInfo: contactSchema,
  summary: z.string().min(1, "Professional summary is required"),
  skills: z.string().min(1, "Skills are required"),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  projects: z.array(projectSchema),
});

export const coverLetterSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobDescription: z.string().min(1, "Job description is required"),
});
  