import React, { useEffect } from 'react';

import { Alert, Button, ControlGroup, Form, Input, Modal, Select } from '@dtdot/lego';

import { apiConnector } from '../../core/api.connector';
import { useDockerImages } from '../../hooks/useDockerImages';
import { useEnvironments } from '../../hooks/useEnvironments';

export interface NewJobModalProps {
  onClose: () => void;
}

const NewJobModal = ({ onClose }: NewJobModalProps) => {
  const { dockerImages, dockerImagesLoading, dockerImagesError } = useDockerImages();
  const { environments, environmentsLoading, environmentsError } = useEnvironments();

  const [form, setForm] = React.useState({
    dockerImageConfigId: '',
    environmentId: '',
    selector: 'test1.js,test2.js,test3.js',
  });
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

  if (dockerImagesError || environmentsError) {
    return (
      <Modal onClose={onClose}>
        <Modal.Body>
          <Alert variant='warn' message='Error loading data...' />
        </Modal.Body>
      </Modal>
    );
  }

  const isLoading = dockerImagesLoading || !dockerImages || environmentsLoading || !environments;

  const dockerImageSelectOptions =
    dockerImages?.map((dockerImage) => ({
      label: dockerImage.name,
      value: dockerImage.id,
    })) || [];

  const environmentSelectOptions =
    environments?.map((dockerImage) => ({
      label: dockerImage.name,
      value: dockerImage.id,
    })) || [];

  return (
    <Modal loading={isLoading} onClose={onClose}>
      <Modal.Header header='New Job' />
      <Modal.Body>
        <Form value={form} onChange={setForm} onSubmit={handleSubmit}>
          <ControlGroup variation='comfortable'>
            <Select
              name='dockerImageConfigId'
              label='Docker Image'
              placeholder='Select docker image'
              options={dockerImageSelectOptions}
            />
            <Select
              name='environmentId'
              label='Environment'
              placeholder='Select environment'
              options={environmentSelectOptions}
            />
            <Input name='selector' label='Selector' placeholder='test1.js,test2.js,test3.js' />
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
