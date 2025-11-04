import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";

const app = express();
app.use(bodyParser.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const ASSISTANT_ID = "asst_UGCeGw13kGKC0dfcJpjDnzas"; // your Assistant ID

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    // Create a new thread for each session (or reuse one if you want memory)
    const thread = await client.beta.threads.create();

    // Add the user message to the thread
    await client.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message,
    });

    // Run the Assistant
    const run = await client.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID,
    });

    // Wait for the run to complete
    let runStatus;
    do {
      runStatus = await client.beta.threads.runs.retrieve(thread.id, run.id);
      if (runStatus.status !== "completed") await new Promise(r => setTimeout(r, 1000));
    } while (runStatus.status !== "completed");

    // Get the Assistant’s response
    const messages = await client.beta.threads.messages.list(thread.id);
    const reply = messages.data[0].content[0].text.value;

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(3000, () => console.log("✅ Server running on port 3000"));
