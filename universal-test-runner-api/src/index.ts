import { startCommandLoop } from './commandLoop';
import { startServer } from './server';

export type { RootRouter } from './server';

startServer();
startCommandLoop();
