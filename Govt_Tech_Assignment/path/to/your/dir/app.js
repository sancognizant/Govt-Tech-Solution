const fs = require('fs');
const path = require('path');

let filesArray = [];
// fileSearch takes 2 args, directory path & a callback function 
function fileSearch(dir, done) {
    // fs.readdir takes 2 arg, directory path and a callback of the list of subdirectories and files in the directory
    fs.readdir(dir, function(error, filesFolders) {
      if (error) return done(error);
      let numberFilesFolders = filesFolders.length; // gets the number of files or folders in the current diretory
      if (numberFilesFolders == 0) return done(null, filesArray);
      filesFolders.forEach(function(fileFolder) {
        fileFolder = path.resolve(dir, fileFolder); //getting the path of the file or directory 
        fs.stat(fileFolder, function(err, stat) {
          if (stat && stat.isDirectory()) { // if it is a subdirectory, through recursion, repeat above steps to search for .js files
            fileSearch(fileFolder, function(error, subFilesArray) {
              if (!--numberFilesFolders) done(null, filesArray);
            });
          } else {
            filesArray.push(fileFolder);
            if (!--numberFilesFolders) done(null, filesArray);
          }
        });
      });
    });
  };

  fileSearch(process.cwd(), function(error, filesArray) {
    if (error) throw error;
    console.log(filesArray);
  });