import React, { useEffect } from 'react';

import { Modal } from '@dtdot/lego';

import { apiConnector } from '../../core/api.connector';
import DockerImageForm, { DockerImageFormValue } from './DockerImageForm';

export interface NewDockerImageModalProps {
  onClose: () => void;
}

const NewDockerImageModal = ({ onClose }: NewDockerImageModalProps) => {
  const [form, setForm] = React.useState<DockerImageFormValue>({
    dockerImage: 'ghcr.io/simonpratt/test-runner-mock',
    startCommand: '',
    isLocalImage: 'no',
    concurrency: 'PARALLEL',
  });
  const {
    mutate: addDockerImage,
    isLoading: addDockerImageLoading,
    isSuccess: addDockerImageSuccess,
  } = apiConnector.dockerImages.addDockerImage.useMutation();

  useEffect(() => {
    if (addDockerImageSuccess) {
      onClose();
    }
  }, [addDockerImageSuccess, onClose]);

  const handleSubmit = async () => {
    addDockerImage({ ...form, concurrency: form.concurrency, isLocalImage: form.isLocalImage === 'yes' });
  };

  return (
    <Modal onClose={onClose}>
      <Modal.Header header='New Docker Image' />
      <Modal.Body>
        <DockerImageForm value={form} onChange={setForm} onSubmit={handleSubmit} isSaving={addDockerImageLoading} />
      </Modal.Body>
    </Modal>
  );
};

export default NewDockerImageModal;
