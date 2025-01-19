
# **Frontend - React Application**

This is the **frontend** part of the monorepo, built with **React**, **TypeScript**, **Vite**, and **Material-UI**.

---

## **Project Structure**

```
frontend/
├── public/                # Static files (e.g., favicon, index.html)
├── src/
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components for routing
│   ├── store/             # Redux store and slices
│   ├── styles/            # Global styles and theme files
│   ├── App.tsx            # Main App component
│   ├── main.tsx           # Application entry point
│   └── vite-env.d.ts      # Vite-specific TypeScript definitions
├── package.json           # Frontend-specific dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

---

## **Getting Started**

### Prerequisites

Ensure you have **pnpm** installed globally:
```bash
npm install -g pnpm
```

---

### Installation

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

---

### **Available Scripts**

- **Start Development Server**:
  ```bash
  pnpm run dev
  ```

- **Build for Production**:
  ```bash
  pnpm run build
  ```

- **Preview Production Build**:
  ```bash
  pnpm run preview
  ```

- **Lint the Code**:
  ```bash
  pnpm run lint
  ```

---
## **Running the Applidation**

1. Start the development server:
  ```bash
  pnpm dev
  ```
1. The server should be running on
  ```bash
  http://localhost:5173
  ```  
---

## **Technologies Used**

- **React**: Front-end library for building user interfaces.
- **TypeScript**: Typed JavaScript for improved developer experience.
- **Vite**: Modern development build tool for fast HMR.
- **Material-UI (MUI)**: Component library for modern, responsive design.
- **Redux Toolkit**: Simplified state management.
- **ESLint & Prettier**: Code quality and formatting tools.

---

## **Customization**

### Adding Dependencies

To add a new dependency for the frontend:
```bash
pnpm add <package-name>
```

To add a development dependency:
```bash
pnpm add -D <package-name>
```


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

---

## **License**

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## **Contact**

For questions or collaboration, feel free to contact:

- **Name**: [Mirjana Milosevic]
- **Email**: [mira.milosevic@gmail.com]
- **GitHub**: [[GitHub Profile](https://github.com/programira)]
