var pkg         = require('./package.json')
var hyperquest  = require('hyperquest')
var path        = require('path');
var async       = require('async');
var fs          = require('fs');
var Spinner     = require('cli-spinner').Spinner;
var yauzl       = require("yauzl");
var mkdirp      = require("mkdirp");


var version     = pkg["x-version"];
var url         = "https://nssm.cc/release/nssm-" + version + ".zip";
var dlFile      = path.join(__dirname, "dl.zip")
var targetPath  = path.join(__dirname, "prebuilt")


var downloadFile = function (then) {

  fs.access(dlFile, fs.F_OK, function (err) {

    if (!err) {
      console.log("File already downloaded at %s", dlFile)
      return then()
    }

    console.log("Downloading %s to %s", url, dlFile)
    var spinner = new Spinner('please wait.. %s');
    spinner.setSpinnerString('|/-\\');
    spinner.start();

    var r = hyperquest(url);
    r.pipe(fs.createWriteStream(dlFile));
    r.on('error', function (err) {
      spinner.stop(true);
      then(err)
    })
    r.on('end', function () {
      spinner.stop(true);
      then()
    });
  });

}

var createUnzipDir = function (then) {
  fs.access(dlFile, fs.F_OK, function (err) {
    if(err) fs.mkdir(targetPath, then)
    else then()
  })
}

var unzipfile = function (then) {
  console.log("Unzipping to %s", targetPath)
  yauzl.open(dlFile, {lazyEntries: true}, function(err, zipfile) {
    if (err) throw err;
    zipfile.readEntry();
    zipfile.on("error", console.error.bind(console));
    zipfile.once("end", function() {
      zipfile.close();
      then();
    });
    zipfile.on("entry", function(entry) {
      if (/\/$/.test(entry.fileName)) {
        // directory file names end with '/'
        mkdirp(path.join(targetPath, entry.fileName), function(err) {
          if (err) throw err;
          zipfile.readEntry();
        });
      } else {
        // file entry
        zipfile.openReadStream(entry, function(err, readStream) {
          if (err) throw err;
          // ensure parent directory exists
          var k = path.join(targetPath, path.dirname(entry.fileName));
          mkdirp(k, function(err) {
            if (err) throw err;
            readStream.pipe(fs.createWriteStream(path.join(k, path.basename(entry.fileName))));
            readStream.on("end", function() {
              zipfile.readEntry();
            });
          });
        });
      }
    });
  });
}

var installedPath = require('./index.js').path;
fs.access(installedPath, fs.F_OK, function (err) {
  if (!err) {
    console.log("File already available at %s", installedPath)
    console.log("All done !")
  } else {
    async.series([
        downloadFile,
        createUnzipDir,
        unzipfile
    ], function (err) {
      if (err) {
        console.error(err.stack)
        throw err
      }
      console.log("All done !")
    });
  }
})
