import { KubeConfig, KubernetesObjectApi, CoreV1Api, BatchV1Api, V1Job } from '@kubernetes/client-node';
import chalk from 'chalk';
import { load } from 'js-yaml';

import environment from '../core/environment';

const kubeConfig = Buffer.from(environment.KUBERNETES_CONFIG_BASE64, 'base64');
const kc = new KubeConfig();
kc.loadFromString(kubeConfig.toString());

const client = KubernetesObjectApi.makeApiClient(kc);
const batchApi = kc.makeApiClient(BatchV1Api);
const coreApi = kc.makeApiClient(CoreV1Api);

export const kubernetesStartupLog = async () => {
  try {
    await coreApi.readNamespace(environment.KUBERNETES_NAMESPACE);
    console.log(chalk.green(`[kubernetes] connected to namespace: ${environment.KUBERNETES_NAMESPACE}`));
  } catch (err: any) {
    console.log(chalk.red(`[kubernetes] failed to connect to namespace: ${environment.KUBERNETES_NAMESPACE}`));
    console.log(chalk.red(`[kubernetes] ${err?.body?.message}`));
  }
};

export const testKubernetesConnection = async () => {
  const response = await coreApi.readNamespace(environment.KUBERNETES_NAMESPACE);
  console.log(response);
};

const makeJobSpec = (commandId: string, dockerImage: string) => {
  return `
apiVersion: batch/v1
kind: Job
metadata:
  name: test-job-${commandId}
  namespace: ${environment.KUBERNETES_NAMESPACE}
spec:
  template:
    spec:
      containers:
      - name: test-job-${commandId}
        image: ${dockerImage}
        imagePullPolicy: Never
      restartPolicy: Never
  backoffLimit: 1
`;
};

export type JobStatus = 'pending' | 'running' | 'finished' | 'failed' | 'unknown';

export default {
  async startContainer(config: {
    commandId: string;
    dockerImage: string;
    command?: string;
    variables: { name: string; value: string }[];
  }) {
    const { commandId, dockerImage, command, variables } = config;
    console.log(variables);

    // Build the spec from the template yaml
    const kubesSpec = makeJobSpec(commandId, dockerImage);
    const yaml: V1Job = load(kubesSpec) as any;

    // Verify the container to make typescript happy
    if (!yaml.spec?.template.spec?.containers[0]) {
      throw new Error('At least one container expected');
    }

    // Set the environment variables and command
    yaml.spec.template.spec.containers[0].env = variables;
    yaml.spec.template.spec.containers[0].command = command ? command.split(' ') : undefined;

    // Create the job in kubernetes
    const result = await client.create(yaml);
    const jobId = result.body.metadata?.name;

    if (!jobId) {
      throw new Error('Job ID not found');
    }

    return jobId;
  },

  async getAllJobsSummary() {
    const jobs = await batchApi.listNamespacedJob(environment.KUBERNETES_NAMESPACE);

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
