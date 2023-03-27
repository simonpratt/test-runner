import { exec as execCallback } from 'child_process';
import util from 'util';

const exec = util.promisify(execCallback);

export default {
  async startContainer(config: { commandId: string; dockerImage: string; command: string }) {
    const { commandId, dockerImage, command } = config;

    const { stdout, stderr } = await exec(
      `docker run -d --env DISCOVERY_POST_URL=http://host.docker.internal:9001/discovery/${commandId} ${dockerImage} ${command}`,
    );

    const containerId = stdout.trim();
    return containerId;
  },

  async getContainerStatus(containerId: string) {
    const { stdout, stderr } = await exec(`docker inspect  -f {{.State.Status}} ${containerId}`);
    const status = stdout.trim();
    return status;
  },
};
