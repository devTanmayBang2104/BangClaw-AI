import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export function getAgentModel() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing OPENROUTER_API_KEY in environment variables. Please set it in your .env file."
    );
  }

  const provider = createOpenRouter({ apiKey });
  const modelId = process.env.OPENROUTER_DEFAULT_MODEL || "nex-agi/nex-n2.5-pro:free";

  return provider(modelId);
}
