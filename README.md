## About

This is a proof of concept for running tests (or other distributed tasks) within a kubernetes cluster or docker environment. The core functionality is to spawn and track jobs based on the user provided start and discover commands for any given container.

## Usage

This project is made up of three main components

*universal-test-runner-api* is the owner of the queue and interacts with both the orchestrator and the client
*universal-test-runner-orchestrator* is responsible for spawning and tracking jobs
*universal-test-runner-client* is mostly for demo purposes and is responsible for allowing users to spawn new jobs

To run locally
1. Install [docker](https://docs.docker.com/install/)
2. Install dependencies and build the sample docker image using `npm run setup`
3. Copy the .env.example files in each of the sub-directories to .env and fill in the appropriate values
4. Start all services using `npm start` in each of the subdirectories
5. Navigate to `http://localhost:3000` and start a job using the placeholder values
