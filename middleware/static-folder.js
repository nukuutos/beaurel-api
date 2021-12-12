const express = require('express');
const path = require('path');

const pathToFolder = path.rootJoin('images');

module.exports = express.static(pathToFolder);
