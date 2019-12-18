const fs = require('fs');
const path = require('path');
const readLine = require('readline');

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
            const readStream = fs.createReadStream(fileFolder); // read file through streams so that large files can be handled efficiently

            // creates an interface with the input stream(directory given above)
            const r1 = readLine.createInterface({
              input: readStream,
              crlfDelay: Infinity
            });

            // returns each line of type string
            r1.on('line', (line) => {
              
              if(line.includes('TODO')) {
                filesArray.push(fileFolder); // all the files in a directory are added to the array
                readStream.destroy(); // stop the line reading process once the string is found in the file 
              }
            });

           
            if (!--numberFilesFolders) done(null, filesArray);
          }
        });
      });
    });
  };

  // test function to see if the code executes 
  fileSearch(process.cwd(), function(error, filesArray) {
    if (error) throw error;
    console.log(filesArray);
  });