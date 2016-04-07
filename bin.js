#!/usr/bin/env node

/**
 * Proxy nssm bin, inspired by
 * https://github.com/Medium/phantomjs/blob/master/bin/phantomjs
 */

var path = require('path')
var spawn = require('child_process').spawn

var nssm = require("./index.js")

var args = process.argv.slice(2)

if (["--version", "-v"].indexOf(args[0])>-1) {
  console.log(nssm.version)
  console.log(nssm.path)
  process.exit(0)
}

var binPath = nssm.path;
// For Node 0.6 compatibility, pipe the streams manually, instead of using
// `{ stdio: 'inherit' }`.
var cp = spawn(binPath, args)
cp.stdout.pipe(process.stdout)
cp.stderr.pipe(process.stderr)
process.stdin.pipe(cp.stdin)

cp.on('error', function (err) {
  console.error('Error executing nssm at', binPath)
  console.error(err.stack)
})

cp.on('exit', function(code){
  // Wait few ms for error to be printed.
  setTimeout(function(){
    process.exit(code)
  }, 20)
});

process.on('SIGTERM', function() {
  cp.kill('SIGTERM')
  process.exit(1)
})
