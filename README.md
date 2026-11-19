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

## How the sandbox works 🧩

This repo is a sandbox for trying out web/3D features one at a time, then combining them into small scenes, without ever touching the core.

### The four building blocks

| Block | Folder | What it is |
|---|---|---|
| **Engine** | `src/engine/` | The tiny core: renderer, frame loop, debug panel, keyboard state, cleanup. Rarely changes. |
| **Environment** | `src/environments/` | The setup a feature runs in: camera, lights, floor. `basic` (grid + orbit camera), `iso` (isometric camera), `studio` (the original cobblestone starter look). |
| **Feature** | `src/features/<name>/` | One thing you're testing: a liquid sphere, a blob shadow, a spring system. Self-contained and reusable. |
| **Demo** | `src/demos/` | A saved combination: one environment plus several features wired together. |

```
src/
  engine/         sandbox.ts (loop, cleanup, GUI), keys.ts, assets.ts
  environments/   basic.ts  iso.ts  studio.ts
  features/       iso-capsule/  blob-shadow/  direction-arrow/  cooldown-hud/
                  liquid-sphere/  starter-shapes/  fps-meter/  fullscreen/
  demos/          isoPlayground.ts  starterShowcase.ts
  main.ts         <- the only file you edit to choose what runs
```

How they relate: a **demo** is just a list of `sandbox.use(...)` calls. The first is usually an **environment**, the rest are **features**. The **engine** runs them all and removes everything they added when you're done. There is no catalog page: you pick what runs by editing `src/main.ts`.

### Test a feature on its own

Put it on the neutral `basic` environment in `src/main.ts`:

```ts
import { createSandbox } from "./engine/sandbox";
import { basicEnvironment } from "./environments/basic";
import { liquidSphere } from "./features/liquid-sphere";

const sandbox = createSandbox(document.getElementById("c") as HTMLCanvasElement);

sandbox.use(basicEnvironment()); // grid, lights, orbit camera
sandbox.use(liquidSphere());  // the thing under test

sandbox.start();
```

Run `bun run dev`. Every feature adds its own folder to the debug panel, so you can tweak its values live.

### Run a ready-made demo

```ts
import { isoPlayground } from "./demos/isoPlayground";

isoPlayground(sandbox); // instead of the two `use` lines above
```

### Create a new feature (e.g. a spring system)

1. Create `src/features/spring/index.ts`:

```ts
import * as THREE from "three";
import { defineFeature } from "../../engine/sandbox";

export const spring = (opts = { stiffness: 120, damping: 12 }) =>
  defineFeature({
    name: "Spring",
    setup(ctx) {
      const params = { ...opts };
      ctx.gui.add(params, "stiffness", 0, 500); // slider in the debug panel
      ctx.gui.add(params, "damping", 0, 50);

      const ball = new THREE.Mesh(
        new THREE.SphereGeometry(0.3),
        new THREE.MeshStandardMaterial({ color: "tomato" })
      );
      ctx.add(ball); // added to the scene, removed automatically on dispose

      ctx.onUpdate((_dt, elapsed) => {
        // simulate here; runs every frame. Placeholder: bob up and down
        ball.position.y = 1 + Math.sin(elapsed * params.stiffness * 0.02);
      });

      ctx.onDispose(() => ball.geometry.dispose()); // free GPU memory

      return { ball }; // handed back by sandbox.use(), so demos can wire features together
    },
  });
```

2. Test it in `src/main.ts` with `sandbox.use(basicEnvironment()); sandbox.use(spring());`.
3. When it works, combine it with others in a demo.

### Create a demo

`src/demos/springDemo.ts`:

```ts
import type { Demo } from "../engine/sandbox";
import { basicEnvironment } from "../environments/basic";
import { spring } from "../features/spring";
import { blobShadow } from "../features/blob-shadow";

export const springDemo: Demo = (sandbox) => {
  sandbox.use(basicEnvironment());
  const s = sandbox.use(spring({ stiffness: 300, damping: 8 }));
  sandbox.use(blobShadow({ target: s.ball })); // output of one feature feeds another
};
```

### What a feature can use (`ctx`)

| | |
|---|---|
| `ctx.add(...objects)` | Add to the scene; removed on dispose |
| `ctx.gui` | A debug-panel folder named after the feature |
| `ctx.onUpdate(fn)` | Every frame: `(dt, elapsed)`. For things that move |
| `ctx.onLateUpdate(fn)` | Every frame, after all `onUpdate`s. For things that follow: cameras, shadows, HUDs |
| `ctx.onResize(fn)` | Canvas size changed |
| `ctx.onDispose(fn)` | Your own cleanup (listeners, DOM, GPU memory) |
| `ctx.keys` | Which keyboard keys are held |
| `ctx.scene`, `ctx.camera`, `ctx.setCamera()`, `ctx.renderer`, `ctx.canvas` | Direct access when needed |

### Rules that keep features reusable

- A feature only touches the page through `ctx`. No globals, and nothing that runs just because a file was imported.
- Features don't import each other. If one needs another (a shadow following a capsule), the demo passes it in as an option.
- `engine/` never imports from environments, features or demos.
- Everything a feature creates (listeners, DOM, geometry, materials) is released in `onDispose`.

## Building Your Project 🏗️

To build the project for production:

```bash
bun run build
```
## Contributing 🤝

Contributions are always welcome! Feel free to open a pull request or an issue.

## License 📄

This project is licensed under the MIT License.
