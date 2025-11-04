import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Connect to OpenAI
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const ASSISTANT_ID = "asst_UGCeGw13kGKC0dfcJpjDnzas"; // your Assistant ID

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const thread = await client.beta.threads.create();

    await client.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message,
    });

    const run = await client.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID,
    });

    let runStatus;
    do {
      runStatus = await client.beta.threads.runs.retrieve(thread.id, run.id);
      if (runStatus.status !== "completed")
        await new Promise((r) => setTimeout(r, 1000));
    } while (runStatus.status !== "completed");

    const messages = await client.beta.threads.messages.list(thread.id);
    const reply = messages.data[0].content[0].text.value;

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
