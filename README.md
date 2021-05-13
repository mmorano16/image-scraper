# image-scraper
Web scraper that utilizes Node.js Puppeteer to navigate through a website's login screen and enter user credentials. 
Images on the page that is navigated to are downloaded to the directory that the program is located. Has functionality to both scroll to the bottom of the page to load more images or press a button to navigate to a new page.

**Requires node modules fs, express, https, puppeteer and puppeteer-autoscrol-down**

**use npm i *module_name* to download needed modules**

Launches a chromium browser and navigates to url entered in 'page.goto()'

In order for the program to enter credentials, the selectors for username and password must be entered into page.type(). Use dev tools to select the input fields and click on them and right click and click copy selector and paste that into the program.

Credentials are pulled from the credentials.js file and is input into the chromium browser and login button is pressed.

Images are stored in an array and downloaded with file name being how they are stored on the site. 
