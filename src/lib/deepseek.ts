import OpenAI from "openai"

export const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  // baseURL: "https://api.deepseek.com/v1", // Verify DeepSeek's actual API endpoint
})
