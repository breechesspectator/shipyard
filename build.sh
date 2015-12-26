#!/bin/sh

echo "Building client ..."
tsc -p src/ts/client && browserify src/js/client/App.js -o src/resources/main.js
echo "Building server ..."
tsc -p src/ts/server