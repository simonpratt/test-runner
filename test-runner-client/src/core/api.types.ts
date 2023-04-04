import type { inferRouterOutputs } from '@trpc/server';
import { RootRouter } from 'test-runner-api';

type RouterOutput = inferRouterOutputs<RootRouter>;

export type Job = RouterOutput['job']['getJobs'][0];
export type Command = RouterOutput['command']['getCommands'][0];
