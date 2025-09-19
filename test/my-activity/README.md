<p align="center">✨ <strong>Generated with <a href="https://robojs.dev/create-robo">create-robo</a> magic!</strong> ✨</p>

---

# Hiya, my-activity 🌈

Welcome to your fresh **[Robo.js](https://robojs.dev)** project!

Build, deploy, and maintain your **Discord Activities** with ease. With **Robo.js** as your guide, you'll experience a seamless, **[file-based setup](https://robojs.dev/discord-activities/file-structure)**, an **[integrated database](https://robojs.dev/robojs/flashcore)**, **[TypeScript support](https://robojs.dev/robojs/typescript)**, and a **[rich ecosystem](https://robojs.dev/plugins/overview)**.

_Ready to embark on this adventure?_

## Table of Contents

- [🔗 Quick Links](#🔗-quick-links)
- [✨ Getting Started](#✨-getting-started)
- [🛠️ App Development](#️🛠️-app-development)
- [🔒 Authentication](#🔒-authentication)
- [🛠️ Backend Development](#️🛠️-backend-development)
- [📁 Folder Structure](#📁-folder-structure)
- [🔌 Ecosystem](#ecosystem)
- [🚀 Hosting](#hosting)

## 🔗 Quick Links

- [📚 **Documentation:** Getting started with Robo.js](https://robojs.dev/discord-activities)
- [✨ **Discord:** Robo - Imagine Magic](https://robojs.dev/discord)
- [🔗 **Templates:** Kickstart your project with a template.](https://robojs.dev/plugins/create)
- [📖 **Tutorials:** Learn how to create epic experiences.](https://dev.to/waveplay)

## Running

Run development mode with:

```bash
npm run dev
```

> **Notes:** A free Cloudflare tunnel is included for easy testing. You can copy and paste it into activity's **[URL mapping](https://robojs.dev/discord-activities/proxy#url-mapping)** to test things out.

- [🔰 **Beginner Guide:** New to Discord Bots with Robo? Start here!](https://robojs.dev/discord-bots/beginner-guide)
- [🎭 **Run Modes:** Define profiles for your Robo session.](https://robojs.dev/robojs/mode#default-modes)

## App Development 🛠️

You can find your client-side code in the `/src/app` folder. This is where you can build your web app using React, Vue, or any other front-end framework.

Things are powered by **Vite** under the hood, so you get the latest ES modules, hot module reloading, and more! ⚡

Try editing the `main` file to get started! (`Activity.tsx` if you're using React)

#### Authenticating

The React template makes it easy to authenticate your activity with Discord. The `<DiscordProvider>` components in `App.tsx` accepts `authenticate` and `scope` props.

```tsx
<DiscordContextProvider authenticate scope={['identify', 'guilds']}>
	<Activity />
</DiscordContextProvider>
```

You can then get the SDK and other goodies from the `useDiscordSdk` hook!

- [🔒 **Authentication:** Customize your user experience.](https://robojs.dev/discord-activities/authentication)

## Backend Development 🛠️

Your server-side code is located in the `/src/api` folder. This is where you can build your API, webhooks, and other fancy server-side features.

This backend is powered by [**@robojs/server**](https://robojs.dev/plugins/server) - a powerful Robo plugin that creates an manages a Node `http` server for you. If you install Fastify, the server will automatically switch to it for better performance!

Everything Robo is file-based, so you can create new routes by making new files in the `/src/api` directory. The file's name becomes the route's path. For example, let's try making a new route at `/health` by creating a new file named `health.js`:

```js
export default () => {
	return { status: 'ok' }
}
```

- [🔌 **@robojs/server:** Create and manage web pages, APIs, and more.](https://robojs.dev/plugins/server)

## Folder Structure 📁

While the `api` and `app` folders are reserved for your server and client-side code, you are free to create anything else in the `/src` directory!

Folders only become reserved when you install a plugin that uses them. For example, bot functionality uses the `commands` and `events` folders.

## Robo Ecosystem

By building with **Robo.js**, you gain access to a growing ecosystem of **[plugins](https://robojs.dev/plugins/directory)**, **[templates](https://robojs.dev/templates/overview)**, and **[tools](https://robojs.dev/cli/overview)**. **[Robo Plugins](https://robojs.dev/plugins/overview)** are special. They can add features with one command.

```bash
npx robo add @robojs/ai @robojs/sync
```

Plugins integrate seamlessly thanks to the **[Robo File Structure](https://robojs.dev/discord-bots/file-structure)**. What's more, anyone can **[create a plugin](https://robojs.dev/plugins/create)**.

- [🔌 **Robo Plugins:** Add features to your Robo seamlessly.](https://robojs.dev/plugins/install)
- [🔌 **Creating Plugins:** Make your own plugins for Robo.js.](https://robojs.dev/plugins/create)
- [🗃️ **Plugin Directory:** Browse plugins for your Robo.](https://robojs.dev/plugins/create)
- [🔗 **Templates:** Kickstart your project with a template.](https://robojs.dev/plugins/create)

## Hosting

**Hosting** your project keeps it running 24/7. No need to keep your computer on at all times, or worry about your Internet connection.

You can host on any platform that supports **Node.js**, or run [`robo deploy`](https://robojs.dev/cli/robo#distributing) to host on **[RoboPlay](https://roboplay.dev)** - a hosting platform optimized for **Robo.js**.

```bash
npm run deploy
```

- [🚀 **RoboPlay:** Deploy with as little as one command.](https://robojs.dev/hosting/roboplay)
- [🛠️ **Self-Hosting:** Learn how to host and maintain it yourself.](https://robojs.dev/hosting/overview)
