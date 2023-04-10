import { RootRouter } from '@test-runner/api';
import { createTRPCReact } from '@trpc/react-query';

export const apiConnector = createTRPCReact<RootRouter>();
