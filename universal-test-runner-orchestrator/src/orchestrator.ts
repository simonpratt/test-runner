import { apiConnector } from './core/api.connector';
import environment from './core/environment';
import containerManagerService from './services/containerManager.service';
import dockerService from './services/docker.service';

const wait = (ms: number) => {
  return new Promise((r) => setTimeout(r, ms));
};

let running = true;

export const stopOrchestrator = () => {
  running = false;
};

const startWatchingForNewJobs = async () => {
  while (running) {
    if (containerManagerService.getRunningContainerCount() < environment.MAX_CONCURRENT_TASKS) {
      const command = await apiConnector.orchestrator.getNextCommand.query();

      if (command) {
        console.log(`Running command: docker run ${command.dockerImage} ${command.command}`);

        const containerId = await dockerService.startContainer({
          commandId: command.id,
          dockerImage: command.dockerImage,
          command: command.command,
        });

        containerManagerService.registerNewContainer({ containerId, commandId: command.id });
      }
    }

    await wait(1000);
  }
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
