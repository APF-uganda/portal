# APF Service Portal

A modern web portal for the Accountancy Practitioners Forum (APF Uganda) built with React, TypeScript, and Vite.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation frontend tooling
- **Material-UI** - Component library
- **React Router** - Client-side routing
- **Axios** - HTTP client

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the portal directory:
   ```bash
   cd portal
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

The app will open at [http://localhost:3000](http://localhost:3000)

Features:
- ⚡ Lightning-fast Hot Module Replacement (HMR)
- 🔥 Instant server start
- 💪 Full TypeScript support

### Building for Production

Build the app for production:

```bash
npm run build
```

The optimized build will be output to the `dist/` folder.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Testing

Run tests:

```bash
npm test
```

## Project Structure

```
portal/
├── public/           # Static assets
├── src/
│   ├── assets/      # Images and media files
│   ├── components/  # React components
│   ├── pages/       # Page components
│   ├── App.tsx      # Main app component
│   ├── main.tsx     # Application entry point
│   └── index.css    # Global styles
├── index.html       # HTML template
├── vite.config.ts   # Vite configuration
└── tsconfig.json    # TypeScript configuration
```

## Environment Variables

Create a `.env` file in the portal root for environment-specific variables:

```env
VITE_API_URL=your_api_url_here
```

Access them in your code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

## Key Features

- Responsive design
- Modern UI with Material-UI components
- Type-safe codebase with TypeScript
- Fast development experience with Vite
- Optimized production builds

## Learn More

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Material-UI Documentation](https://mui.com/)

## Migration Notes

This project was migrated from Create React App to Vite + TypeScript. See [MIGRATION.md](./MIGRATION.md) for details about the migration process.
