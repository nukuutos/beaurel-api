const express = require("express");
const path = require("path");

const pathToFolder = path.join(__dirname, "images");

module.exports = express.static(pathToFolder);
