import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",           // ✅ disables unused imports/vars
      "@typescript-eslint/no-explicit-any": "off",          // ✅ disables `any` errors
      "@typescript-eslint/no-namespace": "off",             // ✅ allows `namespace`
      "react-hooks/exhaustive-deps": "off",                 // ✅ disables useEffect dependency checks
    },
  },
];

export default eslintConfig;
