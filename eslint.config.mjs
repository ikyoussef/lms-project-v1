import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals"; // C'est une bonne pratique de définir les globals

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.FlatConfig[]} */
const eslintConfig = [
  // On commence par la configuration globale d'ignorance
  {
    ignores: [
        "node_modules/",
        ".next/",
        "lib/generated/", // <-- LA LIGNE LA PLUS IMPORTANTE
    ]
  },

  // Ensuite, on applique les configurations étendues
  ...compat.extends("next/core-web-vitals"),

  // Configuration pour les fichiers TypeScript
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: true,
      },
      globals: {
          ...globals.browser,
          ...globals.node,
      }
    },
    // Vous pouvez ajouter des règles spécifiques ici si nécessaire
    // rules: {
    //   "@typescript-eslint/no-unused-vars": "warn"
    // }
  },
];

export default eslintConfig;