import { Groq } from "@groq/groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function generateResearch(topic: string) {
  const prompt = `Create a detailed research outline for a presentation on "${topic}". 
  Include 4-5 main sections with key points and relevant information. 
  Format the response as JSON with the following structure:
  {
    "title": "Main topic title",
    "sections": [
      {
        "title": "Section title",
        "content": "Detailed content",
        "imagePrompt": "Description for finding a relevant image"
      }
    ]
  }`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 2048,
    });

    return JSON.parse(completion.choices[0]?.message?.content || "{}");
  } catch (error) {
    console.error('Error generating research:', error);
    throw new Error('Failed to generate research');
  }
}