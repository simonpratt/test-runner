import React, { useEffect } from 'react';

import { Button, ControlGroup, Form, Input, Modal } from '@dtdot/lego';

import { apiConnector } from '../../core/api.connector';

export interface NewDockerImageModalProps {
  onClose: () => void;
}

const NewDockerImageModal = ({ onClose }: NewDockerImageModalProps) => {
  const [form, setForm] = React.useState({
    name: 'Sample Image',
    dockerImage: 'sample',
    startCommand: 'node build/start.js',
  });
  const {
    mutate: submitJob,
    isLoading: submitJobLoading,
    isSuccess: submitJobSuccess,
  } = apiConnector.dockerImages.addDockerImage.useMutation();

  useEffect(() => {
    if (submitJobSuccess) {
      onClose();
    }
  }, [submitJobSuccess, onClose]);

  const handleSubmit = async () => {
    submitJob(form);
  };

  return (
    <Modal onClose={onClose}>
      <Modal.Header header='New Docker Image' />
      <Modal.Body>
        <Form value={form} onChange={setForm} onSubmit={handleSubmit}>
          <ControlGroup variation='comfortable'>
            <Input name='name' label='name' placeholder='test1.js,test2.js,test3.js' />
            <Input name='dockerImage' label='Docker Image' placeholder='sample' />
            <Input name='startCommand' label='Start Command' placeholder='node build/start.js' />
            <Button type='submit' loading={submitJobLoading}>
              Create
            </Button>
          </ControlGroup>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default NewDockerImageModal;
