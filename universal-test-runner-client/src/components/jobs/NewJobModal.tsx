import React, { useEffect } from 'react';

import { Button, ControlGroup, Form, Input, Modal } from '@dtdot/lego';

import { apiConnector } from '../../core/api.connector';

export interface NewJobModalProps {
  onClose: () => void;
}

const NewJobModal = ({ onClose }: NewJobModalProps) => {
  const [form, setForm] = React.useState({ dockerImage: '', startCommand: '', discoverCommand: '' });
  const {
    mutate: submitJob,
    isLoading: submitJobLoading,
    isSuccess: submitJobSuccess,
  } = apiConnector.job.submitJob.useMutation();

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
      <Modal.Header header='New Job' />
      <Modal.Body>
        <Form value={form} onChange={setForm} onSubmit={handleSubmit}>
          <ControlGroup variation='comfortable'>
            <Input name='dockerImage' label='Docker Image' placeholder='sample' />
            <Input name='discoverCommand' label='Discovery Command' placeholder='node build/discover.ts' />
            <Input name='startCommand' label='Start Command' placeholder='node build/start.js <spec>' />
            <Button type='submit' loading={submitJobLoading}>
              Start
            </Button>
          </ControlGroup>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default NewJobModal;
