## About

This is a proof of concept for running tests (or other distributed tasks) within a kubernetes cluster or docker environment. The core functionality is to spawn and track jobs based on the configured start command for any given container. 

Future work could include improvements to the test discovery/selection process, test run prioritization, and a parallel mode to work with services like cypress dashboard.

## Usage

This project is made up of three main components

*universal-test-runner-api* is the owner of the queue and interacts with both the orchestrator and the client
*universal-test-runner-orchestrator* is responsible for spawning and tracking jobs
*universal-test-runner-client* is mostly for demo purposes and is responsible for allowing users to spawn new jobs

To run locally
1. Install [docker](https://docs.docker.com/install/)
1. Copy the .env.example files in each of the sub-directories to .env and fill in the appropriate values
1. Install dependencies and build the sample docker image using `npm run setup`
1. Push the db schema using `npx prisma db push` within the `universal-test-runner-api` folder
1. Start all services using `npm start` in each of the subdirectories

To start a sample run
1. Navigate to `http://localhost:3000` 
1. Create a docker config using the `sample` image and `node build/start.js` as the start command
1. Start a job using the docker config you just created and the default selector string
