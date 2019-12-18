const fs = require('fs');
const path = require('path');

// // returns the list of one directory
// fs.readdir(process.cwd(), function(err, files) {
    
//     files.forEach((file,index) => {
//         // fs.readFile(file, 'utf8', function(err, contents) {
//         //     if(contents === 'TODO')
//         //     console.log(contents);
//         // });
//         console.log(file);
//     });
// })
let filesArray = [];
var walk = function(dir, done) {
    fs.readdir(dir, function(err, list) {
      if (err) return done(err);
      var pending = list.length;
      if (!pending) return done(null, filesArray);
      list.forEach(function(file) {
        file = path.resolve(dir, file);
        fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            walk(file, function(err, res) {
              filesArray = filesArray.concat(res);
              if (!--pending) done(null, filesArray);
            });
          } else {
            filesArray.push(file);
            if (!--pending) done(null, filesArray);
          }
        });
      });
    });
  };

  walk(process.cwd(), function(err, results) {
    if (err) throw err;
    console.log(results);
  });