import React, { useEffect } from 'react';

import { Button, ControlGroup, Form, Input, Modal, Select } from '@dtdot/lego';

import { apiConnector } from '../../core/api.connector';

export interface NewDockerImageModalProps {
  onClose: () => void;
}

const NewDockerImageModal = ({ onClose }: NewDockerImageModalProps) => {
  const [form, setForm] = React.useState({
    dockerImage: 'sample',
    startCommand: '',
    isLocalImage: '',
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
    addDockerImage({ ...form, isLocalImage: form.isLocalImage === 'yes' });
  };

  const isLocalImageOptions = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ];

  return (
    <Modal onClose={onClose}>
      <Modal.Header header='New Docker Image' />
      <Modal.Body>
        <Form value={form} onChange={setForm} onSubmit={handleSubmit}>
          <ControlGroup variation='comfortable'>
            <Input
              name='dockerImage'
              label='Docker Image'
              placeholder='sample'
              description='Name of the docker image that runs the tests'
            />
            <Input
              name='startCommand'
              label='Start Command'
              placeholder='node build/start.js'
              description='Start command for the docker container.\nLeave blank to use the default start command for the image'
            />
            <Select
              name='isLocalImage'
              label='Local Image'
              options={isLocalImageOptions}
              description='Is the docker image one that was built locally or one that is pulled from a registry?'
            />
            <Button type='submit' loading={addDockerImageLoading}>
              Create
            </Button>
          </ControlGroup>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default NewDockerImageModal;
