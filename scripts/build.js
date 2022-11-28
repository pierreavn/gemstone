const fs = require('fs');
const pkg = require('../package.json');
const { ZipFile } = require("yazl");

// Output Zip Archive
const OUTPUT = "dist/gemstone.zip";

// List of files to add to archive
//  source => destination
const FILES = {
  "README.md": "README.md",
  "LICENSE": "LICENSE",
  "src/config.json": "config.json",
  "dist/javascripts/theme.js": "javascripts/theme.js",
  "dist/javascripts/theme.js.LICENSE.txt": "javascripts/theme.js.LICENSE.txt",
  "dist/stylesheets/application.css": "stylesheets/application.css",
};

// Build archive
const archive = new ZipFile();
Object.keys(FILES).forEach(sourceFile => archive.addFile(sourceFile, FILES[sourceFile]));
archive.outputStream.pipe(fs.createWriteStream(OUTPUT)).on("close", function() {
  console.log(`Built theme archive! (${OUTPUT})`);
});

archive.end();
