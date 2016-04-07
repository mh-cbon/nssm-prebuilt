# nssm-prebuilt

Node package to download and install `nssm` on windows.

# Install

```sh
npm install @mh-cbon/nssm-prebuilt --save
```

# Usage

```js
var nssm = require('@mh-cbon/nssm-prebuilt')

console.log("nssm version %s availabe at path %s", nssm.version, nssm.path)
```

# Binary

This package also comes with a binary proxy to `nssm.exe` file.

```sh
$ npm install @mh-cbon/nssm-prebuilt -g
$ nssm --version
2.24
C:\some\path\to\nssm.exe
```

# Read more

- https://nssm.cc/
