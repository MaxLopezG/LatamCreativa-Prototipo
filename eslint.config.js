import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
    // Global ignores
    {
        ignores: [
            "dist/**",
            "node_modules/**",
            "functions/**",
            "*.config.js",
            "*.config.ts",
            "src/dataconnect-generated/**"
        ]
    },

    // Base ESLint recommended rules
    eslint.configs.recommended,

    // TypeScript recommended rules
    ...tseslint.configs.recommended,

    // Global settings for all files
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.es2021
            },
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module"
            }
        }
    },

    // Custom rules for the project
    {
        files: ["**/*.{ts,tsx}"],
        rules: {
            // Allow unused vars with underscore prefix
            "@typescript-eslint/no-unused-vars": ["warn", {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_"
            }],

            // Allow any type (gradually migrate to stricter types)
            "@typescript-eslint/no-explicit-any": "warn",

            // Relaxed rules for existing codebase
            "@typescript-eslint/no-empty-object-type": "off",
            "@typescript-eslint/no-unused-expressions": "off",

            // Console statements allowed in dev
            "no-console": "off",

            // Allow empty catch blocks
            "no-empty": ["error", { allowEmptyCatch: true }]
        }
    }
);
