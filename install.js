var pkg         = require('./package.json')
var hyperquest  = require('hyperquest')
var extract     = require('extract-zip')
var path        = require('path');
var async       = require('async');
var fs          = require('fs');
var Spinner     = require('cli-spinner').Spinner;

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
  extract(dlFile, {dir: targetPath}, then)
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
