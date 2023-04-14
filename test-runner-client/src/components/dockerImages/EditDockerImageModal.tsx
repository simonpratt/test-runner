import React, { useEffect } from 'react';

import { Modal } from '@dtdot/lego';

import { apiConnector } from '../../core/api.connector';
import { useDockerImage } from '../../hooks/useDockerImage';
import DockerImageForm, { DockerImageFormValue } from './DockerImageForm';

export interface EditDockerImageModalProps {
  dockerImageId: string;
  onClose: () => void;
}

const EditDockerImageModal = ({ dockerImageId, onClose }: EditDockerImageModalProps) => {
  const [form, setForm] = React.useState<DockerImageFormValue>();
  const { dockerImage } = useDockerImage(dockerImageId);
  const {
    mutate: updateDockerImage,
    isLoading: updateDockerImageLoading,
    isSuccess: updateDockerImageSuccess,
  } = apiConnector.dockerImages.updateDockerImage.useMutation();

  useEffect(() => {
    if (dockerImage && !form) {
      setForm({
        dockerImage: dockerImage.dockerImage,
        startCommand: dockerImage.startCommand || '',
        isLocalImage: dockerImage.isLocalImage ? 'yes' : 'no',
        concurrency: dockerImage.concurrency,
      });
    }
  }, [dockerImage, form, setForm]);

  useEffect(() => {
    if (updateDockerImageSuccess) {
      onClose();
    }
  }, [updateDockerImageSuccess, onClose]);

  const handleSubmit = async () => {
    if (form) {
      updateDockerImage({
        ...form,
        concurrency: form.concurrency,
        isLocalImage: form.isLocalImage === 'yes',
        dockerImageId: dockerImageId,
      });
    }
  };

  return (
    <Modal onClose={onClose} loading={!form}>
      <Modal.Header header='Edit Docker Image' />
      <Modal.Body>
        {form && (
          <DockerImageForm
            value={form}
            onChange={setForm}
            onSubmit={handleSubmit}
            isSaving={updateDockerImageLoading}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EditDockerImageModal;
