import * as z from "zod"

export const academicProfileSchema = z.object({
  school: z.string().min(2, "School/University name is required"),
  major: z.string().min(2, "Major/Program of study is required"),
  year: z.string().min(1, "Current year/semester is required"),
  careerGoals: z.string().optional(),
})

export type AcademicProfileFormData = z.infer<typeof academicProfileSchema> 