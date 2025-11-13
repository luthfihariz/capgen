"use server";

export type FormState = {
  error?: string;
  captions?: { caption: string; platform: string }[];
};

export async function generateCaption(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    // TODO: Implement the caption generation logic
    
    // For now, return a placeholder response
    return {
      captions: [
        { caption: "Sample caption for Instagram", platform: "Instagram" },
        { caption: "Sample caption for Twitter", platform: "Twitter" }
      ]
    };
  } catch (error) {
    return {
      error: "Failed to generate captions. Please try again."
    };
  }
}
