module.exports = {
  "root": true,
  "env": {
    "node": true
  },
  "extends": [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/airbnb"
  ],
  "parserOptions": {
    "parser": "babel-eslint"
  },
  "rules": {
    "max-classes-per-file": 0,
    "class-methods-use-this": "warn",
    "semi": 0,
    "comma-dangle": 0,
    "prefer-template": "warn",
    "object-curly-newline": 0,
    "no-else-return": "warn",
    "object-shorthand": 0,
    "prefer-const": "warn",
    "radix": 0,
    "no-param-reassign": "warn",
    "no-extra-semi": 0,
    "max-len": 0,
    "no-underscore-dangle": 0,
    "no-prototype-builtins": 0,
    "no-return-assign": 0,
    "arrow-parens": 0,
    "prefer-destructuring": 0,
    "import/extensions": 0,
    "func-names": 0,
    "camelcase": "off",
    "no-console": "off",
    "no-shadow": [
      "error",
      {
        "allow": ["state"]
      }
    ],
    "import/no-unresolved": [
      2,
      {
        "caseSensitive": false
      }
    ]
  },
  "overrides": [
    {
      "files": [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)"
      ],
      "env": {
        "jest": true
      }
    }
  ]
}