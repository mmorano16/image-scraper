var express = require('express');
var port = process.env.PORT||1409;
const app = express();

function DoStuff() {
    const puppeteer = require('puppeteer');
    const CREDS = require('./constants');
    const https = require('https');
    const fs = require('fs');
    const scroll = require('puppeteer-autoscroll-down');

    async function main() {
        //declaration for download
        const download  = ( url, destination ) => new Promise( ( resolve, reject ) => {
            const file = fs.createWriteStream( destination );
            https.get( url, response => {
                response.pipe( file );
                file.on( 'finish', () =>{
                    file.close( resolve( true ) );
                });
            })
            .on( 'error', error => {
                fs.unlink( destination );
                reject( error.message );
            });
        });
        //opens chromium browser, can interact with the page but is mainly to show where in the process the program is
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.setViewport({width: 1200, height: 720})
        //directs to url
        await page.goto('page url', { waitUntil: 'networkidle0' });
        //click login button if has one
        await Promise.all([
            page.click('login button selector'),
            page.waitFor(5000),
        ]);
        //need to change selector for each site
        //change login credentials in 'constants.js' file
        await page.type('username selector', CREDS.username);//enters username
        await page.type('password selector', CREDS.password);//enters password
        // click and wait for navigation. copy selectors from page to navigate
        await Promise.all([
            page.click('login button selector'),
            page.waitFor(5000),
        ]);
        //use promises for navigating to each new page
        /*await Promise.all([
            page.click('selector for next page button'),
            page.waitFor(5000)//may not need this
        ]);*/
        //scrolls to bottom of the page and waits 5 sec for all elements to load
        /*await Promise.all([
            scroll(page),
            page.waitFor(5000)
        ]);*/
        
        //fills array with every image from the page
        const temp = await page.evaluate( () => Array.from(document.images, e => e.src));
        //filters out duplicates in the array
        images = temp.filter(function(elem, pos) {
            return temp.indexOf(elem) == pos;
        })
        //prints content of images
        /*for(let i=0;i<images.length;i++)
            console.log(images[i]);*/

        //downloads each image, outputs success/error for each
        console.log(images.length + " images found");
        let result
        for(let i=0;i<images.length;i++){
            //in case of images with special characters that need to be removed
            //may need to be change or not need at all for each site
            if(images[i].indexOf('?') > -1)
                result = await download(images[i], images[i].substring(images[i].lastIndexOf("/")+1, images[i].indexOf("?"))+".png");
            else  //cuts out https... and saves image as is on site
                result = await download(images[i], images[i].substring(images[i].lastIndexOf("/")+1));
            if(result === true)
                console.log('Success: ', images[i], ' has been downloaded successfully.');
            else{
                console.log( 'Error:', images[i], 'was not downloaded.' );
                console.error( result );
            }  
        }
        console.log("All Images Downloaded");
        await browser.close();//closes chromium browser
    };
    main(); 
}
app.listen(port, function() {
    DoStuff();    
});