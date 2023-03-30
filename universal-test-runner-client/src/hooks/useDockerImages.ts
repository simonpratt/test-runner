import { apiConnector } from '../core/api.connector';

export const useDockerImages = () => {
  const {
    data: dockerImages,
    isLoading: dockerImagesLoading,
    isError: dockerImagesError,
    refetch: refetchDockerImages,
  } = apiConnector.dockerImages.getDockerImages.useQuery();

  return { dockerImages, dockerImagesLoading, dockerImagesError, refetchDockerImages };
};
