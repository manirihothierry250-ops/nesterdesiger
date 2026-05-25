import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for Chatbot
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key is not configured on the server." });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: message,
        config: {
          systemInstruction: `You are Nesta AI, a professional assistant for "Nesta Design", an ICT company in Kigali, Rwanda. 
          Nesta Design provides: Website Development, Mobile Apps, Graphic Design, Branding, Photography, and Videography.
          The contact phone is +250 782 739 381 and email is jeanesta81@gmail.com.
          Be professional, creative, and concise. Always guide users to the "Request Service" section if they want to hire Nesta Design.`
        }
      });

      res.json({ text: response.text || "I'm sorry, I couldn't process that. Please contact our support." });
    } catch (err) {
      console.error("Gemini API error:", err);
      res.status(500).json({ error: "Failed to generate content from AI." });
    }
  });

  // Serve static assets & handles routing
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
