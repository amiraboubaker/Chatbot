const PORT = 8000;
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_API_KEY);

// Function to split the text into chunks
const splitTextIntoChunks = (text, maxLength) => {
  const words = text.split(" ");
  let currentLine = "";
  const lines = [];

  words.forEach((word) => {
    // Check if adding the next word exceeds the maximum length
    if ((currentLine + word).length > maxLength) {
      lines.push(currentLine.trim()); // Push the current line to the lines array
      currentLine = word + " "; // Start a new line with the current word
    } else {
      currentLine += word + " "; // Add the word to the current line
    }
  });

  if (currentLine) {
    lines.push(currentLine.trim()); // Push the last line if it's not empty
  }

  return lines.join("\n"); // Join the lines with new line characters
};

// Function to limit the text response to a maximum number of characters
const limitResponseLength = (text, maxLength) => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

app.post("/geimini", async (req, res) => {
  console.log(req.body.history);
  console.log(req.body.message);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({
      history: req.body.history,
    });

    const msg = req.body.message;
    const result = await chat.sendMessage(msg);

    // Check if the result has a response
    if (result.response) {
      const text =
        typeof result.response.text === "function"
          ? await result.response.text()
          : result.response.text;

      // Limit the response to a certain number of characters
      const limitedResponse = limitResponseLength(text, 200); // Set a max length of characters

      // Send the limited response as plain text
      res.send(limitedResponse);
    } else {
      res.status(500).send("Unexpected response format");
    }
  } catch (error) {
    console.error("Error in API call:", error);
    res.status(500).send("Error processing request");
  }
});


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
