import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { RootRouter } from 'universal-test-runner-api';

import environment from './environment';

export const apiConnector = createTRPCProxyClient<RootRouter>({
  links: [
    httpBatchLink({
      url: environment.UNIVERSAL_TEST_RUNNER_API_URL,
    }),
  ],
});
