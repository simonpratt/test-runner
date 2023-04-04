import React, { useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { createWSClient, wsLink } from '@trpc/client';
import { RootRouter } from 'test-runner-api';

import { apiConnector } from './api.connector';
import environment from './environment';

export interface TRPCProviderProps {
  children: React.ReactNode;
}

// create persistent WebSocket connection
const wsClient = createWSClient({
  url: environment.VITE_WS_URL,
});

export const wsConnector = createTRPCProxyClient<RootRouter>({
  links: [
    wsLink({
      client: wsClient,
    }),
  ],
});

export function TRPCProvider({ children }: TRPCProviderProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    // createTRPCProxyClient<RootRouter>({
    //   links: [
    //     httpBatchLink({
    //       url: environment.VITE_API_URL,
    //       // optional
    //       headers() {
    //         return {
    //           // authorization: getAuthCookie(),
    //         };
    //       },
    //     }),
    //     wsLink({
    //       client: wsClient,
    //     }),
    //   ],
    // }),
    apiConnector.createClient({
      links: [
        httpBatchLink({
          url: environment.VITE_API_URL,
          // optional
          headers() {
            return {
              // authorization: getAuthCookie(),
            };
          },
        }),
        wsLink({
          client: wsClient,
        }),
      ],
    }),
  );
  return (
    <apiConnector.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </apiConnector.Provider>
  );
}
