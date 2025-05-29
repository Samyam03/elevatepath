import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "elevatepath", // Unique app ID
  name: "ElevatePath", // App name
  credentials: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
    },
  },
});