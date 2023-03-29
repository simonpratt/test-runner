import { Command, Job } from 'universal-test-runner-api/src/generated/client';

import { apiConnector } from './core/api.connector';
import environment from './core/environment';
import { RabbitInstance } from './external/rabbit/rabbit.instance';
import containerManagerService from './services/containerManager.service';
import dockerService from './services/docker.service';

const wait = (ms: number) => {
  return new Promise((r) => setTimeout(r, ms));
};

let running = true;

export const stopOrchestrator = () => {
  running = false;
};

type CommandWithJob = Command & {
  Job: Job;
};

const startWatchingForNewJobs = async () => {
  const subscriber = new RabbitInstance(environment.RABBITMQ_JOB_EXCHANGE);
  subscriber.subscribe('COMMAND.NEW', async (payload) => {
    const command = payload as CommandWithJob;

    console.log(`Running command: docker run ${command.Job.dockerImage} ${command.Job.startCommand}`);

    const containerId = await dockerService.startContainer({
      commandId: command.id,
      dockerImage: command.Job.dockerImage,
      command: command.Job.startCommand,
    });

    containerManagerService.registerNewContainer({ containerId, commandId: command.id });
  });
};

const startWatchingForFinishedContainers = async () => {
  while (running) {
    const runningConfig = containerManagerService.getRunningContainers();

    for (const container of runningConfig) {
      const status = await dockerService.getContainerStatus(container.containerId);

      switch (status) {
        case 'exited':
          console.log(`Container ${container.containerId} has exited`);
          containerManagerService.unregisterContainer(container.containerId);
          await apiConnector.orchestrator.markCommandFinished.mutate({ commandId: container.commandId });
          break;
        case 'restarting':
          console.log(`Container ${container.containerId} has restarted`);
          break;
        case 'running':
          // do nothing
          break;
        default:
          console.log(`Container ${container.containerId} has unknown status: ${status}`);
      }
    }

    await wait(5000);
  }
};

export const startOrchestrator = async () => {
  await Promise.all([startWatchingForNewJobs(), startWatchingForFinishedContainers()]);
};
