import { apiConnector } from '../core/api.connector';

export const useEnvironment = (id: string) => {
  const {
    data: environment,
    isLoading: environmentLoading,
    isError: environmentError,
    refetch: refetchEnvironment,
  } = apiConnector.environments.getEnvironment.useQuery({ id });

  return { environment, environmentLoading, environmentError, refetchEnvironment };
};
