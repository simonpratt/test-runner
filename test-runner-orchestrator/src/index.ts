import { startOrchestrator } from './orchestrator';
import { kubernetesStartupLog } from './services/kubernetes.service';

kubernetesStartupLog();
startOrchestrator();
