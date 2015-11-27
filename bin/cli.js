/* global require, process */

var fs = require("fs");
var chibi = require("../index.js");
var render = chibi.render;

var templatePath = process.argv[2];
var jsonPath = process.argv[3];

if (!templatePath || !jsonPath) {
    console.log("Usage: chibiprint [templateFile] [dataFile (JSON)]");
    process.exit();
}


