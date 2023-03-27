import { z } from 'zod';

interface IWindow {
  env: Record<string, string>;
}

const getWindow = () => window as any as IWindow;

const getEnvironment = () => {
  const { env: windowEnv } = getWindow();

  if (windowEnv) {
    return windowEnv;
  }

  const fromProcess = (import.meta as any).env;

  if (fromProcess) {
    return fromProcess;
  }
};

const schema = z.object({
  VITE_API_URL: z.string(),
  VITE_WS_URL: z.string(),
});

const environment = schema.parse(getEnvironment());

export default environment;
