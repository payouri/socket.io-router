# socket.io-router
socket.io express like router

## Router
```json
  "scripts": {
    "clean": "rm -rf ./dist",
    "build": "tsc",
    "clean-build": "npm run clean && npm run build",
    "prepublishOnly": "npm run clean && npm build",
    "start:example": "nodemon --watch \"./\" --ext \"ts,json\" --ignore \"src/**/*.spec.ts\" --exec \"ts-node ./example/index.ts\""
  },
```
## Client

```json
  "scripts": {
    "clean": "rm -rf ./dist",
    "build": "tsc",
    "prepublishOnly": "npm run clean && npm run build",
    "build-example": "npm run prepublishOnly && node ./node_modules/.bin/webpack --config ./example/webpack.config.js",
    "start-example": "npx webpack serve -c ./example/webpack.config.js"
  },
```
