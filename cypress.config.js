const { defineConfig } = require('cypress');

module.exports = defineConfig({
  chromeWebSecurity: false,
  screenshotOnRunFailure: false,
  video: false,
  defaultCommandTimeout: 60000,
  pageLoadTimeout: 6000,
  responseTimeout: 180000,
  taskTimeout: 600000,
  watchForFileChanges: false,
  e2e: {
    specPattern: 'cypress/e2e',
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.name === 'chrome') {
          launchOptions.args.push('--disable-dev-shm-usage');
        } else if (browser.name === 'electron') {
          // auto open devtools
          launchOptions.preferences.devTools = true;
          launchOptions.args['disable-dev-shm-usage'] = true;
        }

        // whatever you return here becomes the launchOptions
        return launchOptions;
      });
    },
    experimentalRunAllSpecs: true,
    experimentalModifyObstructiveThirdPartyCode: true
  }
});
