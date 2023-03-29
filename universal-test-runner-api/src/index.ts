import { startCommandLoop } from './commandLoop';
import { startServer } from './server';

export { RootRouter } from './server';

startServer();
startCommandLoop();
