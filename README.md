# React + TypeScript + Vite

## Deploy su GitHub Pages

Il progetto e' configurato per pubblicare automaticamente su GitHub Pages tramite GitHub Actions.

1. Fai push su `main` (il workflow e' in `.github/workflows/deploy.yml`).
2. In GitHub apri `Settings > Pages`.
3. In `Build and deployment`, imposta `Source: GitHub Actions`.
4. Attendi il completamento del workflow `Deploy to GitHub Pages` nella tab `Actions`.

Nota: la `base` di Vite viene calcolata automaticamente per GitHub Pages usando il nome repository.

### Coerenza lockfile (npm)

Per evitare errori `npm ci` in GitHub Actions, il repository e' fissato a `npm@10.9.4` (vedi `package.json` e workflow).
Quando aggiorni dipendenze o lockfile, usa npm 10.9.4.
Inoltre e' presente un check dedicato (`.github/workflows/ci-lockfile.yml`) che valida `npm ci` su ogni push e pull request.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Debug da altro dispositivo (stessa rete)

1. Avvia Vite in LAN:

```bash
npm run dev:lan
```

2. Trova l'IP locale del tuo computer (es. `192.168.1.24`).
3. Dal telefono/tablet collegato alla stessa rete apri:

```text
http://<IP_LOCALE>:5173
```

Note rapide:
- PC e dispositivo devono essere sulla stessa rete Wi-Fi/LAN.
- Se non si apre, controlla firewall/VPN o isolamento client del router.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
