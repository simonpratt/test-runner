const containers: { commandId: string; containerId: string }[] = [];

export default {
  registerNewContainer(config: { commandId: string; containerId: string }) {
    const { commandId, containerId } = config;

    containers.push({ commandId, containerId });
  },
  getRunningContainers() {
    return containers;
  },
  unregisterContainer(containerId: string) {
    const index = containers.findIndex((container) => container.containerId === containerId);

    if (index > -1) {
      containers.splice(index, 1);
    }
  },
  getRunningContainerCount() {
    return containers.length;
  },
};
