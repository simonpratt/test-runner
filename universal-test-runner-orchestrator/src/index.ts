import { startOrchestrator } from './orchestrator';
import { startServer } from './server';
import { kubernetesStartupLog } from './services/kubernetes.service';

kubernetesStartupLog();
startOrchestrator();
startServer();
