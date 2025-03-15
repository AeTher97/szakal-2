const {defineConfig} = require("cypress");

module.exports = defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
    env: {
        baseUrl: "5758-172-183-218-18.ngrok-free.app"
    }
});
