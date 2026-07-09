const { GoogleGenAI } = require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

async function generateCaption(base64ImageFile) {
  const contents = [
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64ImageFile,
      },
    },
    { text: "Caption this image." },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    config: {
      systemInstruction: `
      you generate best caption for the image
      your caption isn't longer than 100 characters
      you are an expert in captioning images
      you are given a image and you need to generate a caption for it
      dark humor is allowed 
      you can use emojis
      use sarcasm if you want to make the caption more funny
      generate a caption that is creative and unique
      `,
    },
  });

  return response.text;
}

module.exports = generateCaption;
