require("@babel/register")({
    presets: ["@babel/preset-env"],
    plugins: [
        // Stage 2
        ["@babel/plugin-proposal-decorators", {
            legacy: true,
        }],
        "@babel/plugin-proposal-function-sent",
        "@babel/plugin-proposal-export-namespace-from",
        "@babel/plugin-proposal-numeric-separator",
        "@babel/plugin-proposal-throw-expressions",

        // Stage 3
        ["@babel/plugin-proposal-class-properties", {
            loose: false,
        }],
    ],
});

require('babel-polyfill');

// Import the rest of our application.
module.exports = require("./index.js");
