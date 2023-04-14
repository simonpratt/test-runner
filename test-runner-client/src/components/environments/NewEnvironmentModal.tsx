import React, { useEffect } from 'react';

import { Modal } from '@dtdot/lego';

import { load } from 'js-yaml';

import { apiConnector } from '../../core/api.connector';
import EnvironmentForm, { EnvironmentFormValue } from './EnvironmentForm';

export interface NewEnvironmentModalProps {
  onClose: () => void;
}

const NewEnvironmentModal = ({ onClose }: NewEnvironmentModalProps) => {
  const [form, setForm] = React.useState<EnvironmentFormValue>({
    id: 'environment-01',
    name: 'Environment 01',
    variables: 'API_URL: http://xyz.com',
    concurrencyLimit: 4,
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
      <Modal.Header header='New Environment' />
      <Modal.Body>
        <EnvironmentForm value={form} onChange={setForm} onSubmit={handleSubmit} isSaving={addEnvironmentLoading} />
      </Modal.Body>
    </Modal>
  );
};

export default NewEnvironmentModal;
