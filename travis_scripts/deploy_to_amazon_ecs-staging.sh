#!/bin/sh
echo "Launching $BUILD_NAME IN AWS Elastic Container Service"
ecs-cli configure profile --profile-name ghf-web-app --access-key $AWS_ACCESS_KEY --secret-key $AWS_SECRET_KEY
ecs-cli configure --region eu-central-1 --cluster staging-gohelpfund-web-app
ecs-cli compose --file docker/staging-web/docker-compose.yml --ecs-params docker/staging-web/ecs-params.yml up
rm -rf ~/.ecs
