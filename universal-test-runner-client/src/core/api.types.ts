import type { inferRouterOutputs } from '@trpc/server';
import { RootRouter } from 'universal-test-runner-api';

type RouterOutput = inferRouterOutputs<RootRouter>;

export type SubmitJob = RouterOutput['queue']['submitJob'];
