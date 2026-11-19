# 🪵 Three.js Starter with Bun, TypeScript & Vite 🚀

[Starter Scene](https://github.com/j1m-ryan/threejs-starter-bun/assets/20595836/c7e5c8f7-ea47-4ee3-b55c-403d4998c7a4)


## Introduction 📖

Welcome to the Three.js Starter Repo! This repository is designed to get you up and running with Three.js using the modern and efficient Bun runtime, TypeScript for type-safe code, and Vite for blazing-fast build times. Perfect for 3D web projects! 🌐
Features ⭐

- Three.js: Create beautiful and interactive 3D content. 🎨
- Bun: A fast, modern JavaScript runtime. 🧅
- TypeScript: Strongly typed programming language built on JavaScript. 🔒
- Vite: Next-generation frontend tooling. 🔨

## Prerequisites 🛠️

Before you begin, make sure you have the following installed:

 - bun

## Installation 📦

You can create a repo using the `Use this template` button the repo, or alternatively:  

Clone the repository:

    
```bash
git clone https://github.com/j1m-ryan/threejs-starter-bun.git
```

Navigate to the repository directory:

```bash
cd threejs-starter-bun
```
Install dependencies using Bun:

```bash
bun install
```
## Usage 🚀

Start the development server:

```bash
bun run dev
```
Open your browser and visit http://localhost:5173.

## How the sandbox is organised 🧩

This repo is a sandbox for trying out web/3D features in isolation and then combining them.

```
src/
  engine/      the small core: renderer, frame loop, GUI, keys, cleanup. Rarely changes.
  backdrops/   reusable environments (camera, lights, ground): basic, iso, studio
  features/    one folder per thing you're testing (iso-capsule, liquid-sphere, blob-shadow, ...)
  dioramas/    small scenes that combine a backdrop with several features
  main.ts      pick what to run
```

**Test one feature on its own** by editing `src/main.ts`:

```ts
sandbox.use(basicBackdrop());
sandbox.use(liquidSphere());
```

**Run a diorama:**

```ts
isoPlayground(sandbox);
```

**Add a feature** by creating `src/features/<name>/index.ts`:

```ts
export const spring = (opts = { stiffness: 120 }) =>
  defineFeature({
    name: "Spring",
    setup(ctx) {
      const params = { ...opts };
      ctx.gui.add(params, "stiffness", 0, 500); // tweak live
      const ball = new THREE.Mesh(/* ... */);
      ctx.add(ball); // removed automatically on dispose
      ctx.onUpdate((dt) => { /* simulate */ });
      return { ball }; // returned from sandbox.use(), so dioramas can wire features together
    },
  });
```

Rules that keep features reusable:

- A feature only touches the page through `ctx` (scene, gui, keys, onUpdate, onDispose...). Never create globals when a module is imported.
- Features don't import each other. If one needs another (a shadow following the capsule), the diorama passes it in as an option.
- `engine/` never imports from backdrops, features or dioramas.
- Use `onUpdate` for things that move and `onLateUpdate` for things that follow (cameras, shadows, HUDs), so `use()` order rarely matters.

## Building Your Project 🏗️

To build the project for production:

```bash
bun run build
```
## Contributing 🤝

Contributions are always welcome! Feel free to open a pull request or an issue.

## License 📄

This project is licensed under the MIT License.
