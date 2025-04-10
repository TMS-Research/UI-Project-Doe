import * as z from "zod"

export const preferenceSetupSchema = z.object({
  learningStyle: z.string().min(1, "Learning style preference is required"),
  notificationEmail: z.boolean(),
  notificationPush: z.boolean(),
  notificationSMS: z.boolean(),
}).required()

export type PreferenceSetupFormData = z.infer<typeof preferenceSetupSchema> 