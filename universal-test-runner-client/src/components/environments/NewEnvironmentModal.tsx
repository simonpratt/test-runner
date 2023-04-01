import React, { useEffect } from 'react';

import { Button, ControlGroup, Form, Input, Modal, TextArea } from '@dtdot/lego';

import { load } from 'js-yaml';

import { apiConnector } from '../../core/api.connector';

export interface NewEnvironmentModalProps {
  onClose: () => void;
}

const NewEnvironmentModal = ({ onClose }: NewEnvironmentModalProps) => {
  const [form, setForm] = React.useState({
    id: 'environment-01',
    name: 'Environment 01',
    variables: 'API_URL: http://xyz.com',
  });
  const {
    mutate: addEnvironment,
    isLoading: addEnvironmentLoading,
    isSuccess: addEnvironmentSuccess,
  } = apiConnector.environments.addEnvironment.useMutation();

  useEffect(() => {
    if (addEnvironmentSuccess) {
      onClose();
    }
  }, [addEnvironmentSuccess, onClose]);

  const handleSubmit = async () => {
    const { variables, ...otherFormVals } = form;
    const envVariables = load(variables) as Record<string, string>;
    const envVariablesArray = Object.entries(envVariables).map(([name, value]) => ({ name, value }));
    const postBody = { variables: envVariablesArray, ...otherFormVals };
    addEnvironment(postBody);
  };

  return (
    <Modal onClose={onClose}>
      <Modal.Header header='New Docker Image' />
      <Modal.Body>
        <Form value={form} onChange={setForm} onSubmit={handleSubmit}>
          <ControlGroup variation='comfortable'>
            <Input name='id' label='id' placeholder='environment-01' />
            <Input name='name' label='name' placeholder='Environment 01' />
            <TextArea name='variables' label='Variables' placeholder='API_URL: http://xyz.com' />
            <Button type='submit' loading={addEnvironmentLoading}>
              Create
            </Button>
          </ControlGroup>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default NewEnvironmentModal;
