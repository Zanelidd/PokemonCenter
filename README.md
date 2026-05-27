# 🎴 PokemonCenter

> A web application for managing your Pokémon card collection, built with React, TypeScript and Vite.

---

## 📖 Description

**PokemonCenter** is a Pokémon card collection management tool. It lets you browse, search and organize your cards using the official Pokémon TCG API.
It works with [Backend-center](https://github.com/Zanelidd/Backend-Center)

This project also served as a playground to experiment with **Zustand** (state management) and **TanStack Query** (server state management).

---

## 🚀 Tech Stack

| Category | Technologies |
|---|---|
| Framework | React 18 + TypeScript + Vite |
| State management | Zustand |
| Server state | TanStack Query v5 |
| Routing | React Router DOM v6 |
| Tables | TanStack Table |
| Pokémon API | pokemon-tcg-sdk-typescript |
| Notifications | Sonner |
| Monitoring | Sentry |
| Linting | ESLint |

---

## 📦 Prerequisites

- **Node.js** >= 18
- A local [backend](https://github.com/Zanelidd/Backend-Center) running on `http://localhost:3000` (default config)

---

## ⚙️ Installation

```bash
# 1. Clone the repository
git clone https://github.com/Zanelidd/PokemonCenter.git
cd PokemonCenter

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.sample .env
# Then fill in the values in .env
```

---

## 🔐 Environment Variables

Copy `.env.sample` to `.env` and fill in the following values:

```env
VITE_BACKEND_URL=http://localhost:3000
```

| Variable | Description |
|---|---|
| `VITE_BACKEND_URL` | Backend URL (default: `http://localhost:3000`) |

---

## 🛠️ Available Scripts

```bash
# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview

# Run the linter
npm run lint
```

---

## 📁 Project Structure

```
PokemonCenter/
├── .github/
│   └── workflows/        # CI/CD GitHub Actions
├── public/               # Static assets
├── src/                  # Application source code
├── .env.sample           # Environment variables template
├── index.html            # HTML entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 👤 Author

**Damien Arnaud** — [@Zanelidd](https://github.com/Zanelidd)

---

## 📝 License

This project is personal and experimental. No open-source license has been defined yet.
