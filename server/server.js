import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config({ path: "../.env" });
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from "url";

const app = express();
const port = 3001;

// Allow express to parse JSON bodies
app.use(express.json());

// LOAD ALL QUOTES FROM FILES ==============================================//
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const [outputData, nonQuotedData] = await Promise.all([
    fs.readFile(path.join(__dirname, 'parsed-quotes.ini'), 'utf-8'),    // Path to output.ini
    fs.readFile(path.join(__dirname, 'nonquoted.txt'), 'utf-8')  // Path to nonquoted.txt
]);
const outputLines = outputData.split('\n').filter(line => line.trim() !== '');
const authors = nonQuotedData.split('\n').filter(line => line.trim() !== '');
const quotes = outputLines.map(line => {
    const nonQuoteMatch = line.match(/\[(.*?)\]/); // Match text inside square brackets
    const quoteMatch = line.match(/"(.*?)"/); // Match text inside quotes

    if (nonQuoteMatch && quoteMatch) {
        return {
            nonQuote: nonQuoteMatch[1],
            quote: quoteMatch[1]
        };
    }
    return null;
}).filter(item => item !== null);

// GET REQUESTS ==============================================//
app.get("/all_quotes", async (req, res) => {
  res.send([quotes, authors]);
});

// POST REQUESTS ==============================================//
app.post("/api/token", async (req, res) => {
  
  // Exchange the code for an access_token
  const response = await fetch(`https://discord.com/api/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.VITE_DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code: req.body.code,
    }),
  });

  // Retrieve the access_token from the response
  const { access_token } = await response.json();

  // Return the access_token to our client as { access_token: "..."}
  res.send({access_token});
});

// HEY, LISTEN! ==============================================//
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
