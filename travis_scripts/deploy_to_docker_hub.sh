#!/bin/sh
echo "Pushing service docker images to docker hub ...."
docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
docker push gohelpfund/ghf-web-app:$BUILD_NAME