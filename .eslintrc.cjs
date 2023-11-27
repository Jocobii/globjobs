module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "ignorePatterns": [
    "dist/**/*",
    "dist-electron/**/*",
    "node_modules/**/*",
    "vite.config.ts",
    "certs/**/*"
  ],
  "extends": [
    "plugin:react/recommended",
    "airbnb",
    "airbnb-typescript",
    "plugin:sonarjs/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": ["tsconfig.json", "tsconfig.node.json"],
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["react", "@typescript-eslint", "sonarjs"],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "import/no-extraneous-dependencies": "off",
    "react/require-default-props": "off",
    "no-restricted-exports": "off",
    "no-param-reassign": [
      "error",
      { "props": true, "ignorePropertyModificationsFor": ["event", "request"] }
    ],
    "import/prefer-default-export": "off"
  },
  "settings": {
    "import/resolver": {
      "node": {
        "paths": ["src"],
        "moduleDirectory": ["node_modules/", "src/"],
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  }
}
