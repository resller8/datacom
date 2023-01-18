## Installation

### Pre-requisite

-   nvm

    -   You need to download the nvm windows binary from this link https://github.com/coreybutler/nvm-windows/releases.
        1. Download the nvm-setup.zip and extract the application
        2. Click on the nvm-setup.exe
        3. Accept the license agreement and click next
        4. Follow through the setup by clicking next on each pages
        5. Click "Install" to install the application
        6. After installing the nvm, please restart your computer

-   nodejs v16.13.0

    -   Once you have installed the nvm as mentioned above, send the command "nvm install 16.13.0"
        to install this node version.

-   pnpm v6
    -   After nvm and nodejs version is installed, send the command "npm install -g pnpm" to install
        pnpm globally

## Setting up in your desktop

1. From a commandline or a terminal, navigate to your desired directory to host this project.
    - Recommendation: I strongly suggest to have a directory path where folders shall have no
      spaces, i.e., “C:\Users\ASUS\My Cypress“, instead convert the folder name into “My_Cypress“.
2. Clone project this project.
    - Type git clone https://github.com/resller8/datacom.git
3. After git cloning is completed, navigate to "datacom" folder.
4. Send the command pnpm install. This will install the needed packages for this cypress automation.
   Please note that for this project we are no longer using the "npm install" as it was replaced by
   "pnpm install"

## Execution

### Executing test scripts in command mode

-   When running the scripts in command line

    -   npx cypress run -b chrome -s "cypress/e2e/<script_name>.js"
        - i.e. npx cypress run -b chrome -s "cypress/e2e/api.test.automation.cy.js"

### Executing test scripts in open mode

-   Running with IDE

    -   npx cypress open
    -   select the test you want to run
