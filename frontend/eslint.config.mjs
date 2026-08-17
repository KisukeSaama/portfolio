import eslint from "@eslint/js";
import globals from "globals";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["build/**", ".react-router/**", "coverage/**", "playwright-report/**"] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: { parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname }, globals: { ...globals.browser, ...globals.node } },
    plugins: { "jsx-a11y": jsxA11y, "react-hooks": reactHooks },
    rules: { ...jsxA11y.flatConfigs.recommended.rules, ...reactHooks.configs.flat.recommended.rules, "@typescript-eslint/no-misused-promises": ["error", { "checksVoidReturn": { "attributes": false } }] },
  },
  { files: ["**/*.test.{ts,tsx}", "tests/**/*.ts"], rules: { "@typescript-eslint/no-unsafe-assignment": "off", "@typescript-eslint/no-unsafe-call": "off", "@typescript-eslint/no-unsafe-member-access": "off" } }
);
