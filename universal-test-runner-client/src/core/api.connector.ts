// import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { RootRouter } from 'universal-test-runner-api';

export const apiConnector = createTRPCReact<RootRouter>();
