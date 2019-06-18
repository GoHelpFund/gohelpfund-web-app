#!/bin/sh
echo "Building with travis commit of $BUILD_NAME ..."
docker build -t gohelpfund/ghf-web-app:$BUILD_NAME .