#!/usr/bin/env node

/* global require, process */

var fs = require("fs");
var chibi = require("../index.js");
var render = chibi.render;

var templatePath = process.argv[2];
var jsonPath = process.argv[3];
var outputFile = process.argv[4];

if (!templatePath || !jsonPath) {
    console.log("Usage: chibiprint [templateFile] [dataFile (JSON)] [outputFile (optional)]");
    process.exit();
}

if (outputFile) {
    fs.writeFileSync(outputFile, render(templatePath, JSON.parse(fs.readFileSync(jsonPath))));
}
else {
    console.log(render(templatePath, JSON.parse(fs.readFileSync(jsonPath))));
}

