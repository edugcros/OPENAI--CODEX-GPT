import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";

dotenv.config();

const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
  console.error("OPENAI_API_KEY is not set.");
  process.exit(1);
}

const configuration = {
  apiKey: openaiApiKey,
};
const openai = new OpenAI(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello Edu!",
  });
});

app.post("/generate", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    console.log(prompt);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `sos un asistente sobre el clima de Argegtina. si te preguntan de otro pais responder 'no lo sé'`,
        },
        { role: "assistant", content: "Mi nombre es Eduardo" },
        { role: "user", content: prompt },
      ],
      // temperature: 0,
      max_tokens: 100,
      // top_p: 1,
      // frequency_penalty: 0.5,
      // presence_penalty: 0,
    });

    const bot = response.choices[0].message.content;

    res.status(200).send({ status: "OK", data: bot });
  } catch (error) {
    console.error(error?.message || error);
    res.status(500).send(error || "Something went wrong");
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
