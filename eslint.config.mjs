import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
    {
        extends: [eslint.configs.recommended, tseslint.configs.recommended],
        // https://eslint.org/docs/latest/rules/
        rules: {
            "array-callback-return": "error",
        },
        ignores: ["dist/*"],
    },
]);
