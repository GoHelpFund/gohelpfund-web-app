#!/bin/sh
echo "Launching $BUILD_NAME IN AMAZON Elastic Container Service"
ecs-cli configure profile --profile-name ghf-web-app --access-key $AWS_ACCESS_KEY --secret-key $AWS_SECRET_KEY
ecs-cli configure --region eu-central-1 --cluster ecs-eu-central-1-ghf-web-app
ecs-cli compose --file docker/dev-web/docker-compose.yml up
rm -rf ~/.ecs
