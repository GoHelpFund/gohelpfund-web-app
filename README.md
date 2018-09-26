# Introduction

1.  A Docker container that can manage the web application and reverse proxy.
3.  A react web application that offers all the business logic within the GoHelpFund platform.
4.  A nginx server used as a reverse proxy to sit between the users and the web application.

# Software needed
1.	React (https://reactjs.org/).
2.	Docker (http://docker.com). 
3.	Nginx (https://www.nginx.com/).

# Before you start
- If you are on a local environment, make sure you have installed docker locally.
- If you are on a Windows local environment, enable the 'Expose daemon on tcp://localhost:2375 without TLS' option from general settings UI.
- If you encounter any issues with the local environment docker container or simply wish to remove all docker images, click the 'Reset to factory defaults...' option from reset settings UI. Don't forget to enable the previous option after reset.

# Install Web App dependencies
Run the following npm command.  This command will execute the installs a package, and any packages that it depends on defined in the package.json file.  

   **npm install**

# Generating the React build
Run the following npm command.  This command will execute the [react-scripts plugin](https://www.npmjs.com/package/react-scripts) defined in the package.json file.  

   **npm run build**

# Building the Docker image
- The docker image name format is: docker-hub-username/artifact-name:tag
- In our case : gohelpfund/ghf-web-app:latest

Run the following npm command.  This command will execute the [docker build](https://docs.docker.com/engine/reference/commandline/build/) command defined in the package.json file.  

   **npm run docker:build**

# Uploading the Docker image
- Before running the command, you have to be logged in the docker hub(via the docker UI)
- If you don't have an account, head to [docker hub](https://hub.docker.com/) and create one.

Run the following npm command.  This command will execute the [docker push](https://docs.docker.com/engine/reference/commandline/push/) command defined in the package.json file.  

   **npm run docker:push**

- The docker image from the previous step is being uploaded to the [Docker Hub](https://hub.docker.com/explore/).
- You can think of it as Github is for repositories/projects.
- By default, the image is public and available to download and inspection by everyone.

# Starting/deploying a Docker container locally
Run the following npm command.  This command will execute the [docker-compose](https://docs.docker.com/compose/) command defined in the package.json file.  

   **npm run docker:deploy:local**

- docker-compose is a tool that helps you define and run multi-container docker applications via a configuration file (docker-compose.yml)
- You can setup environment variabls, ports, memory allocation per each individual docker container.
- The 'image:' option on a local environment, pulls the image defined from the local docker platform (not from Docker Hub) 
- Docker useful commands : 'docker ps', 'docker stats', 'docker logs -f <container-id>', 'docker images'

# Starting/deploying a Docker container remotely
- Before starting/deploying remotely (in our case to [AWS ECS](https://eu-central-1.console.aws.amazon.com/ecs/)), make sure you have created a cluster on ECS and configured [ecs-cli](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_CLI_Configuration.html).

Run any of the following npm commands.  This command will execute the [ecs-cli compose](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cmd-ecs-cli-compose.html) command defined in the package.json file.  

   **npm run docker:deploy:dev**
   
   **npm run docker:deploy:prod**

- ecs-cli provides high-level commands to simplify creating, updating, and monitoring clusters and tasks(~docker images)
- ecs-cli compose allows you to manage Amazon ECS tasks with docker-compose-style commands on an ECS cluster
- it is recommended that you set the 'mem_limit' option per each docker container and set the 'links' option if you want to enable communication to other containers
- The 'image' option on a remote environment, pulls the image defined from the Docker Hub (by default the image must be public)