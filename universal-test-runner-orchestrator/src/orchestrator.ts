import { Command, DockerImageConfig, Job } from 'universal-test-runner-api/src/generated/client';

import { apiConnector } from './core/api.connector';
import environment from './core/environment';
import { RabbitInstance } from './external/rabbit/rabbit.instance';
import containerManagerService from './services/containerManager.service';
import kubernetesService from './services/kubernetes.service';

const wait = (ms: number) => {
  return new Promise((r) => setTimeout(r, ms));
};

let running = true;

export const stopOrchestrator = () => {
  running = false;
};

type CommandWithJob = Command & {
  Job: Job & {
    dockerImageConfig: DockerImageConfig;
  };
};

const startWatchingForNewJobs = async () => {
  const subscriber = new RabbitInstance(environment.RABBITMQ_JOB_EXCHANGE);
  subscriber.subscribe('COMMAND.NEW', async (payload) => {
    const command = payload as CommandWithJob;

    console.log(
      `Running command: docker run ${command.Job.dockerImageConfig.dockerImage} ${command.Job.dockerImageConfig.startCommand}`,
    );

    const containerId = await kubernetesService.startContainer({
      commandId: command.id,
      dockerImage: command.Job.dockerImageConfig.dockerImage,
      command: command.Job.dockerImageConfig.startCommand,
    });

    containerManagerService.registerNewContainer({ containerId, commandId: command.id });
  });
};

const startWatchingForFinishedContainers = async () => {
  while (running) {
    const runningConfig = containerManagerService.getRunningContainers();
    const podsSummary = await kubernetesService.getAllJobsSummary();

    for (const container of runningConfig) {
      const status = podsSummary.find((pod) => pod.name === container.containerId)?.status || 'unknown';

      switch (status) {
        case 'finished':
          console.log(`Container ${container.containerId} has finished`);
          containerManagerService.unregisterContainer(container.containerId);
          await apiConnector.orchestrator.markCommandFinished.mutate({ commandId: container.commandId });
          break;
        case 'failed':
        case 'unknown':
          console.log(`Container ${container.containerId} has restarted`);
          break;
        case 'running':
        case 'pending':
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
