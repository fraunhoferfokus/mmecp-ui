# Streetlife-MMECP-UI #

Implementation of STREETLIFE Mobility and Emission Control Panel UI with AngularJS.

## Technologies ##

* AngularJS
* node.js (npm)
* bower / grunt
* git

## Installation ##

*   git
*   node.js (https://nodejs.org/ - Install button on start page)

## Setup ##

*   clone this repository
*   execute following commands in your project home directory
    *   npm install
    *   grunt
    *   npm start
*   MMECP is available at localhost:8000/app

## 4 Dev's ##

With `npm install` your node.js dependencies like bower & grunt will be installed. After installing bower all necessary libraries can be installed with `bower install` if bower is installed
globally or with `node_modules/bower/bin/bower install` in case of a local installation.

With Grunt the javascript and stylesheet files and also your own files under `public/*` will be injected in the
index.html. Therefore the dev-task was registered and can be executed with `grunt` or `grunt dev`. Two more tasks are:

*   `grunt test`

    Checks your own javascript files with jshint and starts a watchdog which registers any change in this files. With
`grunt jshint` won't be executed.

*   `grunt prod`

    This task is for production mode and concatenates, minimizes (also uglify) and injects all javascript
and stylesheet files,. it will also remove all console logs from the source code to make good version for production.

If you don't have grunt installed globally, then you have to use following command: `./node_modules/.bin/grunt` (Unix)
or `node_modules\.bin\grunt` (Windows)
To install grunt globally, type: `npm install -g grunt`
