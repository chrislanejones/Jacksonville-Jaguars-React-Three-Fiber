# Jacksonville Jaguars React Three Fiber

![Orbs with the Jacksonville Jaguars Logo](/public/Jaguars-Orbs-Demo.webp)

View on CodeSandbox [jacksonville-jaguars-object-clump](https://codesandbox.io/p/sandbox/jacksonville-jaguars-object-clump-forked-xdmpmq?file=%2Fsrc%2FApp.js)

A visually stunning React Three Fiber experience featuring glass orbs with the Jacksonville Jaguars logo, driven by physics simulation and mouse/touch interaction.

## ✨ Features

- **Physics-Driven Orbs**: 40 (desktop) / 20 (mobile) glass spheres with realistic gravity and collision detection
- **Interactive Control**: Move your mouse (or touch on mobile) to push the orbs around
- **High-Quality Glass Material**: Physically-based transmission, refraction, and clearcoat for photorealistic appearance
- **Environment Mapping**: Jacksonville Skyline reflected and refracted through the glass
- **Animated Background**: Smooth "Prowl" gradient animation that shifts across the screen
- **Mobile Optimized**: Adaptive sphere count and performance tuning for all devices
- **Post-Processing Effects**: Screen-space ambient occlusion (N8AO) and temporal anti-aliasing (SMAA)

## 🎮 Interaction

- **Desktop**: Move your mouse to control the invisible physics "hand" that pushes orbs
- **Mobile**: Swipe and drag across the screen to interact with the orbs
- The orbs naturally spring back to the center due to a soft constraint force

## 🏗️ Architecture

The project is cleanly organized into modular components:

src/
├── components/
│ ├── Scene.tsx # Main R3F scene, lighting, and physics setup
│ ├── Clump.tsx # Instanced mesh physics bodies with glass material
│ ├── Bounds.tsx # Physics world boundaries (6 planes)
│ └── Pointer.tsx # Mouse/touch input handler
├── utils/
│ └── useJaguarDecal.ts # Custom hook for generating the logo texture
├── App.tsx # Canvas wrapper and entry point
└── index.css # Animated background + full-screen styling

## 🚀 Performance Highlights

- **Instanced Rendering**: Single draw call for all 40 glass spheres
- **Clamped Device Pixel Ratio**: Maximum 1.5x DPR to prevent mobile GPU melt
- **Adaptive Sphere Count**: Automatically reduces to 20 orbs on screens < 768px wide
- **Efficient Physics**: Uses SAP broadphase with 20 solver iterations
- **No HTML Canvas Drawing in Every Frame**: Decal texture is generated once during load

## 🎨 Visual Details

| Property                  | Value                  |
| ------------------------- | ---------------------- |
| Glass IOR                 | 1.45                   |
| Transmission              | 100%                   |
| Roughness                 | 0.06                   |
| Clearcoat                 | 1.0                    |
| Attenuation Color         | Jaguars Teal (#006778) |
| Environment Map Intensity | 1.6x                   |

The animated background uses a radial gradient with an easing animation that creates a "breathing" stadium-like atmosphere.

## 📦 Dependencies

- `react` - UI framework
- `three` - 3D graphics engine
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/cannon` - Physics engine integration
- `@react-three/drei` - Useful R3F helpers (textures, post-processing)
- `@react-three/postprocessing` - High-quality post-processing effects

## 🔧 Getting Started

```bash
# Clone or fork the project
git clone <repo-url>
cd jacksonville-jaguars-orbs

# Install dependencies
pnpm install

# Start dev server
pnpm run dev

# Build for production
pnpm build
```
