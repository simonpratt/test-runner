import { apiConnector } from '../core/api.connector';

export const useEnvironments = () => {
  const {
    data: environments,
    isLoading: environmentsLoading,
    isError: environmentsError,
    refetch: refetchEnvironments,
  } = apiConnector.environments.getEnvironments.useQuery();

  return { environments, environmentsLoading, environmentsError, refetchEnvironments };
};
