import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  const { customInput } = body;

  const API_KEY = process.env.GEMINI_API_KEY;
  const promptText = `
    using the given information, generate a brief .md file or markup code that directly previews in the markdown preview section. Start from the header and avoid using triple backticks. 

    Project Purpose: ${customInput || "No additional input provided"}
  `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: promptText }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const generatedContent =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text)
        .join(" ") || "";

    if (generatedContent) {
      return NextResponse.json({ markdown: generatedContent });
    } else {
      return NextResponse.json({
        error: "Error generating content from Gemini.",
      });
    }
  } catch (error) {
    console.error("Error in API request:", error);
    return NextResponse.json({ error: "Failed to connect to Gemini API." });
  }
}
