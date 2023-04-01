import { KubeConfig, KubernetesObjectApi, KubernetesObject, BatchV1Api, V1Job } from '@kubernetes/client-node';
import { load } from 'js-yaml';

const kc = new KubeConfig();
kc.loadFromDefault();

const client = KubernetesObjectApi.makeApiClient(kc);
const batchApi = kc.makeApiClient(BatchV1Api);

const makeJobSpec = (commandId: string, dockerImage: string, command: string) => {
  return `
apiVersion: batch/v1
kind: Job
metadata:
  name: test-job-${commandId}
spec:
  template:
    spec:
      containers:
      - name: test-job-${commandId}
        image: sample
        imagePullPolicy: Never
        command: [${command
          .split(' ')
          .map((c) => `"${c}"`)
          .join(', ')}]
      restartPolicy: Never
  backoffLimit: 1
`;
};

export type JobStatus = 'pending' | 'running' | 'finished' | 'failed' | 'unknown';

export default {
  async startContainer(config: {
    commandId: string;
    dockerImage: string;
    command: string;
    variables: { name: string; value: string }[];
  }) {
    const { commandId, dockerImage, command, variables } = config;
    console.log(variables);

    // Build the spec from the template yaml
    const kubesSpec = makeJobSpec(commandId, dockerImage, command);
    const yaml: V1Job = load(kubesSpec) as any;

    // Verify the container to make typescript happy
    if (!yaml.spec?.template.spec?.containers[0]) {
      throw new Error('At least one container expected');
    }

    // Set the environment variables
    yaml.spec.template.spec.containers[0].env = variables;

    // Create the job in kubernetes
    const result = await client.create(yaml);
    const jobId = result.body.metadata?.name;

    if (!jobId) {
      throw new Error('Job ID not found');
    }

    return jobId;
  },

  async getAllJobsSummary() {
    const jobs = await batchApi.listNamespacedJob('default');

    const jobsSummary = jobs.body.items.map((job) => {
      const isFailed = !!job.status?.failed;
      const isPending = !!job.status?.ready;
      const isRunning = !!job.status?.active;
      const isFinished = job.status?.succeeded == job.spec?.completions;

      let status = 'unknown';
      if (isFailed) {
        status = 'failed';
      } else if (isRunning) {
        status = 'running';
      } else if (isPending) {
        status = 'pending';
      } else if (isFinished) {
        status = 'finished';
      }

      return {
        name: job.metadata?.name,
        status: status as JobStatus,
      };
    });

    return jobsSummary;
  },
};
