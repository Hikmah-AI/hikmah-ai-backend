const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();
app.use(express.json());
app.use(cors());

console.log(
  "Loaded OpenAI API Key:",
  process.env.HIKMAH_OPENAI_API_KEY ? "YES" : "NO"
);

const openai = new OpenAI({
  apiKey: process.env.HIKMAH_OPENAI_API_KEY,
});

app.post("/ask-hikmah", async (req, res) => {
  console.log("Received message:", req.body.message);
  const userMessage = req.body.message;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are Hikmah AI, a helpful assistant who answers only Islam-related questions based strictly on the Quran and authentic Hadith. If asked about anything haram, political, or irrelevant, politely decline.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const botReply = completion.choices[0].message.content;
    console.log("Replying with:", botReply);
    res.json({ reply: botReply });
  } catch (error) {
    console.error("Error in /ask-hikmah:", error);
    res
      .status(500)
      .json({ reply: `Sorry, there was a server error: ${error.message}` });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Hikmah AI backend running on port ${PORT}`);
});
