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
      const { message, history } = req.body;
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

      // Map chat history to expected Gemini parts (user <-> model)
      const contents = [];
      if (history && Array.isArray(history)) {
        for (const turn of history) {
          if (turn.role === 'user' && turn.content) {
            contents.push({ role: 'user', parts: [{ text: turn.content }] });
          } else if (turn.role === 'bot' && turn.content) {
            contents.push({ role: 'model', parts: [{ text: turn.content }] });
          }
        }
      }

      // Add the final user message
      contents.push({ role: 'user', parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: `You are Nesta AI, a professional, creative, and extremely helpful digital assistant for "Nesta Design", an ICT and Creative Design company based in Shyorongi - Rulindo, Rwanda.

FOUNDER & PORTFOLIO DETAILS:
- Founder: HITIMANA JEAN, an expert professional Graphic Designer since 2005 (over 20 years of experience).
- Core Skills: Graphic Design, Adobe Photoshop, Adobe Illustrator, Proshow, Microsoft Office Suite.
- Behance Portfolio Username: Nestadesign1 (URL: https://www.behance.net/Nestadesign1)
- Contact Info: Phone is +250 782 739 381 and email is jeanesta81@gmail.com.
- Address: Shyorongi - Rulindo, Rwanda.

WEBSITE & SERVICE OFFERS INFORMATION (Answer user questions based on these):
1. Graphic Design: Tailored visual storytelling, composition, and high-impact custom illustrations.
2. Publishing Services: Beautiful typesetting, complete book layouts/designs, and digital publishing.
3. Printing Services: Top-tier digital and offset printing for corporate collaterals, books, albums, etc.
4. Album Design: Custom visual layouts for weddings, memory keepsakes, school yearbooks, and family events.
5. ID Card Design: Identification cards for businesses, NGOs, schools, and groups.
6. Business Cards: Professional corporate business cards with stunning layouts representing brands correctly.
7. Banner Printing: Outdoor banners, trade show banners, backdrops, and promotional materials.
8. T-shirt Printing: Bespoke clothes, caps, custom branded apparel to meet business or personal style.
9. Sticker Design: Brand stickers, labels, customized packaging stickers, and decals.
10. Invitation Cards: Special events (weddings, anniversaries, corporate celebrations, parties).
11. Packaging Design: Modern package boxes, custom retail wraps, and outer carton structures.
12. General ICT: Website Development, Mobile App customization, full Branding, Photography, and Videography.
13. Nesta Digital Library (Knowledge Corner - under Books section): Textbook archives, digital guides, guides on design planning, and free download resources.

MULTILINGUAL LANGUAGE RULES:
- You MUST support and answer questions in Kinyarwanda, English, French (Français), and Kiswahili (Swahili).
- ALWAYS reply in the exact language the user has asked or prefers.
  * If the user communicates in Kinyarwanda, you must answer in natural, respectful Kinyarwanda (Ikinyarwanda).
  * If the user communicates in English, you must answer in professional, helpful English.
  * If the user communicates in French (Français), you must answer in fluent, polished French.
  * If the user communicates in Kiswahili (Swahili), you must answer in classic, excellent Kiswahili.
- Be concise, welcoming, and directly guide potential hirers to the "Request Service" section of our website or offer they contact HITIMANA JEAN on +250 782 739 381.`
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
