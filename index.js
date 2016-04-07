var path = require('path')
var folder = process.architecture==="ia32" ? "win32" : "win64";
var pkg = require('./package.json')
var version     = pkg["x-version"];
module.exports = {
  version:  pkg["x-version"],
  path:     path.join(__dirname, "prebuilt", "nssm-" + pkg["x-version"], folder, "nssm.exe")
}
