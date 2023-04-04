import { RunCommandEvent } from '../../test-runner-api/src/commandLoop';
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

const startWatchingForNewJobs = async () => {
  const subscriber = new RabbitInstance(environment.RABBITMQ_JOB_EXCHANGE);
  subscriber.subscribe('COMMAND.RUN', async (payload) => {
    const command = payload as RunCommandEvent;

    console.log(`Running command: docker run ${command.dockerImage} ${command.startCommand}`);

    let containerId: string | undefined;
    try {
      containerId = await kubernetesService.startContainer({
        commandId: command.commandId,
        dockerImage: command.dockerImage,
        command: command.startCommand,
        variables: command.variables,
      });
      containerManagerService.registerNewContainer({ containerId, commandId: command.commandId });
    } catch (err) {
      await apiConnector.orchestrator.markCommandAborted.mutate({ commandId: command.commandId });

      if (containerId) {
        containerManagerService.unregisterContainer(containerId);
      }
    }
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
          console.log(`Container ${container.containerId} has restarted`);
          break;
        case 'running':
        case 'pending':
          // do nothing
          break;
        case 'unknown':
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
