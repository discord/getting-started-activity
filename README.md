# Discord Activity: Getting Started Guide

This template is used in the [Building An Activity](https://discord.com/developers/docs/activities/building-an-activity) tutorial in the Discord Developer Docs.

Read more about building Discord Activities with the Embedded App SDK at [https://discord.com/developers/docs/activities/overview](https://discord.com/developers/docs/activities/overview).

## Setup:
- visit the [discord developer portal/applications](https://discord.com/developers/applications)
- create your app there
- `cd` into your codebase
- run `"VITE_DISCORD_CLIENT_ID=YOUR_DISCORD_CLIENT_ID_HERE
DISCORD_CLIENT_SECRET=YOUR_DISCORD_CLIENT_SECRET" >> .env`
  - entering the values you got from the discord developer portal
- `cd client`
- `npm i`
- check for `"@discord/embedded-app-sdk": "^1.2.0"` in your `.\client\package.json`
  - if it is missing run `npm install @discord/embedded-app-sdk`
- `cd ..`
- `cd server`
- `npm i`

## Tunnel:
- [Discord recommends `cloudflared`](https://github.com/cloudflare/cloudflared?tab=readme-ov-file#installing-cloudflared)
- i used [localtunnel](https://theboroer.github.io/localtunnel-www/)
  - run `npm i -g localtunnel` (if you don't already have it globally installed)
  - run `lt --port 5173` or whatever port your vite `npm run dev` generates
