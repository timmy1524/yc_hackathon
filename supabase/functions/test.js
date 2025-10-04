import {
    GoogleGenAI,
    createUserContent,
    createPartFromUri,
  } from "@google/genai";
  
  const ai = new GoogleGenAI({});
  
  async function main() {
    const image = await ai.files.upload({
      file: "/Users/fanzhao/projects/yc_hackathon/IMG_8437.HEIC",
    });
    const audio = await ai.files.upload({
        file: "/Users/fanzhao/projects/yc_hackathon/Y Combinator 5.acc",
      });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        createUserContent([
          "Tell me about this instrument",
          createPartFromUri(image.uri, image.mimeType),
          createPartFromUri(audio.uri, audio.mimeType),
        ]),
      ],
    });
    console.log(response.text);
  }
  
  await main();