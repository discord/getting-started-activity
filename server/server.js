import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config({ path: "../.env" });

const app = express();
const port = 3001;

// Allow express to parse JSON bodies
app.use(express.json());

app.post("/api/token", async (req, res) => {
  const code = req.body.code;

  if (!code) {
    return res.status(400).send({ error: "Missing authorization code" });
  }

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
      code,
    }),
  });

  // Retrieve the access_token from the response
  const data = await response.json();

  if (!response.ok || !data.access_token) {
    return res.status(response.status).send({ error: data.error ?? "Token exchange failed" });
  }

  // Return the access_token to our client as { access_token: "..."}
  res.send({ access_token: data.access_token });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
