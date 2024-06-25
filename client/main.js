import { DiscordSDK } from "@discord/embedded-app-sdk";

import "./style.css"
import rocketLogo from "/rocket.png"

let auth;

/* this is how we can access VITE_ prefixed env vars */
const discordSDK = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

setupDiscordSDK().then(() => {
  console.log("Discord SDK is authenticated.");
});

async function setupDiscordSDK() {

  await discordSDK.ready();
  console.log("Discord SDK is ready.");

  /* authorize with Discord Client */
  const { code } = await discordSDK.commands.authorize({
    client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
    response_type: "code",
    state: "",
    prompt: "none",
    scope: ["identify", "guilds"]
  });

  /* retrieve an access_token from the activity's server */
  const response = await fetch("/api/token", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ code })
  });

  const { access_token } = await response.json();

  /* authenticate with Discord Client using the access_token */
  auth = await discordSDK.commands.authenticate({ access_token });

  if (auth == null) throw new Error("Authenticate command failed");

};


document.querySelector("#app").innerHTML = `
  <div>
    <img src="${rocketLogo}" class="logo" alt="Discord" />
    <h1>Hello, World!</h1>
  </div>
`;
