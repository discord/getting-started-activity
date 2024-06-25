import { DiscordSDK } from "@discord/embedded-app-sdk";

import "./style.css"
import rocketLogo from "/rocket.png"

const discordSDK = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

setupDiscordSDK().then(() => {
  console.log("Discord SDK is ready.");
});

async function setupDiscordSDK() {
  await discordSDK.ready();
};

document.querySelector("#app").innerHTML = `
  <div>
    <img src="${rocketLogo}" class="logo" alt="Discord" />
    <h1>Hello, World!</h1>
  </div>
`;
