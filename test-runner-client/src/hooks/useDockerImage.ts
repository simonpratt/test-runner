import { apiConnector } from '../core/api.connector';

export const useDockerImage = (id: string) => {
  const {
    data: dockerImage,
    isLoading: dockerImageLoading,
    isError: dockerImageError,
    refetch: refetchDockerImage,
  } = apiConnector.dockerImages.getDockerImage.useQuery({ dockerImageId: id });

  return { dockerImage, dockerImageLoading, dockerImageError, refetchDockerImage };
};
